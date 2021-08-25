import { Vector2d } from "./vector2d.js";

export class Ball {
    private _pos: Vector2d;
    private _radius: number = 0;
    private _currentDirection: Vector2d;
    private _initialDirection: Vector2d;

    color = "";

    constructor(x: number, y: number, radius: number, direction: Vector2d) {
        this._pos = new Vector2d(x, y);
        this._radius = radius;
        this._currentDirection = direction;
        this._initialDirection = direction.clone();
    }

    get x(): number { return this._pos.x; }
    set x(value: number) { this._pos.x = value; }
    get y(): number { return this._pos.y; }
    set y(value: number) { this._pos.y = value; }
    get radius(): number { return this._radius; }
    get heading(): number { return this._currentDirection.heading; }

    move(distance: number): void {
        this._pos.add(Vector2d.multiply(this._currentDirection, distance));
    }

    invertX(): void {
        this._currentDirection.invertX();
    }

    invertY(): void {
        this._currentDirection.invertY();
    }

    setHeading(heading: number): void {
        this._currentDirection.setHeading(heading);
    }

    reset(): void {
        this._currentDirection = this._initialDirection.clone();
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this._pos.x, this._pos.y, this._radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}