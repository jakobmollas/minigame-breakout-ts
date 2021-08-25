import { Ball } from "./ball.js";
import { IBox } from "./iBox.js";
import { Vector2d } from "./vector2d.js"

enum PointOfImpact { NONE, LEFT, RIGHT, TOP, BOTTOM };

/* returns PointOfImpact */
function ballToInnerBox(ball: Ball, box: IBox): PointOfImpact {
    if (ball.x < ball.radius) return PointOfImpact.LEFT;
    if (ball.x > box.width - ball.radius) return PointOfImpact.RIGHT;
    if (ball.y < ball.radius) return PointOfImpact.TOP;
    if (ball.y > box.height - ball.radius) return PointOfImpact.BOTTOM;

    return PointOfImpact.NONE;
}

/* returns PointOfImpact */
function ballToBox(ball: Ball, box: IBox): PointOfImpact {
    if (!ballIntersectsBox(ball, box))
        return PointOfImpact.NONE;

    const a = getBallToBoxAngles(ball, box);

    // Compare (inverted) ball heading with angles calculated in previous step
    // to be able to determine at which side the ball hit the box
    const h = Vector2d.fromAngle(ball.heading).invert().heading;

    if (Vector2d.isHeadingBetween(h, a.a1, a.a2)) return PointOfImpact.TOP;
    if (Vector2d.isHeadingBetween(h, a.a2, a.a3)) return PointOfImpact.LEFT;
    if (Vector2d.isHeadingBetween(h, a.a3, a.a4)) return PointOfImpact.BOTTOM;
    return PointOfImpact.RIGHT;
}

/**
* Divide box into 4 angular sectors based on ball position 
* and all 4 box corners, taking ball radius into consideration.
* @returns 4 angles, counter-clockwise starting at upper right corner.
*/
function getBallToBoxAngles(ball: Ball, box: IBox)
    : { a1: number, a2: number, a3: number, a4: number } {
    const bv = new Vector2d(ball.x, ball.y);
    const br = ball.radius;

    const a1 = new Vector2d(box.x + box.width + br, box.y - br).subtract(bv).heading;
    let a2 = new Vector2d(box.x - br, box.y - br).subtract(bv).heading;
    const a3 = new Vector2d(box.x - br, box.y + box.height + br).subtract(bv).heading;
    const a4 = new Vector2d(box.x + box.width + br, box.y + box.height + br).subtract(bv).heading;

    // edge case - if ball is exactly aligned with box top, 
    // angle a1-a2 will be positive 0-PI, negate sign in that case
    a2 = bv.y === (box.y - br) ? -a2 : a2;

    return { a1, a2, a3, a4 };
}

/**
 * Check if a ball/circle intersects/overlaps a box in any way, 
 * taking ball radius into consideration.
 * @returns true if ball intersects box
 */
function ballIntersectsBox(ball: Ball, box: IBox): boolean {
    const halfWidth = box.width / 2;
    const halfHeight = box.height / 2;

    let distX = Math.abs(ball.x - (box.x + halfWidth));
    let distY = Math.abs(ball.y - (box.y + halfHeight));

    // Out of bounds completely?
    if (distX > (halfWidth + ball.radius) ||
        distY > (halfHeight + ball.radius)) {
        return false;
    }

    // Clean horizontal/vertical intersection?
    if (distX <= (halfWidth + ball.radius) ||
        distY <= (halfHeight + ball.radius)) {
        return true;
    }

    let cornerDistance_sq =
        Math.pow((distX - halfWidth), 2) +
        Math.pow((distY - halfHeight), 2);

    // Intersection at corner?
    return cornerDistance_sq <= ball.radius * ball.radius;
}

export { ballToInnerBox as ballToInnerBox, ballToBox as ballToBox, PointOfImpact };