import * as Colors from "../definitions/colors.js";
import * as Constants from "../definitions/constants.js";

function clearBackground(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = Colors.BACKGROUND;
    ctx.fillRect(0, 0, Constants.FULL_WIDTH, Constants.FULL_HEIGHT);
}

function drawBorders(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = Colors.BORDER;
    ctx.fillRect(0, 0, Constants.BORDER_WIDTH, Constants.FULL_HEIGHT);
    ctx.fillRect(0, 0, Constants.FULL_WIDTH, Constants.BORDER_WIDTH);
    ctx.fillRect(Constants.FULL_WIDTH - Constants.BORDER_WIDTH, 0, Constants.BORDER_WIDTH, Constants.FULL_HEIGHT);
}

function drawGameStats(ctx: CanvasRenderingContext2D, score: number, lives: number): void {
    setFont(ctx, 1);

    const x = ctx.canvas.width / 2;
    const y = 30;

    ctx.fillStyle = Colors.STATS;
    ctx.fillText("SCORE: " + score + "   LIVES: " + lives, x, y);
}

function drawLevelUp(ctx: CanvasRenderingContext2D): void {
    drawGameMessage(ctx, "LEVEL UP");
}

function drawBallLost(ctx: CanvasRenderingContext2D): void {
    drawGameMessage(ctx, "BALL LOST");
}

function drawGameOver(ctx: CanvasRenderingContext2D): void {
    drawGameMessage(ctx, "GAME OVER");
}

function drawGameMessage(ctx: CanvasRenderingContext2D, text: string): void {
    setFont(ctx, 3);

    const x = ctx.canvas.width / 2;
    const y = ctx.canvas.height / 1.5;
    ctx.fillStyle = createGradient(ctx, y);
    ctx.fillText(text, x, y);
}

function createGradient(ctx: CanvasRenderingContext2D, yCenter: number): CanvasGradient {
    const g = ctx.createLinearGradient(0, yCenter - 20, 0, yCenter + 20);
    g.addColorStop(0, Colors.MESSAGE_GRADIENT_1);
    g.addColorStop(0.45, Colors.MESSAGE_GRADIENT_2);
    g.addColorStop(0.45, Colors.MESSAGE_GRADIENT_3);
    g.addColorStop(1.0, Colors.MESSAGE_GRADIENT_4);

    return g;
}

function setFont(ctx: CanvasRenderingContext2D, sizeInRem: number): void {
    ctx.font = `${sizeInRem}rem 'Press Start 2P'`;
    ctx.textAlign = "center";
    ctx.textBaseline = 'middle';
}

export { clearBackground, drawBorders, drawGameStats, drawLevelUp, drawBallLost, drawGameOver };