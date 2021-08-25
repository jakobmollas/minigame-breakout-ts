import { IBox } from "../primitives/ibox.js";

export class Brick implements IBox {
    private _isActive: boolean = true;

    constructor(
        readonly x: number,
        readonly y: number,
        readonly width: number,
        readonly height: number,
        private color: string,
        readonly score: number,
        readonly isTopRow: boolean,
        isActive: boolean) {

        this._isActive = isActive;
    }

    get isActive(): boolean { return this._isActive; }

    hit(): void {
        this._isActive = false;
    }

    reset(): void {
        this._isActive = true;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (!this._isActive) return;

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width - 1, this.height - 1);
    }
}