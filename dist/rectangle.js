export default class Rectangle {
    constructor(left, top, width, height) {
        this.left = 0;
        this.top = 0;
        this.width = 0;
        this.height = 0;
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }
    get right() { return this.left + this.width; }
    get bottom() { return this.top + this.height; }
    clone() {
        return new Rectangle(this.left, this.top, this.width, this.height);
    }
}
//# sourceMappingURL=rectangle.js.map