const Box = require('./src/Box');
const Circle = require('./src/Circle');
const Point = require('./src/Point');
const QuadTree = require('./src/QuadTree');

(function (root, name, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory;
    } else {
        root[name] = factory;
    }
}(this, 'QT', {Box, Circle, Point, QuadTree}));
