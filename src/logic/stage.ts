import { Brick } from "../objects/brick.js";
import { Point2d } from "../primitives/point2d.js";
import * as Constants from "../definitions/constants.js";
import * as Colors from "../definitions/colors.js";

function createBricks(): Brick[] {
    const bricks: Brick[] = [];
    for (let row = 0; row < Constants.ROWS; row++) {
        for (let col = 0; col < Constants.COLUMNS; col++) {
            const x = col * Constants.BRICK_WIDTH;
            const y = row * Constants.BRICK_HEIGHT;
            const color = getRowColor(row);
            const score = getRowScore(row);
            const isTopRow = row >= 4 && row <= 5;
            const isActive = row > 3;

            bricks.push(
                new Brick(
                    x, y,
                    Constants.BRICK_WIDTH, Constants.BRICK_HEIGHT,
                    color, score, isTopRow, isActive));
        }
    }

    return bricks;
}

function getRowColor(rowNumber: number): string {
    switch (rowNumber) {
        case 4: return Colors.BRICK_1;
        case 5: return Colors.BRICK_2;
        case 6: return Colors.BRICK_3;
        case 7: return Colors.BRICK_4;
        case 8: return Colors.BRICK_5;
        case 9: return Colors.BRICK_6;

        default: return Colors.BRICK_1;
    }
}

function getRowScore(rowNumber: number): number {
    switch (rowNumber) {
        case 4: return 7;
        case 5: return 7;
        case 6: return 4;
        case 7: return 4;
        case 8: return 1;
        case 9: return 1;
        default: return 0;
    }
}

function getCellFromStageXY(x: number, y: number): Point2d {
    let col = Math.floor(x / Constants.BRICK_WIDTH);
    let row = Math.floor(y / Constants.BRICK_HEIGHT);

    return new Point2d(col, row);
}

function getBrickAtCell(bricks: readonly Brick[], col: number, row: number): Brick | null {
    const index = row * Constants.COLUMNS + col;
    return index >= bricks.length ? null : bricks[index];
}

export { createBricks, getRowColor, getCellFromStageXY, getBrickAtCell }