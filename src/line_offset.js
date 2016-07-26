// https://github.com/tmcw/line-offset/
var displace = require('./point_displace');
var epsilon  = 1e-7;

function clone(_) {
    console.log('clone', _);
    return _.slice();
}

function explement_reflex_angle(angle) {
    if      (angle > Math.PI)  return angle - 2 * Math.PI;
    else if (angle < -Math.PI) return angle + 2 * Math.PI;
    else                       return angle;
}


function findVt(u1, u2, v1, v2) {
    var dx = v1[0] - u1[0],
        dy = v1[1] - u1[1],
        ux = u2[0] - u1[0],
        uy = u2[1] - u1[1],
        vx = v2[0] - v1[0],
        vy = v2[1] - v1[1],
        up, dn;

    up = ux * dy - dx * uy;
    dn = vx * uy - ux * vy;
    return up / dn;
}


function findUt(u1, u2, v1, v2, vt) {
    var dx = v1[0] - u1[0],
        dy = v1[1] - u1[1],
        ux = u2[0] - u1[0],
        uy = u2[1] - u1[1],
        vx = v2[0] - v1[0],
        vy = v2[1] - v1[1],
        up, dn;

    if (ux < -epsilon || ux > epsilon) {
        up = ux * dy - dx * uy;
        dn = vx * uy - ux * vy;
        return (vt * vx + dx) / ux;
    }

    if (uy < -epsilon || uy > epsilon) {
        up = uy * dx - dy * ux;
        dn = vy * ux - uy * vx;
        return (vt * vy + dy) / uy;
    }
}


function intersection(u1, u2, ut, v1, v2, vt) {
    var dx = v1[0] - u1[0],
        dy = v1[1] - u1[1],
        ux = u2[0] - u1[0],
        uy = u2[1] - u1[1],
        vx = v2[0] - v1[0],
        vy = v2[1] - v1[1],
        up, dn;
    // the first line is not vertical
    if (ux < -epsilon || ux > epsilon) {
        up = ux * dy - dx * uy;
        dn = vx * uy - ux * vy;
        return !(dn > -epsilon && dn < epsilon);
    }
    // the first line is not horizontal
    if (uy < -epsilon || uy > epsilon) {
        up = uy * dx - dy * ux;
        dn = vy * ux - uy * vx;
        return !(dn > -epsilon && dn < epsilon);
    }
    // the first line is too short
    return false;
}

module.exports.offset = function(vertices, offset) {
    if (offset === 0 || vertices.length < 3) return vertices;

    var output = [],
        v1 = vertices[0],
        v2 = vertices[1],
        half_turn_segments = 16,
        threshold = 8,
        angle_a = 0,
        angle_b = Math.atan2(v2[1] - v1[1], v2[0] - v1[0]),
        w = [0, 0],
        joint_angle;

    // first vertex
    v1 = displace.a(v1, angle_b, offset);
    output.push(clone(v1));

    // Sometimes when the first segment is too short, it causes ugly
    // curls at the beginning of the line. To avoid this, we make up
    // a fake vertex two offset-lengths before the first, and expect
    // intersection detection smoothes it out.
    var pre_first = displace.dx(v1, -2 * Math.abs(offset), 0, angle_b);

    for (var i = 0; i < vertices.length - 1; i++) {
        v1 = vertices[i];
        v2 = vertices[i + 1];

        angle_a = angle_b;
        angle_b = Math.atan2(v2[1] - v1[1], v2[0] - v1[0]);
        joint_angle = explement_reflex_angle(angle_b - angle_a);

        var half_turns = half_turn_segments * Math.abs(joint_angle),
            bulge_steps = 0;

        if (offset < 0) {
            if (joint_angle > 0) {
                joint_angle = joint_angle - 2 * Math.PI;
            } else {
                bulge_steps = 1 + Math.floor(half_turns / Math.PI);
            }
        } else {
            if (joint_angle < 0) {
                joint_angle = joint_angle + 2 * Math.PI;
            } else {
                bulge_steps = 1 + Math.floor(half_turns / Math.PI);
            }
        }

        w = displace.ua(v1, angle_a, offset);
        output.push(clone(w));

        for (var s = 0; ++s < bulge_steps; ) {
            w = displace.ua(v1,
                angle_a + (joint_angle * s) / bulge_steps,
                offset);
            output.push(clone(w));
        }

        v1 = displace.a(v1, angle_b, offset);
    }

    // last vertex
    output.push(displace.a(v1, angle_b, offset));

    console.log(output, offset, threshold);
    //return selectVertices(output, offset, threshold);
     return output;
};


function selectVertices(output, offset, threshold) {
    var vx = [];

    for (var pos = 0; pos + 1 < output.length; pos++) {

        var pre = output[pos];
        var cur = output[++pos];

        var check_dist = offset * threshold,
            check_dist2 = check_dist * check_dist,
            t = 1, vt, ut;

        for (var i = pos; i + 1 < output.length; ++i) {
            var u0 = output[i],
                u1 = output[i + 1],
                dx = u0[0] - cur[0],
                dy = u0[1] - cur[1];

            if (dx * dx + dy * dy > check_dist2) break;
            if (!intersection(pre, cur, vt, u0, u1, ut)) {
                continue;
            } else {
                vt = findVt(pre, cur, u0, u1);
                ut = findUt(pre, cur, u0, u1, vt);
            }
            if (vt < 0 || vt > t || ut < 0 || ut > 1) continue;
            t = vt;
            pos = i + 1;
        }

        output[pos] = [
            pre[0] + t * (cur[0] - pre[0]),
            pre[1] + t * (cur[1] - pre[1])
        ];

        vx.push(clone(output[pos]));
    }

    return vx;
}