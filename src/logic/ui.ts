import * as Colors from "../definitions/colors.js";
import * as Constants from "../definitions/constants.js";

function clearBackground(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = Colors.background;
    ctx.fillRect(0, 0, Constants.fullWidth, Constants.fullHeight);
}

function drawBorders(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = Colors.border;
    ctx.fillRect(0, 0, Constants.borderWidth, Constants.fullHeight);
    ctx.fillRect(0, 0, Constants.fullWidth, Constants.borderWidth);
    ctx.fillRect(Constants.fullWidth - Constants.borderWidth, 0, Constants.borderWidth, Constants.fullHeight);
}

function drawGameStats(ctx: CanvasRenderingContext2D, score: number, lives: number): void {
    setFont(ctx, 1);

    const x = ctx.canvas.width / 2;
    const y = 30;

    ctx.fillStyle = Colors.stats;
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
    g.addColorStop(0, Colors.messageGradient1);
    g.addColorStop(0.45, Colors.messageGradient2);
    g.addColorStop(0.45, Colors.messageGradient3);
    g.addColorStop(1.0, Colors.messageGradient4);

    return g;
}

function setFont(ctx: CanvasRenderingContext2D, sizeInRem: number): void {
    ctx.font = `${sizeInRem}rem 'Press Start 2P'`;
    ctx.textAlign = "center";
    ctx.textBaseline = 'middle';
}

export { clearBackground, drawBorders, drawGameStats, drawLevelUp, drawBallLost, drawGameOver };