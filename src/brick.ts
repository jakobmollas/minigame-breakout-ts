import { Rectangle } from "./rectangle.js";

export class Brick {
    private _color: string;
    private _score: number;
    private _isTopRow: boolean = false;
    private _active: boolean = true;
    private _rect: Rectangle;

    constructor(x: number, y: number, width: number, height: number, color: string, score: number, isTopRow: boolean, isActive: boolean) {
        this._rect = new Rectangle(x, y, width, height);
        this._color = color;
        this._score = score;
        this._isTopRow = isTopRow;
        this._active = isActive;
    }

    get score(): number { return this._score; }
    get isTopRow(): boolean { return this._isTopRow; }
    get active(): boolean { return this._active; }
    get rectangle(): Rectangle { return this._rect.clone(); }

    hit(): void {
        this._active = false;
    }

    reset(): void {
        this._active = true;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (!this._active) return;

        ctx.fillStyle = this._color;
        ctx.fillRect(this._rect.left, this._rect.top, this._rect.width - 1, this._rect.height - 1);
    }
}