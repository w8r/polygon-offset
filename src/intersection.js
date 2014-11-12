"use strict";

/**
 * Vector intersection, if present
 *
 * @param  {Object} A0
 * @param  {Object} A1
 * @param  {Object} B0
 * @param  {Object} B1
 *
 * @return {Object|null}
 */
module.exports = function intersection(A0, A1, B0, B1) {
    var den = (B1.y - B0.y) * (A1.x - A0.x) -
        (B1.x - B0.x) * (A1.y - A0.y);

    // lines are parallel or conincident
    if (den == 0) {
        return null;
    }

    var ua = ((B1.x - B0.x) * (A0.y - B0.y) -
        (B1.y - B0.y) * (A0.x - B0.x)) / den;

    var ub = ((A1.x - A0.x) * (A0.y - B0.y) -
        (A1.y - A0.y) * (A0.x - B0.x)) / den;

    if (ua < 0 || ub < 0 || ua > 1 || ub > 1) {
        return null;
    }

    return {
        x: A0.x + ua * (A1.x - A0.x),
        y: A0.y + ua * (A1.y - A0.y)
    };
};
