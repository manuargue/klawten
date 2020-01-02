import React from 'react';
import './MazeSizeOverlay.scss';

class MazeSizeOverlay extends React.Component {

    render() {
        const { rows, cols, isShowing } = this.props;

        const gridStyle = {
            width: cols * 50,
            height: rows * 50
        };

        return (
            <div id="maze-size" style={gridStyle} className={`${isShowing ? 'maze-size-shown' : 'maze-size-hidden'}`}>
                <h1>{rows}x{cols}</h1>
            </div>
        )
    }
}

export default MazeSizeOverlay;
