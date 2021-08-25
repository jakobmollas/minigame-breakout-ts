export class Rectangle {
    left: number = 0;
    top: number = 0;
    width: number = 0;
    height: number = 0;

    constructor(left: number, top: number, width: number, height: number) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }

    get right(): number { return this.left + this.width; }
    get bottom(): number { return this.top + this.height; }

    clone(): Rectangle {
        return new Rectangle(this.left, this.top, this.width, this.height);
    }
}