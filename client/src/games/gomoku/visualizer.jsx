import React, {PropTypes} from 'react';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/concatAll';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/zip';

import { GameStateEnum } from '../../common/ENUM';

const stepDelay = 20;

export default class Visualizer extends React.Component {
  static propTypes = {
    dataStream: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.subscribeOnGameStream(this.props);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  subscribeOnGameStream(props) {
    this.visualDataStreamSubscription = props.dataStream
      .map(gameState => JSON.parse(JSON.stringify(gameState)))
      .map(gameState => Observable.of(gameState).delay(stepDelay))
      .concatAll()
      .subscribe(gameState => this.setState({
        gameState: gameState.state,
        field: gameState.data,
        result: gameState.result
      }));
  }

  unsubscribe() {
    this.visualDataStreamSubscription && this.visualDataStreamSubscription.unsubscribe();
  }

  render () {
    let s = this.state;

    if (!s || s.gameState === GameStateEnum.notStarted) {
      return (
        <div>Game not started</div>
      );
    }

    return (
      <div>
        {s.field.map((row, i) => (
          <div key={i}>
            {JSON.stringify(row)}
          </div>
        ))}
        {
          s.result
            ? <div>{s.result}</div>
            : null
        }
      </div>
    );
  }
}
