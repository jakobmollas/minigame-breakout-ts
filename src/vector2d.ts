export default class Vector2d {
    public x: number = 0;
    public y: number = 0;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public get heading(): number {
        return Math.atan2(this.y, this.x);
    }

    public setHeading(radians: number) {
        const magnitude = this.mag;
        this.x = Math.cos(radians) * magnitude;
        this.y = Math.sin(radians) * magnitude;
        return this;
    }

    public get mag(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public static fromAngle(angle: number, length: number = 1) {
        return new Vector2d(length * Math.cos(angle), length * Math.sin(angle));
    };

    public clone(): Vector2d {
        return new Vector2d(this.x, this.y);
    }

    public static isHeadingBetween(heading: number, angle1: number, angle2: number): boolean {
        return angle1 <= angle2
            ? angle2 - angle1 <= Math.PI
                ? angle1 <= heading && heading <= angle2
                : angle2 <= heading || heading <= angle1
            : angle1 - angle2 <= Math.PI
                ? angle2 <= heading && heading <= angle1
                : angle1 <= heading || heading <= angle2;
    }

    public rotate(radians: number): Vector2d {
        const newHeading = this.heading + radians;
        return this.setHeading(newHeading);
    };

    public add(other: Vector2d): Vector2d {
        this.x += other.x || 0;
        this.y += other.y || 0;

        return this;
    }

    public subtract(other: Vector2d): Vector2d {
        this.x -= other.x || 0;
        this.y -= other.y || 0;

        return this;
    }

    public multiply(length: number): Vector2d {
        this.x *= length;
        this.y *= length;

        return this;
    }

    public static multiply(vector: Vector2d, length: number): Vector2d {
        return vector.clone().multiply(length);
    }

    public invertX(): Vector2d {
        this.x = -this.x;
        return this;
    }

    public invertY(): Vector2d {
        this.y = -this.y;
        return this;
    }

    public invert(): Vector2d {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }
}