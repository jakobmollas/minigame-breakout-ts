export default class Vector2d {
    x: number = 0;
    y: number = 0;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    get heading(): number {
        return Math.atan2(this.y, this.x);
    }

    setHeading(radians: number) {
        const magnitude = this.mag;
        this.x = Math.cos(radians) * magnitude;
        this.y = Math.sin(radians) * magnitude;
        return this;
    }

    get mag(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    static fromAngle(angle: number, length: number = 1) {
        return new Vector2d(length * Math.cos(angle), length * Math.sin(angle));
    };

    clone(): Vector2d {
        return new Vector2d(this.x, this.y);
    }

    static isHeadingBetween(heading: number, angle1: number, angle2: number): boolean {
        return angle1 <= angle2
            ? angle2 - angle1 <= Math.PI
                ? angle1 <= heading && heading <= angle2
                : angle2 <= heading || heading <= angle1
            : angle1 - angle2 <= Math.PI
                ? angle2 <= heading && heading <= angle1
                : angle1 <= heading || heading <= angle2;
    }

    rotate(radians: number): Vector2d {
        const newHeading = this.heading + radians;
        return this.setHeading(newHeading);
    };

    add(other: Vector2d): Vector2d {
        this.x += other.x || 0;
        this.y += other.y || 0;

        return this;
    }

    subtract(other: Vector2d): Vector2d {
        this.x -= other.x || 0;
        this.y -= other.y || 0;

        return this;
    }

    multiply(length: number): Vector2d {
        this.x *= length;
        this.y *= length;

        return this;
    }

    static multiply(vector: Vector2d, length: number): Vector2d {
        return vector.clone().multiply(length);
    }

    invertX(): Vector2d {
        this.x = -this.x;
        return this;
    }

    invertY(): Vector2d {
        this.y = -this.y;
        return this;
    }

    invert(): Vector2d {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }
}