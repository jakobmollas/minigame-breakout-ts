import { IBox } from "./ibox.js";

export class Box implements IBox {
    constructor(
        public x: number,
        public y: number,
        public width: number,
        public height: number) {
    }
}