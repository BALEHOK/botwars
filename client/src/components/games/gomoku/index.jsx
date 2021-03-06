import React from 'react';
import { js_beautify as beautify } from 'js-beautify';

import Engine from './engine';
import Visualizer from './visualizer';
import DefaultBotSource from './defaultBot';
import BotFactory from 'common/botFactory';
import botsRepo from 'repositories/botsRepo';

const gameId = 10;

function createBot(botSource) {
  return BotFactory.Create(botSource || DefaultBotSource);
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
    const setBot1Text = botSource => {
      const bot = beautify(botSource);
      this.refs.bot1source.value = bot;
    };

    if (this.context.authenticated) {
      this.setState({ loading: true });
      botsRepo.get(gameId)
        .then(data => {
          setBot1Text(data && data.botSource || DefaultBotSource);
          this.setState({ loading: false });
        })
    } else {
      setBot1Text(DefaultBotSource);
    }

    const bot2 = beautify(DefaultBotSource);
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
      <div className="container">
        <div className="row">
          <div className="page-header">
            <h1 className="text-muted">Gomoku</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <Visualizer dataStream={this.engn.gameStream} />
          </div>
        </div>

        {
          this.state.loading
            ? (
              <div className="row">
                <div className="col-sm-12">loading...</div>
              </div>
            )
            : null
        }

        <div className="row">
          <div className="col-sm-6">
            <div>bot 1</div>
            <div>
              <textarea className="form-control"
                rows="25"
                ref="bot1source"
              />
            </div>
            <div>
              <button className="btn btn-default"
                onClick={this.submitBot1}
              >
                Submit
              </button>
            </div>
          </div>
          <div className="col-sm-6">
            <div>bot 2</div>
            <div>
              <textarea className="form-control"
                rows="25"
                ref="bot2source"
              />
            </div>
            <div>
              <button className="btn btn-default"
                onClick={this.submitBot2}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <button className="btn btn-primary"
              onClick={this.startGame}
            >
              Play
            </button>
          </div>
        </div>
      </div >
    )
  }
}
