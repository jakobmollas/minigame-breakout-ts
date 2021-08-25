import Rectangle from "./rectangle.js";

export default class Bat {
    private _initialWidth: number = 0;
    private _rect: Rectangle;

    public color;

    constructor(x: number, y: number, width: number, height: number, color: string) {
        this._rect = new Rectangle(x, y, width, height);
        this._initialWidth = width;
        this.color = color;
    }

    public get x(): number { return this._rect.left; }
    public set x(value: number) { this._rect.left = value; }
    public get y(): number { return this._rect.top; }
    public get width(): number { return this._rect.width; }
    public get isShrunken(): boolean { return this._rect.width < this._initialWidth; }
    public get rectangle(): Rectangle { return this._rect.clone(); }

    public shrink(): void {
        if (this.isShrunken) return;

        this._rect.width *= 2 / 3;
    }

    public reset(): void {
        this._rect.width = this._initialWidth;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color;
        ctx.fillRect(this._rect.left, this._rect.top, this._rect.width, this._rect.height);
    }
}