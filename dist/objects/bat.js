export class Bat {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this._initialWidth = 0;
        this._width = width;
        this._initialWidth = width;
        this._height = height;
    }
    get width() { return this._width; }
    get height() { return this._width; }
    get isShrunken() { return this._width < this._initialWidth; }
    shrink() {
        if (this.isShrunken)
            return;
        this._width *= 2 / 3;
    }
    reset() {
        this._width = this._initialWidth;
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this._width, this._height);
    }
}
//# sourceMappingURL=bat.js.map