import { Directions, TileTypes, UP, DOWN, LEFT, RIGHT } from '../utils/constants';


class TileModel {

    connections = 0;
    angle = 0;
    row = 0;
    col = 0;
    type = null;
    isLocked = false;

    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.type = TileTypes.WIRE;
        this.connections = 0;
        this.angle = 0;
        this.isLocked = false;
    }

    reset() {
        this.type = TileTypes.WIRE;
        this.connections = 0;
        this.angle = 0;
        this.isLocked = false;
    }

    get isConnected() {
        return this.type === TileTypes.SERVER || this._isConnected;
    }

    set isConnected(value) {
        this._isConnected = value;
    }

    /** return the number of connections for all of the 4 directions */
    getNumberConnections() {
        let connections = [];
        for (let dir of Directions) {
            if (dir & this.connections)
                connections.push(dir);
        }
        return connections.length;
    }

    neighborAt(direction, tiles) {
        let row = this.row;
        let col = this.col;
        if (direction === UP)
            row--;
        else if (direction === DOWN)
            row++;
        else if (direction === LEFT)
            col--;
        else if (direction === RIGHT)
            col++;
        else
            throw new Error(`invalid direction: ${direction}`);

        return tiles.find(tile => {
            return tile.row === row && tile.col === col;
        });
    }

    static getOpposite(direction) {
        let opposite = direction * 4;
        if (direction === 9)
            opposite = 6;
        else if (opposite > 8)
            opposite = opposite / 16;
        return opposite;
    }

    hasFreeNeighbors(tiles) {
        let tile = null;
        for (let direction of Directions) {
            tile = this.neighborAt(direction, tiles);
            if (tile && tile.connections === 0) {
                return true;
            }
        }
        return false;
    }

    updateType() {
        if (this.type !== TileTypes.SERVER && Directions.includes(this.connections)) {
            this.type = TileTypes.TERMINAL;
        }
        this.angle = this.calculateInitialAngle();
    }

    rotateCW() {
        if (this.isLocked)
            return;

        let newConnections = this.connections << 1;
        if (newConnections > 15)
            newConnections -= 15;
        this.connections = newConnections;
        this.angle += 90;
    }

    rotateCCW() {
        if (this.isLocked)
            return;

        let newConnections = this.connections >> 1;
        if (this.connections & UP)
            newConnections += LEFT;
        this.connections = newConnections;
        this.angle -= 90;
    }

    toProps() {
        return {
            col: this.col,
            row: this.row,
            type: this.type,
            connections: this.connections,
            isConnected: this.isConnected,
            isLocked: this.isLocked,
            angle: this.angle
        };
    }

    calculateInitialAngle() {
        let angle = 0;
        if ([1, 3, 5, 7].includes(this.connections)) {
            angle = 0;
        } else if ([2, 6, 10, 14].includes(this.connections)) {
            angle = 90;
        } else if ([4, 12, 13].includes(this.connections)) {
            angle = 180;
        } else if ([8, 11, 9].includes(this.connections)) {
            angle = -90;
        }
        return angle;
    }

    getKey() {
        return `${this.row}-${this.col}`;
    }
}

export default TileModel;