import { Vector2d } from '../primitives/vector2d.js';

export enum PointOfImpact { NONE, LEFT, RIGHT, TOP, BOTTOM };
export enum GameState { LAUNCHING, RUNNING, LEVEL_UP, BALL_LOST, GAME_OVER };

export const borderWidth = 10;
export const gameAreaWidth = 540;
export const gameAreaHeight = 360;
export const fullWidth = gameAreaWidth + 2 * borderWidth;
export const fullHeight = gameAreaHeight + borderWidth;

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