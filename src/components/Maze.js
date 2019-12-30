import React from 'react';
import Tile from './Tile';
import { Directions, TileTypes, UP, DOWN, LEFT, RIGHT } from './constants';
import { shuffleArray } from './utils';
import './Maze.scss';


class TileObject {

    connections = 0;
    row = 0;
    col = 0;
    type = null;

    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.type = TileTypes.WIRE;
        this.connections = 0;
    }

    reset() {
        this.type = TileTypes.WIRE;
        this.connections = 0;
    }

    isConnected() {
        return this.type === TileTypes.SERVER || this.connections === 0;
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
        // this._correctConnections = this.connections;
    }
}


class Maze extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rows: 10,
            cols: 10,
            tiles: [],
            rootTile: null
        };

        this.generateTiles = this.generateTiles.bind(this);
        this.generateNetwork = this.generateNetwork.bind(this);

        this.generateTiles();
        this.generateNetwork();
    }

    componentDidMount() {

    }

    /** generates empty grid */
    generateTiles() {
        const { rows, cols } = this.state;
        const tiles = [];
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                tiles.push(new TileObject(row, col));
            }
        }
        this.state.tiles = tiles;
    }

    /** generate network */
    generateNetwork() {
        // reset current tiles
        let tiles = this.state.tiles;
        tiles.forEach(tile => tile.reset());

        // get random tile and make it the server
        let rootTile = tiles[Math.floor(Math.random() * tiles.length)];
        rootTile.type = TileTypes.SERVER;

        let activeTiles = [];
        activeTiles.push(rootTile);
        while (activeTiles.length > 0) {
            // pick a random tile
            let selectedTile = activeTiles[Math.floor(Math.random() * activeTiles.length)];

            // randomize directions for each tile
            let suffledDirections = shuffleArray(Directions);
            for (let direction of suffledDirections) {

                // get neighbor for current direction
                let selectedNeighbor = selectedTile.neighborAt(direction, tiles);

                // skip it if already has connections
                if (!selectedNeighbor || selectedNeighbor.connections !== 0) {
                    continue;
                }

                // connect tile and neighbor
                selectedTile.connections += direction;
                selectedNeighbor.connections = TileObject.getOpposite(direction);
                activeTiles.push(selectedNeighbor);

                // filter out cells which can't have new connections
                activeTiles = activeTiles.filter((tile) => {
                    return tile.hasFreeNeighbors(tiles) && tile.getNumberConnections() < 3;
                });

                // no process any more tiles
                break;
            }
        }
        tiles.forEach(tile => tile.updateType());

        this.state.tiles = tiles;
        this.state.rootTile = rootTile;
    }

    render() {
        const tilesItems = this.state.tiles.map((tile) => {
            return (
                <Tile
                    col={tile.col} row={tile.row} type={tile.type} connections={tile.connections}
                    key={tile.row.toString() + '-' + tile.col.toString()}
                />
            )
        });

        return (
            <div className="grid-container">
                <div className="grid">{tilesItems}</div>
            </div>
        );
    }
}

export default Maze;