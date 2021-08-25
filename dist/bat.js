import Rectangle from "./rectangle.js";
export default class Bat {
    constructor(x, y, width, height, color) {
        this._initialWidth = 0;
        this._rect = new Rectangle(x, y, width, height);
        this._initialWidth = width;
        this.color = color;
    }
    get x() { return this._rect.left; }
    set x(value) { this._rect.left = value; }
    get y() { return this._rect.top; }
    get width() { return this._rect.width; }
    get isShrunken() { return this._rect.width < this._initialWidth; }
    get rectangle() { return this._rect.clone(); }
    shrink() {
        if (this.isShrunken)
            return;
        this._rect.width *= 2 / 3;
    }
    reset() {
        this._rect.width = this._initialWidth;
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this._rect.left, this._rect.top, this._rect.width, this._rect.height);
    }
}
//# sourceMappingURL=bat.js.map