const TileTypes = Object.freeze({
    WIRE: 0,
    SERVER: 1,
    TERMINAL: 2
});

const UP = 1;
const RIGHT = 2;
const DOWN = 4;
const LEFT = 8;

const Directions = [UP, RIGHT, DOWN, LEFT];

module.exports = { TileTypes, Directions, UP, RIGHT, DOWN, LEFT };