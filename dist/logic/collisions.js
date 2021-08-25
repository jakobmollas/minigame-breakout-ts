import { Vector2d } from "../primitives/vector2d.js";
import { PointOfImpact } from "../definitions/constants.js";
function circleToInnerBox(circle, box) {
    if (circle.x < circle.radius)
        return PointOfImpact.Left;
    if (circle.x > box.width - circle.radius)
        return PointOfImpact.Right;
    if (circle.y < circle.radius)
        return PointOfImpact.Top;
    if (circle.y > box.height - circle.radius)
        return PointOfImpact.Bottom;
    return PointOfImpact.None;
}
function circleToBox(circle, circleHeading, box) {
    if (!circleIntersectsBox(circle, box))
        return PointOfImpact.None;
    const a = getCircleToBoxAngles(circle, box);
    // Compare (inverted) circle heading with angles calculated in previous step
    // to be able to determine at which side the circle hit the box
    const h = Vector2d.fromAngle(circleHeading).invert().heading;
    if (Vector2d.isHeadingBetween(h, a.a1, a.a2))
        return PointOfImpact.Top;
    if (Vector2d.isHeadingBetween(h, a.a2, a.a3))
        return PointOfImpact.Left;
    if (Vector2d.isHeadingBetween(h, a.a3, a.a4))
        return PointOfImpact.Bottom;
    return PointOfImpact.Right;
}
/**
* Divide box into 4 angular sectors based on circle position
* and all 4 box corners, taking circle radius into consideration.
* @returns 4 angles, counter-clockwise starting at upper right corner.
*/
function getCircleToBoxAngles(circle, box) {
    const bv = new Vector2d(circle.x, circle.y);
    const br = circle.radius;
    const a1 = new Vector2d(box.x + box.width + br, box.y - br).subtract(bv).heading;
    let a2 = new Vector2d(box.x - br, box.y - br).subtract(bv).heading;
    const a3 = new Vector2d(box.x - br, box.y + box.height + br).subtract(bv).heading;
    const a4 = new Vector2d(box.x + box.width + br, box.y + box.height + br).subtract(bv).heading;
    // edge case - if circle is exactly aligned with box top, 
    // angle a1-a2 will be positive 0-PI, negate sign in that case
    a2 = bv.y === (box.y - br) ? -a2 : a2;
    return { a1, a2, a3, a4 };
}
/**
 * Check if a circle intersects/overlaps a box in any way,
 * taking circle radius into consideration.
 * @returns true if circle intersects box
 */
function circleIntersectsBox(circle, box) {
    const halfWidth = box.width / 2;
    const halfHeight = box.height / 2;
    let distX = Math.abs(circle.x - (box.x + halfWidth));
    let distY = Math.abs(circle.y - (box.y + halfHeight));
    // Out of bounds completely?
    if (distX > (halfWidth + circle.radius) ||
        distY > (halfHeight + circle.radius)) {
        return false;
    }
    // Clean horizontal/vertical intersection?
    if (distX <= (halfWidth + circle.radius) ||
        distY <= (halfHeight + circle.radius)) {
        return true;
    }
    let cornerDistance_sq = Math.pow((distX - halfWidth), 2) +
        Math.pow((distY - halfHeight), 2);
    // Intersection at corner?
    return cornerDistance_sq <= circle.radius * circle.radius;
}
export { circleToInnerBox, circleToBox };
//# sourceMappingURL=collisions.js.map