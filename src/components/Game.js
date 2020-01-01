import React from 'react';
import Title from './Title';
import Maze from './Maze';
import Score from './Score';

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            solvedConnections: 0,
            totalConnections: 0
        };

        this.updateScore = this.updateScore.bind(this);
    }

    updateScore(solved, total) {
        this.setState({
            solvedConnections: solved,
            totalConnections: total
        });
    }

    render() {
        const { solvedConnections, totalConnections } = this.state;

        return (
            <div>
                <Title />
                <Maze handleScore={this.updateScore} />
                <Score totalConnections={totalConnections} solvedConnections={solvedConnections} />
            </div>
        );
    }
}

export default Game;