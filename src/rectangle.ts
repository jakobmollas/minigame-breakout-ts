export default class Rectangle {
    public left: number = 0;
    public top: number = 0;
    public width: number = 0;
    public height: number = 0;

    constructor(left: number, top: number, width: number, height: number) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }

    public get right(): number { return this.left + this.width; }
    public get bottom(): number { return this.top + this.height; }

    public clone(): Rectangle {
        return new Rectangle(this.left, this.top, this.width, this.height);
    }
}