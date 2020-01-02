import React from 'react';
import Tile from './Tile';
import MazeSizeOverlay from './MazeSizeOverlay';
import TileModel from '../models/TileModel';
import { Directions, TileTypes, GridLimits } from '../utils/constants';
import { shuffleArray, popFromSet } from '../utils/utils';
import './Maze.scss';


class Maze extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rows: GridLimits.rows.min,
            cols: GridLimits.cols.min,
            tiles: [],
            rootTile: null,
            solvedConnections: 0,
            isLocked: false,
            isShowingMazeSize: false,
        };

        this.generateGrid = this.generateGrid.bind(this);
        this.generateNetwork = this.generateNetwork.bind(this);
        this.updateConnectionStates = this.updateConnectionStates.bind(this);
        this.randomizeTiles = this.randomizeTiles.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleScore = this.handleScore.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);

        // listen to key events
        window.addEventListener('keydown', this.handleKeyDown);
    }

    componentDidMount() {
        this.generateNetwork();
    }

    /** generates empty grid */
    generateGrid(rows, cols) {
        const tiles = [];
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                tiles.push(new TileModel(row, col));
            }
        }
        return tiles;
    }

    /** rotate tiles randomly */
    randomizeTiles(tiles) {
        tiles.forEach((tile) => {
            let i = Math.floor(Math.random() * 10) + 1;
            while (i--) {
                const turns = Math.floor(Math.random() * 100);
                turns % 2 ? tile.rotateCW() : tile.rotateCCW();
            }
        });
        return tiles;
    }

    /** generate network */
    generateNetwork() {
        const { rows, cols } = this.state;

        let tiles = this.generateGrid(rows, cols);

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
                selectedNeighbor.connections = TileModel.getOpposite(direction);
                activeTiles.push(selectedNeighbor);

                // filter out cells which can't have new connections
                activeTiles = activeTiles.filter((tile) => {
                    return tile.hasFreeNeighbors(tiles) && tile.getNumberConnections() < 3;
                });

                // no process any more tiles
                break;
            }
        }

        tiles = this.randomizeTiles(tiles);
        tiles.forEach(tile => tile.updateType());

        this.setState(
            {
                tiles: tiles,
                rootTile: rootTile,
                isShowingMazeSize: true
            },
            this.updateConnectionStates
        );

        setTimeout(() => {
            this.setState({
                isShowingMazeSize: false
            });
        }, 150);
    }

    updateConnectionStates() {
        let tiles = [...this.state.tiles];
        let rootTile = tiles.find(tile => {
            return tile.type === TileTypes.SERVER;
        });

        let visitedTiles = new Set();
        let toVisitTiles = new Set();

        tiles.forEach(tile => { tile.isConnected = false });
        toVisitTiles.add(rootTile);

        let activeTile = null;
        while (toVisitTiles.size > 0) {
            activeTile = popFromSet(toVisitTiles);
            activeTile.isConnected = true;
            for (let direction of Directions) {
                if (!(activeTile.connections & direction))
                    continue;
                let neighbor = activeTile.neighborAt(direction, tiles);
                if (neighbor && (neighbor.connections & TileModel.getOpposite(direction))) {
                    if (!visitedTiles.has(neighbor)) {
                        toVisitTiles.add(neighbor);
                    }
                    visitedTiles.add(activeTile);
                }
            }
        }

        /** lock all tiles when solved */
        if (visitedTiles.size === tiles.length) {
            tiles.forEach(tile => { tile.isLocked = true });
        }

        this.setState({
            tiles: tiles,
            rootTile: rootTile,
            solvedConnections: visitedTiles.size
        }, this.handleScore);
    }

    handleClick(e, tile, direction) {
        const { isLocked } = this.state;
        e.preventDefault();

        if (isLocked)
            return;

        let tiles = [...this.state.tiles];
        direction === 'cw' ? tile.rotateCW() : tile.rotateCCW();
        this.setState({ tiles: tiles });
        this.updateConnectionStates();
    }

    handleScore() {
        const totalConnections = this.state.tiles.length;
        this.props.handleScore(this.state.solvedConnections, totalConnections);
    }

    handleKeyDown(e) {
        const { cols, rows, isLocked } = this.state;
        let newCols, newRows;

        if (e.key === 'h') {
            this.setState({ isLocked: !isLocked });
            this.props.onHelp();
        }

        if (isLocked)
            return;

        if (e.key === 'd') {
            this.setState({
                cols: GridLimits.cols.min,
                rows: GridLimits.rows.min
            },
                this.generateNetwork
            );
        } else if (e.key === 'C' && cols < GridLimits.cols.max) {
            newCols = cols + 1;
            this.setState({ cols: newCols }, this.generateNetwork);
        } else if (e.key === 'c' && cols > GridLimits.cols.min) {
            newCols = cols - 1;
            this.setState({ cols: newCols }, this.generateNetwork);
        } else if (e.key === 'R' && rows < GridLimits.rows.max) {
            newRows = rows + 1;
            this.setState({ rows: newRows }, this.generateNetwork);
        } else if (e.key === 'r' && rows > GridLimits.rows.min) {
            newRows = rows - 1;
            this.setState({ rows: newRows }, this.generateNetwork);
        } else if (e.key === ' ') {
            this.generateNetwork();
        }
    }

    render() {
        const { rows, cols, isShowingMazeSize } = this.state;

        const tilesItems = this.state.tiles.map((tile) => {
            return (
                <Tile {...tile.toProps()}
                    onClick={(e) => { this.handleClick(e, tile, 'ccw'); }}
                    onContextMenu={(e) => { this.handleClick(e, tile, 'cw'); }}
                    key={tile.getKey()}
                />
            )
        });

        const gridStyle = {
            width: cols * 50,
            height: rows * 50
        };

        return (
            <div className="grid-container disable-selection">
                <MazeSizeOverlay rows={rows} cols={cols} isShowing={isShowingMazeSize} />
                <div className="grid" style={gridStyle}>
                    {tilesItems}
                </div>
            </div>
        );
    }
}

export default Maze;