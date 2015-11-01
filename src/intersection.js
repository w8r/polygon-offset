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
    var den = (B1[1] - B0[1]) * (A1[0] - A0[0]) -
        (B1[0] - B0[0]) * (A1[1] - A0[1]);

    // lines are parallel or conincident
    if (den == 0) {
        return null;
    }

    var ua = ((B1[0] - B0[0]) * (A0[1] - B0[1]) -
        (B1[1] - B0[1]) * (A0[0] - B0[0])) / den;

    var ub = ((A1[0] - A0[0]) * (A0[1] - B0[1]) -
        (A1[1] - A0[1]) * (A0[0] - B0[0])) / den;

    if (ua < 0 || ub < 0 || ua > 1 || ub > 1) {
        return null;
    }

    return [
        A0[0] + ua * (A1[0] - A0[0]),
        A0[1] + ua * (A1[1] - A0[1])
    ];
};
