export class Rectangle {
    constructor(
        public left: number,
        public top: number,
        public width: number,
        public height: number) {
    }

    get right(): number { return this.left + this.width; }
    get bottom(): number { return this.top + this.height; }

    clone(): Rectangle {
        return new Rectangle(this.left, this.top, this.width, this.height);
    }
}