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
function ballToInnerBox(ball, box) {
    if (ball.x < ball.radius)
        return PointOfImpact.LEFT;
    if (ball.x > box.width - ball.radius)
        return PointOfImpact.RIGHT;
    if (ball.y < ball.radius)
        return PointOfImpact.TOP;
    if (ball.y > box.height - ball.radius)
        return PointOfImpact.BOTTOM;
    return PointOfImpact.NONE;
}
/* returns PointOfImpact */
function ballToBox(ball, box) {
    if (!ballIntersectsBox(ball, box))
        return PointOfImpact.NONE;
    const a = getBallToBoxAngles(ball, box);
    // Compare (inverted) ball heading with angles calculated in previous step
    // to be able to determine at which side the ball hit the box
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
* Divide box into 4 angular sectors based on ball position
* and all 4 box corners, taking ball radius into consideration.
* @returns 4 angles, counter-clockwise starting at upper right corner.
*/
function getBallToBoxAngles(ball, box) {
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
function ballIntersectsBox(ball, box) {
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
    let cornerDistance_sq = Math.pow((distX - halfWidth), 2) +
        Math.pow((distY - halfHeight), 2);
    // Intersection at corner?
    return cornerDistance_sq <= ball.radius * ball.radius;
}
export { ballToInnerBox as ballToInnerBox, ballToBox as ballToBox, PointOfImpact };
//# sourceMappingURL=collisions.js.map