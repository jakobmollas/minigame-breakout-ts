export class GameTime {
    constructor() {
        this._deltaTime = 0;
        this._deltaTimeFactor = 0;
        this._fps = 0;
        this._lastTimestamp = 0;
    }
    update() {
        this._deltaTime = this._lastTimestamp ? performance.now() - this._lastTimestamp : 0;
        this._lastTimestamp = performance.now();
        this._deltaTimeFactor = this._deltaTime / 1000;
        this._fps = this._deltaTime > 0 ? 1000 / this._deltaTime : 0;
    }
    get deltaTime() {
        return this._deltaTime;
    }
    get deltaTimeFactor() {
        return this._deltaTimeFactor;
    }
    get fps() {
        return this._fps;
    }
}
//# sourceMappingURL=gametime.js.map