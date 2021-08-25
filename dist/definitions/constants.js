import { Vector2d } from '../primitives/vector2d.js';
export var PointOfImpact;
(function (PointOfImpact) {
    PointOfImpact[PointOfImpact["None"] = 0] = "None";
    PointOfImpact[PointOfImpact["Left"] = 1] = "Left";
    PointOfImpact[PointOfImpact["Right"] = 2] = "Right";
    PointOfImpact[PointOfImpact["Top"] = 3] = "Top";
    PointOfImpact[PointOfImpact["Bottom"] = 4] = "Bottom";
})(PointOfImpact || (PointOfImpact = {}));
;
export var GameState;
(function (GameState) {
    GameState[GameState["Serving"] = 0] = "Serving";
    GameState[GameState["Running"] = 1] = "Running";
    GameState[GameState["LevelUp"] = 2] = "LevelUp";
    GameState[GameState["BallLost"] = 3] = "BallLost";
    GameState[GameState["GameOver"] = 4] = "GameOver";
})(GameState || (GameState = {}));
;
export const BORDER_WIDTH = 10;
export const STAGE_WIDTH = 540;
export const STAGE_HEIGHT = 360;
export const FULL_WIDTH = STAGE_WIDTH + 2 * BORDER_WIDTH;
export const FULL_HEIGHT = STAGE_HEIGHT + BORDER_WIDTH;
export const COLUMNS = 18;
export const ROWS = 10;
export const BRICK_WIDTH = 30;
export const BRICK_HEIGHT = 15;
export const SPEED_1 = 150; // pixels per second
export const SPEED_2 = 210;
export const SPEED_3 = 270;
export const SPEED_4 = 360;
export const BALL_RADIUS = 5;
export const INITIAL_BALL_DIRECTION = new Vector2d(0.7, -1);
export const BAT_HEIGHT = 0.5 * BRICK_HEIGHT;
export const BAT_WIDTH = 3 * BRICK_WIDTH;
//# sourceMappingURL=constants.js.map