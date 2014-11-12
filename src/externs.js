/**
 * Externs file for google closure compiler
 */

// this makes GCC play with browserify

/**
 * @param {*=}o
 * @param {*=}u
 */
window.require = function(o, u) {};

/**
 * @type {Object}
 */
window.module = {
    exports: {}
};

// this is for our lib

/**
 * @param {Array.<Object>} v
 * @param {number=}        s
 */
function Offset(v, s) {};

// this is for clipper

/**
 * @type {Object}
 */
window.greinerHormann = {

    /**
     * @api
     * @param  {Array.<Array.<Number>} polygonA
     * @param  {Array.<Array.<Number>} polygonB
     * @return {Array.<Array.<Number>>|Null}
     */
    clip: function(polygonA, polygonB) {},

    /**
     * @api
     * @param  {Array.<Array.<Number>} polygonA
     * @param  {Array.<Array.<Number>} polygonB
     * @return {Array.<Array.<Number>>|Null}
     */
    diff: function(polygonA, polygonBpolygonA, polygonB) {},

    /**
     * @api
     * @param  {Array.<Array.<Number>} polygonA
     * @param  {Array.<Array.<Number>} polygonB
     * @return {Array.<Array.<Number>>|Null}
     */
    union: function(polygonA, polygonB) {},

    /**
     * @api
     * @param  {Array.<Array.<Number>} polygonA
     * @param  {Array.<Array.<Number>} polygonB
     * @return {Array.<Array.<Number>>|Null}
     */
    intersection: function(polygonA, polygonB) {}

};
