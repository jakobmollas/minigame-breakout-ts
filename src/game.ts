import { Box } from './primitives/box.js';

import { Ball } from './objects/ball.js';
import { Bat } from './objects/bat.js';
import { Brick } from './objects/brick.js';

import { GameTime } from './logic/gametime.js';
import * as UI from "./logic/ui.js";
import * as Collisions from './logic/collisions.js';
import * as Stage from './logic/stage.js';

import * as Constants from './definitions/constants.js';
import * as Colors from "./definitions/colors.js";
import { GameState, PointOfImpact } from './definitions/constants.js';

let ball: Ball, bat: Bat, bricks: Brick[];
let score: number, lives: number, gameSpeed: number, level: number, numberOfBrickHits: number;
let topWallHasBeenHit: boolean, topRowsHasBeenHit: boolean, ballIsLost: boolean;
let ctx: CanvasRenderingContext2D, gameState: GameState;
let inputCenterX = 0;
const gameTime = new GameTime();

window.onload = initialize;

function initialize(): void {
    ctx = setupCanvasContext();

    document.addEventListener("touchmove", touchMove);
    document.addEventListener("touchend", touchEnd);
    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mousedown", mouseDown);

    createGameObjects();
    startNewGame();

    window.requestAnimationFrame(mainLoop);
}

function setupCanvasContext(): CanvasRenderingContext2D {
    const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
    canvas.width = Constants.FULL_WIDTH;
    canvas.height = Constants.FULL_HEIGHT;

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    return ctx;
}

function mainLoop(): void {
    gameTime.update();

    processGameLogic();
    render();

    window.requestAnimationFrame(mainLoop);
}

function processGameLogic(): void {
    if (gameState === GameState.Serving || gameState === GameState.Running) {
        moveBat();
        moveBall();
        updateBallColor();
    }

    if (gameState === GameState.Running) {
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

function render(): void {
    UI.clearBackground(ctx);
    UI.drawBorders(ctx);
    UI.drawGameStats(ctx, score, lives);

    // game objects are drawn in an area excluding borders
    ctx.save();
    ctx.translate(Constants.BORDER_WIDTH, Constants.BORDER_WIDTH);
    bricks.forEach(b => b?.draw(ctx));
    bat.draw(ctx);
    ball.draw(ctx);
    ctx.restore();

    switch (gameState) {
        case GameState.LevelUp:
            UI.drawLevelUp(ctx);
            break;

        case GameState.BallLost:
            UI.drawBallLost(ctx);
            break;

        case GameState.GameOver:
            UI.drawGameOver(ctx);
            break;
    }
}

function moveBat(): void {
    bat.x = clamp(inputCenterX - bat.width / 2, 0, Constants.STAGE_WIDTH - bat.width)
}

function moveBall(): void {
    if (gameState === GameState.Running) {
        ball.move(gameSpeed * gameTime.deltaTimeFactor);
        return;
    }

    positionBallOnTopOfBat(ball, bat);
}

function updateBallColor(): void {
    // Match color of bricks at current row
    const rowNumber = Stage.getCellFromStageXY(ball.x, ball.y).y;
    ball.color = Stage.getRowColor(rowNumber);
}

function positionBallOnTopOfBat(ball: Ball, bat: Bat): void {
    ball.x = bat.x + bat.width / 2;
    ball.y = bat.y - ball.radius;
}

function handleBallToWallCollision(): void {
    const stage = new Box(0, 0, Constants.STAGE_WIDTH, Constants.STAGE_HEIGHT);
    const pointOfImpact = Collisions.circleToInnerBox(ball, stage);

    switch (pointOfImpact) {
        case PointOfImpact.Left:
        case PointOfImpact.Right:
            bounceBallAgainstHorizontalWall(ball);
            break;

        case PointOfImpact.Top:
            bounceBallAgainstTopWall(ball);
            break;

        case PointOfImpact.Bottom:
            ballIsLost = true;
            break;
    }
}

function bounceBallAgainstHorizontalWall(ball: Ball): void {
    ball.invertX();
    ball.x = clamp(ball.x, ball.radius, Constants.STAGE_WIDTH - ball.radius);
}

function bounceBallAgainstTopWall(ball: Ball): void {
    ball.invertY();
    ball.y = ball.radius;
    topWallHasBeenHit = true;
}

function handleBallToBatCollision(): void {
    const pointOfImpact = Collisions.circleToBox(ball, ball.heading, bat);
    if (pointOfImpact !== PointOfImpact.Top)
        return;

    ball.invertY();
    ball.y = bat.y - ball.radius;

    // let point of impact affect bounce direction
    const impactRotation = ((ball.x - bat.x) / bat.width - 0.5) * 4;

    // clamp to some min/max angles to avoid very shallow angles
    const newHeading = clamp(ball.heading + impactRotation, -Math.PI * 0.80, -Math.PI * 0.20);
    ball.setHeading(newHeading);
}

function handleBallToBrickCollision(): void {
    const bricksToCheck = getBricksAtAndAroundBallPosition(ball, bricks);

    for (let brick of bricksToCheck.filter(b => b?.isActive)) {
        const pointOfImpact = Collisions.circleToBox(ball, ball.heading, brick);
        switch (pointOfImpact) {
            case PointOfImpact.Left:
            case PointOfImpact.Right:
                ball.invertX();
                break;

            case PointOfImpact.Top:
            case PointOfImpact.Bottom:
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

function getBricksAtAndAroundBallPosition(ball: Ball, bricks: readonly Brick[]): Brick[] {
    let targetBricks = [];
    let bc = Stage.getCellFromStageXY(ball.x, ball.y);

    let above = Stage.getBrickAtCell(bricks, bc.x, bc.y - 1);
    let below = Stage.getBrickAtCell(bricks, bc.x, bc.y + 1);
    let left = Stage.getBrickAtCell(bricks, bc.x - 1, bc.y);
    let right = Stage.getBrickAtCell(bricks, bc.x + 1, bc.y);
    let center = Stage.getBrickAtCell(bricks, bc.x, bc.y);

    if (above) targetBricks.push(above);
    if (below) targetBricks.push(below);
    if (left) targetBricks.push(left);
    if (right) targetBricks.push(right);
    if (center) targetBricks.push(center);

    return targetBricks;
}

function handleSpeedUp(): void {
    if (numberOfBrickHits === 4 && gameSpeed < Constants.SPEED_2) {
        gameSpeed = Constants.SPEED_2;
    }
    else if (numberOfBrickHits === 12 && gameSpeed < Constants.SPEED_3) {
        gameSpeed = Constants.SPEED_3;
    }
    else if (topRowsHasBeenHit && gameSpeed < Constants.SPEED_4) {
        gameSpeed = Constants.SPEED_4;
    }
}

function handleBatSize(): void {
    if (topWallHasBeenHit && !bat.isShrunken) {
        bat.shrink();
    }
}

function handleBallLost(): void {
    if (ballIsLost) {
        gameState = GameState.BallLost;
    }
}

function handleLevelUp(): void {
    if (level < 2 && getActiveBricks().length <= 0) {
        gameState = GameState.LevelUp;
    }
}

function handleGameOver(): void {
    const isGameOver =
        (lives <= 1 && gameState === GameState.BallLost) ||
        (level >= 2 && getActiveBricks().length <= 0);

    gameState = isGameOver ? GameState.GameOver : gameState;
}

function touchEnd(e: TouchEvent) {
    e.preventDefault();
    handleRestart();
}

function touchMove(e: TouchEvent) {
    let xPos = e.changedTouches[0]?.pageX ?? 0;
    inputCenterX = map(xPos, 0, window.innerWidth, 0, Constants.STAGE_WIDTH);
}

function mouseMove(e: MouseEvent) {
    e.preventDefault();
    inputCenterX = map(e.pageX, 0, window.innerWidth, 0, Constants.STAGE_WIDTH);
}

function mouseDown(e: MouseEvent) {
    e.preventDefault();
    handleRestart();
}

function handleRestart(): void {
    switch (gameState) {
        case GameState.Serving:
            gameState = GameState.Running;
            break;

        case GameState.LevelUp:
            levelUp();
            break;

        case GameState.BallLost:
            nextBall();
            break;

        case GameState.GameOver:
            startNewGame();
            return;
    }
}

function createGameObjects(): void {
    ball = new Ball(0, 0, Constants.BALL_RADIUS, Constants.INITIAL_BALL_DIRECTION);

    bat = new Bat(
        Constants.STAGE_WIDTH / 2 - Constants.BAT_WIDTH / 2,
        Constants.STAGE_HEIGHT - 2 * Constants.BAT_HEIGHT,
        Constants.BAT_WIDTH,
        Constants.BAT_HEIGHT,
        Colors.BAT);

    bricks = Stage.createBricks();
}

function startNewGame(): void {
    score = 0;
    lives = 5;
    level = 1;

    prepareNextBall();
}

function levelUp(): void {
    // keep speed, bat size etc. on level up
    ball.reset();
    resetBricks();

    level++;
    gameState = GameState.Serving;
}

function nextBall(): void {
    lives--;
    prepareNextBall();
}

function prepareNextBall(): void {
    bat.reset();
    ball.reset();

    numberOfBrickHits = 0;
    topRowsHasBeenHit = false;
    topWallHasBeenHit = false;
    ballIsLost = false;
    gameSpeed = Constants.SPEED_1;
    gameState = GameState.Serving;
}

function resetBricks(): void {
    bricks.forEach(b => b?.reset());
}

function getActiveBricks(): Brick[] {
    return bricks.filter(b => b?.isActive);
}

function clamp(value: number, min: number, max: number): number {
    if (value > max) return max;
    if (value < min) return min;
    return value;
}

function map(value: number, inputMin: number, inputMax: number, outputMin: number, outputMax: number): number {
    return (value - inputMin) / (inputMax - inputMin) * (outputMax - outputMin) + outputMin;
}