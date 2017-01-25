import React from 'react';
import { Link } from 'react-router';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="page-header">
            <h1 className="text-muted">Games list</h1>
          </div>
        </div>
        <div className="row">
          <div className="list-group">
            <Link to="/games/ttt3" className="list-group-item">
              <h4 className="list-group-item-heading">Tic Tac Toe</h4>
              <p className="list-group-item-text">Classic 3x3 version</p>
            </Link>
            <Link to="/games/gomoku" className="list-group-item">
              <h4 className="list-group-item-heading">Gomoku (Five in a row)</h4>
              <p className="list-group-item-text">
                Gomoku is an abstract strategy board game, also called Gobang or Five in a Row.
                It is traditionally played with Go pieces (black and white stones) on a go board with 19x19 intersections.
                Black plays first and players alternate in placing a stone of their color on an empty intersection.
                The winner is the first player to get an unbroken row of five stones horizontally, vertically, or diagonally.
              </p>
            </Link>
          </div>
        </div>
      </div >
    );
  }
}
