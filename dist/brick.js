import Rectangle from "./rectangle.js";
export default class Brick {
    constructor(x, y, width, height, color, score, isTopRow, isActive) {
        this._isTopRow = false;
        this._active = true;
        this._rect = new Rectangle(x, y, width, height);
        this._color = color;
        this._score = score;
        this._isTopRow = isTopRow;
        this._active = isActive;
    }
    get score() { return this._score; }
    get isTopRow() { return this._isTopRow; }
    get active() { return this._active; }
    get rectangle() { return this._rect.clone(); }
    hit() {
        this._active = false;
    }
    reset() {
        this._active = true;
    }
    draw(ctx) {
        if (!this._active)
            return;
        ctx.fillStyle = this._color;
        ctx.fillRect(this._rect.left, this._rect.top, this._rect.width - 1, this._rect.height - 1);
    }
}
//# sourceMappingURL=brick.js.map