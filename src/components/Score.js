import React from 'react';

class Score extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { totalConnections, solvedConnections } = this.props;

        return (
            <div>
                <p>Connections: {solvedConnections}/{totalConnections}</p>
            </div>
        );
    }
}

export default Score;