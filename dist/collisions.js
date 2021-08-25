import { Vector2d } from "./vector2d.js";
var PointOfImpact;
(function (PointOfImpact) {
    PointOfImpact[PointOfImpact["NONE"] = 0] = "NONE";
    PointOfImpact[PointOfImpact["LEFT"] = 1] = "LEFT";
    PointOfImpact[PointOfImpact["RIGHT"] = 2] = "RIGHT";
    PointOfImpact[PointOfImpact["TOP"] = 3] = "TOP";
    PointOfImpact[PointOfImpact["BOTTOM"] = 4] = "BOTTOM";
})(PointOfImpact || (PointOfImpact = {}));
;
/* returns PointOfImpact */
function ballToInnerRectangle(ball, rectangle) {
    if (ball.x < ball.radius)
        return PointOfImpact.LEFT;
    if (ball.x > rectangle.width - ball.radius)
        return PointOfImpact.RIGHT;
    if (ball.y < ball.radius)
        return PointOfImpact.TOP;
    if (ball.y > rectangle.height - ball.radius)
        return PointOfImpact.BOTTOM;
    return PointOfImpact.NONE;
}
/* returns PointOfImpact */
function ballToRectangle(ball, rectangle) {
    if (!ballIntersectsRectangle(ball, rectangle))
        return PointOfImpact.NONE;
    const a = getBallToRectangleAngles(ball, rectangle);
    // Compare (inverted) ball heading with angles calculated in previous step
    // to be able to determine at which side the ball hit the rectangle
    const h = Vector2d.fromAngle(ball.heading).invert().heading;
    if (Vector2d.isHeadingBetween(h, a.a1, a.a2))
        return PointOfImpact.TOP;
    if (Vector2d.isHeadingBetween(h, a.a2, a.a3))
        return PointOfImpact.LEFT;
    if (Vector2d.isHeadingBetween(h, a.a3, a.a4))
        return PointOfImpact.BOTTOM;
    return PointOfImpact.RIGHT;
}
/**
* Divide rectangle into 4 angular sectors based on ball position
* and all 4 rectangle corners, taking ball radius into consideration.
* @returns 4 angles, counter-clockwise starting at upper right corner.
*/
function getBallToRectangleAngles(ball, rectangle) {
    const b = new Vector2d(ball.x, ball.y);
    const br = ball.radius;
    const r = rectangle;
    const a1 = new Vector2d(r.right + br, r.top - br).subtract(b).heading;
    let a2 = new Vector2d(r.left - br, r.top - br).subtract(b).heading;
    const a3 = new Vector2d(r.left - br, r.bottom + br).subtract(b).heading;
    const a4 = new Vector2d(r.right + br, r.bottom + br).subtract(b).heading;
    // edge case - if ball is exactly aligned with rectangle top, 
    // angle a1-a2 will be positive 0-PI, negate sign in that case
    a2 = b.y === (r.top - br) ? -a2 : a2;
    return { a1, a2, a3, a4 };
}
/**
 * Check if a ball/circle intersects/overlaps a rectangle in any way,
 * taking ball radius into consideration.
 * @returns true if ball intersects rectangle
 */
function ballIntersectsRectangle(ball, rectangle) {
    const halfWidth = rectangle.width / 2;
    const halfHeight = rectangle.height / 2;
    let distX = Math.abs(ball.x - (rectangle.left + halfWidth));
    let distY = Math.abs(ball.y - (rectangle.top + halfHeight));
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
    let cornerDistance_sq = Math.pow((distX - halfWidth), 2) +
        Math.pow((distY - halfHeight), 2);
    // Intersection at corner?
    return cornerDistance_sq <= ball.radius * ball.radius;
}
export { ballToInnerRectangle, ballToRectangle, PointOfImpact };
//# sourceMappingURL=collisions.js.map