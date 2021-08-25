export class Brick {
    constructor(x, y, width, height, color, score, isTopRow, isActive) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.score = score;
        this.isTopRow = isTopRow;
        this._isActive = true;
        this._isActive = isActive;
    }
    get isActive() { return this._isActive; }
    hit() {
        this._isActive = false;
    }
    reset() {
        this._isActive = true;
    }
    draw(ctx) {
        if (!this._isActive)
            return;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width - 1, this.height - 1);
    }
}
//# sourceMappingURL=brick.js.map