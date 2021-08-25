import { Vector2d } from '../primitives/vector2d.js';
export var PointOfImpact;
(function (PointOfImpact) {
    PointOfImpact[PointOfImpact["NONE"] = 0] = "NONE";
    PointOfImpact[PointOfImpact["LEFT"] = 1] = "LEFT";
    PointOfImpact[PointOfImpact["RIGHT"] = 2] = "RIGHT";
    PointOfImpact[PointOfImpact["TOP"] = 3] = "TOP";
    PointOfImpact[PointOfImpact["BOTTOM"] = 4] = "BOTTOM";
})(PointOfImpact || (PointOfImpact = {}));
;
export var GameState;
(function (GameState) {
    GameState[GameState["LAUNCHING"] = 0] = "LAUNCHING";
    GameState[GameState["RUNNING"] = 1] = "RUNNING";
    GameState[GameState["LEVEL_UP"] = 2] = "LEVEL_UP";
    GameState[GameState["BALL_LOST"] = 3] = "BALL_LOST";
    GameState[GameState["GAME_OVER"] = 4] = "GAME_OVER";
})(GameState || (GameState = {}));
;
export const borderWidth = 10;
export const stageWidth = 540;
export const stageHeight = 360;
export const fullWidth = stageWidth + 2 * borderWidth;
export const fullHeight = stageHeight + borderWidth;
export const columns = 18;
export const rows = 10;
export const brickWidth = 30;
export const brickHeight = 15;
export const speed1 = 150; // pixels per second
export const speed2 = 210;
export const speed3 = 270;
export const speed4 = 360;
export const ballRadius = 5;
export const initialBallDirection = new Vector2d(0.7, -1);
export const batHeight = 0.5 * brickHeight;
export const batWidth = 3 * brickWidth;
//# sourceMappingURL=constants.js.map