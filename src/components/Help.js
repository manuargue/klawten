import React from 'react';
import './Help.scss';

class Help extends React.Component {

    render() {
        const helpText = [
            ["c", "decrease columns by one"],
            ["shift+c", "increase columns by one"],
            ["r", "decrease rows by one"],
            ["shift+r", "increase rows by one"],
            ["d", "set default configuration"],
            ["space", "regenerates map"],
            ["h", "toggle this help message"],
        ];

        const helpElements = helpText.map((help) => {
            const [keyCombination, description] = help;
            return (
                <div key={keyCombination} className="row">
                    <div className="col col-left">
                        <p className="help-text"><strong>{keyCombination}</strong></p>
                    </div>
                    <div className="col col-right">
                        <p className="help-text">{description}</p>
                    </div>
                </div>

            );
        });

        return (
            <div className="overlay container">
                <div className="table">
                    {helpElements}
                </div>
            </div>
        )
    }
}

export default Help;
