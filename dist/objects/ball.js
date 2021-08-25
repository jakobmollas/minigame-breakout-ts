import { Vector2d } from "../primitives/vector2d.js";
export class Ball {
    constructor(x, y, radius, direction) {
        this._radius = 0;
        this.color = "";
        this._pos = new Vector2d(x, y);
        this._radius = radius;
        this._currentDirection = direction;
        this._initialDirection = direction.clone();
    }
    get x() { return this._pos.x; }
    set x(value) { this._pos.x = value; }
    get y() { return this._pos.y; }
    set y(value) { this._pos.y = value; }
    get radius() { return this._radius; }
    get heading() { return this._currentDirection.heading; }
    move(distance) {
        this._pos.add(Vector2d.multiply(this._currentDirection, distance));
    }
    invertX() {
        this._currentDirection.invertX();
    }
    invertY() {
        this._currentDirection.invertY();
    }
    setHeading(heading) {
        this._currentDirection.setHeading(heading);
    }
    reset() {
        this._currentDirection = this._initialDirection.clone();
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this._pos.x, this._pos.y, this._radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}
//# sourceMappingURL=ball.js.map