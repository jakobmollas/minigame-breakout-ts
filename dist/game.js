import { Ball } from './ball.js';
import { Bat } from './bat.js';
import { Brick } from './brick.js';
import { GameTime } from './gametime.js';
import { Point2d } from './point2d.js';
import { Box } from './box.js';
import * as UI from "./ui.js";
import * as Collisions from './collisions.js';
import * as Constants from './constants.js';
import * as Colors from "./colors.js";
var GameState;
(function (GameState) {
    GameState[GameState["LAUNCHING"] = 0] = "LAUNCHING";
    GameState[GameState["RUNNING"] = 1] = "RUNNING";
    GameState[GameState["LEVEL_UP"] = 2] = "LEVEL_UP";
    GameState[GameState["BALL_LOST"] = 3] = "BALL_LOST";
    GameState[GameState["GAME_OVER"] = 4] = "GAME_OVER";
})(GameState || (GameState = {}));
;
let ball, bat, bricks;
let score, lives, gameSpeed, level, numberOfBrickHits;
let topWallHasBeenHit, topRowsHasBeenHit, ballIsLost;
let ctx, gameState;
let inputCenterX = 0;
const gameTime = new GameTime();
window.onload = initialize;
function initialize() {
    ctx = setupCanvasContext();
    document.addEventListener("touchmove", touchMove);
    document.addEventListener("touchend", touchEnd);
    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mousedown", mouseDown);
    createGameObjects();
    startNewGame();
    window.requestAnimationFrame(mainLoop);
}
function setupCanvasContext() {
    const canvas = document.getElementById("game-canvas");
    canvas.width = Constants.fullWidth;
    canvas.height = Constants.fullHeight;
    const ctx = canvas.getContext('2d');
    return ctx;
}
function mainLoop() {
    gameTime.update();
    processGameLogic();
    render();
    window.requestAnimationFrame(mainLoop);
}
function processGameLogic() {
    if (gameState === GameState.LAUNCHING || gameState === GameState.RUNNING) {
        moveBat();
        moveBall();
        updateBallColor();
    }
    if (gameState === GameState.RUNNING) {
        handleBallToWallCollision();
        handleBallToBatCollision();
        handleBallToBrickCollision();
        handleSpeedUp();
        handleBatSize();
        handleBallLost();
        handleLevelUp();
        handleGameOver();
    }
}
function render() {
    clearBackground();
    drawBorders();
    // game objects are drawn in an area excluding borders
    ctx.save();
    ctx.translate(Constants.borderWidth, Constants.borderWidth);
    bricks.forEach(b => b === null || b === void 0 ? void 0 : b.draw(ctx));
    bat.draw(ctx);
    ball.draw(ctx);
    ctx.restore();
    UI.drawGameStats(ctx, score, lives);
    switch (gameState) {
        case GameState.LEVEL_UP:
            UI.drawLevelUp(ctx);
            break;
        case GameState.BALL_LOST:
            UI.drawBallLost(ctx);
            break;
        case GameState.GAME_OVER:
            UI.drawGameOver(ctx);
            break;
    }
}
function moveBat() {
    bat.x = clamp(inputCenterX - bat.width / 2, 0, Constants.gameAreaWidth - bat.width);
}
function moveBall() {
    if (gameState === GameState.RUNNING) {
        ball.move(gameSpeed * gameTime.deltaTimeFactor);
        return;
    }
    positionBallOnTopOfBat(ball, bat);
}
function updateBallColor() {
    // Match color of bricks at current row
    const rowNumber = getBrickCoordsFromGameAreaXY(ball.x, ball.y).y;
    ball.color = getRowColor(rowNumber);
}
function positionBallOnTopOfBat(ball, bat) {
    ball.x = bat.x + bat.width / 2;
    ball.y = bat.y - ball.radius;
}
function handleBallToWallCollision() {
    const gameArea = new Box(0, 0, Constants.gameAreaWidth, Constants.gameAreaHeight);
    const pointOfImpact = Collisions.ballToInnerBox(ball, gameArea);
    switch (pointOfImpact) {
        case Collisions.PointOfImpact.LEFT:
        case Collisions.PointOfImpact.RIGHT:
            bounceBallAgainstHorizontalWall(ball);
            break;
        case Collisions.PointOfImpact.TOP:
            bounceBallAgainstTopWall(ball);
            break;
        case Collisions.PointOfImpact.BOTTOM:
            ballIsLost = true;
            break;
    }
}
function bounceBallAgainstHorizontalWall(ball) {
    ball.invertX();
    ball.x = clamp(ball.x, ball.radius, Constants.gameAreaWidth - ball.radius);
}
function bounceBallAgainstTopWall(ball) {
    ball.invertY();
    ball.y = ball.radius;
    topWallHasBeenHit = true;
}
function handleBallToBatCollision() {
    const pointOfImpact = Collisions.ballToBox(ball, bat);
    if (pointOfImpact !== Collisions.PointOfImpact.TOP)
        return;
    ball.invertY();
    ball.y = bat.y - ball.radius;
    // let point of impact affect bounce direction
    const impactRotation = ((ball.x - bat.x) / bat.width - 0.5) * 4;
    // clamp to some min/max angles to avoid very shallow angles
    const newHeading = clamp(ball.heading + impactRotation, -Math.PI * 0.80, -Math.PI * 0.20);
    ball.setHeading(newHeading);
}
function handleBallToBrickCollision() {
    const bricksToCheck = getBricksAtAndAroundBallPosition(ball, bricks);
    for (let brick of bricksToCheck.filter(b => b === null || b === void 0 ? void 0 : b.isActive)) {
        const pointOfImpact = Collisions.ballToBox(ball, brick);
        switch (pointOfImpact) {
            case Collisions.PointOfImpact.LEFT:
            case Collisions.PointOfImpact.RIGHT:
                ball.invertX();
                break;
            case Collisions.PointOfImpact.TOP:
            case Collisions.PointOfImpact.BOTTOM:
                ball.invertY();
                break;
            default:
                continue;
        }
        topRowsHasBeenHit = topRowsHasBeenHit || brick.isTopRow;
        numberOfBrickHits++;
        score += brick.score;
        brick.hit();
        return;
    }
}
function getBricksAtAndAroundBallPosition(ball, bricks) {
    let targetBricks = [];
    let bc = getBrickCoordsFromGameAreaXY(ball.x, ball.y);
    let above = getBrickAtCell(bricks, bc.x, bc.y - 1);
    let below = getBrickAtCell(bricks, bc.x, bc.y + 1);
    let left = getBrickAtCell(bricks, bc.x - 1, bc.y);
    let right = getBrickAtCell(bricks, bc.x + 1, bc.y);
    let center = getBrickAtCell(bricks, bc.x, bc.y);
    if (above)
        targetBricks.push(above);
    if (below)
        targetBricks.push(below);
    if (left)
        targetBricks.push(left);
    if (right)
        targetBricks.push(right);
    if (center)
        targetBricks.push(center);
    return targetBricks;
}
function handleSpeedUp() {
    if (numberOfBrickHits === 4 && gameSpeed < Constants.speed2) {
        gameSpeed = Constants.speed2;
    }
    else if (numberOfBrickHits === 12 && gameSpeed < Constants.speed3) {
        gameSpeed = Constants.speed3;
    }
    else if (topRowsHasBeenHit && gameSpeed < Constants.speed4) {
        gameSpeed = Constants.speed4;
    }
}
function handleBatSize() {
    if (topWallHasBeenHit && !bat.isShrunken) {
        bat.shrink();
    }
}
function handleBallLost() {
    if (ballIsLost) {
        gameState = GameState.BALL_LOST;
    }
}
function handleLevelUp() {
    if (level < 2 && getActiveBricks().length <= 0) {
        gameState = GameState.LEVEL_UP;
    }
}
function handleGameOver() {
    const isGameOver = (lives <= 1 && gameState === GameState.BALL_LOST) ||
        (level >= 2 && getActiveBricks().length <= 0);
    gameState = isGameOver ? GameState.GAME_OVER : gameState;
}
function clearBackground() {
    ctx.fillStyle = Colors.background;
    ctx.fillRect(0, 0, Constants.fullWidth, Constants.fullHeight);
}
function drawBorders() {
    ctx.fillStyle = Colors.border;
    ctx.fillRect(0, 0, Constants.borderWidth, Constants.fullHeight);
    ctx.fillRect(0, 0, Constants.fullWidth, Constants.borderWidth);
    ctx.fillRect(Constants.fullWidth - Constants.borderWidth, 0, Constants.borderWidth, Constants.fullHeight);
}
function touchEnd(e) {
    e.preventDefault();
    handleRestart();
}
function touchMove(e) {
    var _a, _b;
    let xPos = (_b = (_a = e.changedTouches[0]) === null || _a === void 0 ? void 0 : _a.pageX) !== null && _b !== void 0 ? _b : 0;
    inputCenterX = map(xPos, 0, window.innerWidth, 0, Constants.gameAreaWidth);
}
function mouseMove(e) {
    e.preventDefault();
    inputCenterX = map(e.pageX, 0, window.innerWidth, 0, Constants.gameAreaWidth);
}
function mouseDown(e) {
    e.preventDefault();
    handleRestart();
}
function handleRestart() {
    switch (gameState) {
        case GameState.LAUNCHING:
            gameState = GameState.RUNNING;
            break;
        case GameState.LEVEL_UP:
            levelUp();
            break;
        case GameState.BALL_LOST:
            nextBall();
            break;
        case GameState.GAME_OVER:
            startNewGame();
            return;
    }
}
function createGameObjects() {
    ball = new Ball(0, 0, Constants.ballRadius, Constants.initialBallDirection);
    bat = new Bat(Constants.gameAreaWidth / 2 - Constants.batWidth / 2, Constants.gameAreaHeight - 2 * Constants.batHeight, Constants.batWidth, Constants.batHeight, Colors.bat);
    bricks = createBricks();
}
function startNewGame() {
    score = 0;
    lives = 5;
    level = 1;
    prepareNextBall();
}
function levelUp() {
    // keep speed, bat size etc. on level up
    ball.reset();
    resetBricks();
    level++;
    gameState = GameState.LAUNCHING;
}
function nextBall() {
    lives--;
    prepareNextBall();
}
function prepareNextBall() {
    bat.reset();
    ball.reset();
    numberOfBrickHits = 0;
    topRowsHasBeenHit = false;
    topWallHasBeenHit = false;
    ballIsLost = false;
    gameSpeed = Constants.speed1;
    gameState = GameState.LAUNCHING;
}
function createBricks() {
    let bricks = [];
    for (let row = 0; row < Constants.rows; row++) {
        for (let col = 0; col < Constants.columns; col++) {
            const x = col * Constants.brickWidth;
            const y = row * Constants.brickHeight;
            const color = getRowColor(row);
            const score = getRowScore(row);
            const isTopRow = row >= 4 && row <= 5;
            const isActive = row > 3;
            bricks.push(new Brick(x, y, Constants.brickWidth, Constants.brickHeight, color, score, isTopRow, isActive));
        }
    }
    return bricks;
}
function resetBricks() {
    bricks.forEach(b => b === null || b === void 0 ? void 0 : b.reset());
}
function getRowColor(rowNumber) {
    switch (rowNumber) {
        case 4: return Colors.brick1;
        case 5: return Colors.brick2;
        case 6: return Colors.brick3;
        case 7: return Colors.brick4;
        case 8: return Colors.brick5;
        case 9: return Colors.brick6;
        default: return Colors.brick1;
    }
}
function getRowScore(rowNumber) {
    switch (rowNumber) {
        case 4: return 7;
        case 5: return 7;
        case 6: return 4;
        case 7: return 4;
        case 8: return 1;
        case 9: return 1;
        default: return 0;
    }
}
function getBrickCoordsFromGameAreaXY(x, y) {
    let col = Math.floor(x / Constants.brickWidth);
    let row = Math.floor(y / Constants.brickHeight);
    return new Point2d(col, row);
}
function getBrickAtCell(bricks, col, row) {
    const index = row * Constants.columns + col;
    return index >= bricks.length ? null : bricks[index];
}
function getActiveBricks() {
    return bricks.filter(b => b === null || b === void 0 ? void 0 : b.isActive);
}
function clamp(value, min, max) {
    if (value > max)
        return max;
    if (value < min)
        return min;
    return value;
}
function map(value, inputMin, inputMax, outputMin, outputMax) {
    return (value - inputMin) / (inputMax - inputMin) * (outputMax - outputMin) + outputMin;
}
//# sourceMappingURL=game.js.map