import { IBox } from "./iBox.js";

export class Bat implements IBox {
    private _initialWidth: number = 0;
    private _width: number;
    private _height: number;

    constructor(public x: number, public y: number, width: number, height: number, readonly color: string) {
        this._width = width;
        this._initialWidth = width;
        this._height = height;
    }

    get width(): number { return this._width; }
    get height(): number { return this._width; }
    get isShrunken(): boolean { return this._width < this._initialWidth; }

    shrink(): void {
        if (this.isShrunken) return;

        this._width *= 2 / 3;
    }

    reset(): void {
        this._width = this._initialWidth;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this._width, this._height);
    }
}