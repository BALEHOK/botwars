import React from 'react';
import { js_beautify as beautify } from 'js-beautify';

import Engine from './engine';
import Visualizer from './visualizer';
import DefaultBot from './defaultBot';
import BotFactory from 'common/botFactory';
import botsRepo from 'repositories/botsRepo';

const gameId = -1;

function createBot(botSource) {
  return botSource && BotFactory.Create(botSource) || new DefaultBot();
}

export default class Main extends React.Component {
  static contextTypes = {
    authenticated: React.PropTypes.bool
  };

  constructor(props) {
    super(props);

    this.engn = new Engine();

    this.state = {
      loading: false
    };
  }

  componentDidMount() {
    const defaultBot = 'function main(field, XorO) { for (let y = 0; y !== field.length; y++) { let row = field[y]; for (let x = 0; x !== row.length; x++) { if (row[x] === \'.\') { return [x, y]; } } } return [-1, -1]; }';
    const setBotText = botSource => {
      const bot = beautify(botSource);
      this.refs.bot1source.value = bot;
    };

    if (this.context.authenticated) {
      this.setState({ loading: true });
      botsRepo.get(gameId)
        .then(data => {
          setBotText(data && data.botSource || defaultBot);
          this.setState({ loading: false });
        })
    } else {
      setBotText(defaultBot);
    }

    const bot2 = beautify(defaultBot);
    this.refs.bot2source.value = bot2;
  }

  componentWillUnmount() {
    this.engn.stop();
  }

  submitBot1 = () => {
    const botSource = beautify(this.refs.bot1source.value);
    this.submitBot(botSource);
    this.refs.bot1source.value = botSource;
  }

  submitBot2 = () => {
    const botSource = beautify(this.refs.bot2source.value);
    this.submitBot(botSource);
    this.refs.bot2source.value = botSource;
  }

  submitBot = (botSource) => {
    this.setState({ loading: true });

    botsRepo.save(gameId, botSource)
      .then(this.setState({ loading: false }));
  }

  startGame = () => {
    let bot1 = createBot(this.refs.bot1source.value);
    let bot2 = createBot(this.refs.bot2source.value);

    this.engn.start(bot1, bot2);
  }

  render() {
    return (
      <div>
        <h1 className="text-muted">Tic Tac Toe 3x3</h1>

        <div>
          <Visualizer dataStream={this.engn.gameStream} />
        </div>

        {
          this.state.loading
            ? <div>loading...</div>
            : null
        }

        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-6">
              <div className="row">
                <span>bot 1</span>
              </div>
              <div className="row">
                <textarea className="form-control" rows="25"
                  ref="bot1source"
                  />
              </div>
              <div className="row">
                <button className="btn btn-default"
                  onClick={this.submitBot1}
                  >
                  Submit
                </button>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="row">
                <span>bot 2</span>
              </div>
              <div className="row">
                <textarea className="form-control" rows="25"
                  ref="bot2source"
                  />
              </div>
              <div className="row">
                <button className="btn btn-default"
                  onClick={this.submitBot2}
                  >
                  Submit
                </button>
              </div>
            </div>
          </div>
          <div className="row">
            <button className="btn btn-primary"
              onClick={this.startGame}
              >
              Play
            </button>
          </div>
        </div>
      </div>
    )
  }
}
