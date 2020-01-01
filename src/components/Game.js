import React from 'react';
import Title from './Title';
import Maze from './Maze';
import Score from './Score';
import Help from './Help';

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            solvedConnections: 0,
            totalConnections: 0,
            showHelp: false,
        };

        this.updateScore = this.updateScore.bind(this);
        this.toggleHelp = this.toggleHelp.bind(this);
    }

    toggleHelp() {
        const { showHelp } = this.state;
        this.setState({ showHelp: !showHelp });
    }

    updateScore(solved, total) {
        this.setState({
            solvedConnections: solved,
            totalConnections: total
        });
    }

    render() {
        const { solvedConnections, totalConnections, showHelp } = this.state;

        return (
            <div>
                {showHelp && <Help />}
                <Title />
                <Maze handleScore={this.updateScore} onHelp={this.toggleHelp} />
                <Score totalConnections={totalConnections} solvedConnections={solvedConnections} />
            </div>
        );
    }
}

export default Game;