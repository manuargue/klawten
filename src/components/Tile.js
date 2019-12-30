import React from 'react';
import { TileTypes } from './constants';
import './Tile.scss';

class Tile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            // ...
        };
    }

    render() {
        const { type, connections, isConnected } = this.props;
        let typeClass, element;

        if (type === TileTypes.TERMINAL) {
            // 1 (_|_)
            typeClass = `terminal-${connections}`;
            element = (
                <React.Fragment>
                    <line className="wire" x1="25" y1="0" x2="25" y2="25" />
                    <rect className="terminal" x="12" y="12" width="26" height="26" />
                </React.Fragment>
            );
        } else if (type === TileTypes.WIRE || type === TileTypes.SERVER) {
            typeClass = `wire-${connections}`;
            if ([5, 10].includes(connections)) {
                // 8 (--)
                element = (<line className="wire" x1="25" y1="0" x2="25" y2="50"/>);
            } else if ([7, 11, 13, 14].includes(connections)) {
                // 7 (|-)
                element = (
                    <React.Fragment>
                        <line className="wire" x1="25" y1="0" x2="25" y2="50"/>
                        <line className="wire" x1="25" y1="25" x2="50" y2="25"/>
                    </React.Fragment>
                );
            } else if ([3, 6, 9, 12].includes(connections)) {
                // 3 (|_)
                element = (
                    <React.Fragment>
                        <line className="wire" x1="25" y1="0" x2="25" y2="25"/>
                        <line className="wire" x1="25" y1="25" x2="50" y2="25"/>
                    </React.Fragment>
                );
            } else {
                // 15 (+)
                element = (
                    <React.Fragment>
                        <line className="wire" x1="25" y1="0" x2="25" y2="50"/>
                        <line className="wire" x1="0" y1="25" x2="50" y2="25"/>
                    </React.Fragment>
                );
            }
            if (type === TileTypes.SERVER) {
                // add server block on top of wires
                element = (
                    <React.Fragment>
                        {element}
                        <rect className="server" x="10" y="10" width="30" height="30" />
                    </React.Fragment>
                );
            }
        }
        if (isConnected) {
            typeClass += ' active';
        }

        return (
            <div className="grid-item">
                <svg width="50" height="50" className={typeClass}>
                    {element}
                </svg>
            </div>
        );
    }
}

export default Tile;