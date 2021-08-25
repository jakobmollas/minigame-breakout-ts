import Rectangle from "./rectangle.js";

export default class Bat {
    private _initialWidth: number = 0;
    private _rect: Rectangle;

    color;

    constructor(x: number, y: number, width: number, height: number, color: string) {
        this._rect = new Rectangle(x, y, width, height);
        this._initialWidth = width;
        this.color = color;
    }

    get x(): number { return this._rect.left; }
    set x(value: number) { this._rect.left = value; }
    get y(): number { return this._rect.top; }
    get width(): number { return this._rect.width; }
    get isShrunken(): boolean { return this._rect.width < this._initialWidth; }
    get rectangle(): Rectangle { return this._rect.clone(); }

    shrink(): void {
        if (this.isShrunken) return;

        this._rect.width *= 2 / 3;
    }

    reset(): void {
        this._rect.width = this._initialWidth;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color;
        ctx.fillRect(this._rect.left, this._rect.top, this._rect.width, this._rect.height);
    }
}