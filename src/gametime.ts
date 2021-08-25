export default class GameTime {
    private _deltaTime: number = 0;
    private _deltaTimeFactor: number = 0;
    private _fps: number = 0;
    private _lastTimestamp: number = 0;

    constructor() {
    }

    public update(): void {
        this._deltaTime = this._lastTimestamp ? performance.now() - this._lastTimestamp : 0;
        this._lastTimestamp = performance.now();
        this._deltaTimeFactor = this._deltaTime / 1000;
        this._fps = this._deltaTime > 0 ? 1000 / this._deltaTime : 0;
    }

    public get deltaTime(): number {
        return this._deltaTime;
    }

    public get deltaTimeFactor(): number {
        return this._deltaTimeFactor;
    }

    public get fps(): number {
        return this._fps;
    }
}