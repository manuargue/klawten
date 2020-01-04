import React from 'react';
import { TileTypes } from '../utils/constants';
import './Tile.scss';

class Tile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            // ...
        };
    }

    render() {
        const { type, connections, isConnected, isLocked, angle, isShaking } = this.props;
        let gridClass, svgElementClass, element;

        if (type === TileTypes.TERMINAL) {
            // 1 (_|_)
            element = (
                <React.Fragment>
                    <line className="wire" x1="25" y1="0" x2="25" y2="25" />
                    <rect className="terminal" x="12" y="12" width="26" height="26" />
                    <rect className="light" x="16" y="16" width="2" height="2" />
                </React.Fragment>
            );
        } else if (type === TileTypes.WIRE || type === TileTypes.SERVER) {
            if ([5, 10].includes(connections)) {
                // 5 (|)
                element = (<line className="wire" x1="25" y1="0" x2="25" y2="50" />);
            } else if ([7, 11, 13, 14].includes(connections)) {
                // 7 (|-)
                element = (
                    <React.Fragment>
                        <line className="wire" x1="25" y1="0" x2="25" y2="50" />
                        <line className="wire" x1="25" y1="25" x2="50" y2="25" />
                    </React.Fragment>
                );
            } else if ([3, 6, 9, 12].includes(connections)) {
                // 3 (|_)
                element = (
                    <React.Fragment>
                        <line className="wire" x1="25" y1="0" x2="25" y2="25" />
                        <line className="wire" x1="25" y1="25" x2="50" y2="25" />
                    </React.Fragment>
                );
            } else if ([1, 2, 4, 8].includes(connections)) {
                // 1 (')
                element = <line className="wire" x1="25" y1="0" x2="25" y2="25" />;
            } else {
                // 15 (+)
                element = (
                    <React.Fragment>
                        <line className="wire" x1="25" y1="0" x2="25" y2="50" />
                        <line className="wire" x1="0" y1="25" x2="50" y2="25" />
                    </React.Fragment>
                );
            }
            if (type === TileTypes.SERVER) {
                // add server block on top of wires
                element = (
                    <React.Fragment>
                        {element}
                        <rect className="server" x="10" y="10" width="30" height="30" />
                        <rect className="light" x="14" y="14" width="2" height="2" />
                    </React.Fragment>
                );
            }
        }
        if (isConnected) {
            svgElementClass += ' active';
        }

        gridClass = 'grid-item';
        if (isLocked) {
            gridClass += ' is-locked';
        }
        if (isShaking) {
            gridClass += ' shake';
        }

        const svgStyle = { transform: `rotate(${angle}deg)` };

        const svgGradient = (
            <defs>
                <radialGradient id="radial-gradient-active" cx="50%" cy="50%" r="50%" gradientUnits="userSpaceOnUse">
                    <stop className="stop-active-light" offset="15%" />
                    <stop className="stop-active-dark" offset="90%" />
                    <animate attributeName="r" dur="3000ms" repeatCount="indefinite" values="30%; 60%; 50%; 60%; 30%;" />
                </radialGradient>
            </defs>
        );

        return (
            <div className={gridClass} onClick={this.props.onClick} onContextMenu={this.props.onContextMenu}>
                <svg width="50" height="50" className={svgElementClass} style={svgStyle}>
                    {isConnected && svgGradient}
                    {element}
                </svg>
            </div>
        );
    }
}

export default Tile;