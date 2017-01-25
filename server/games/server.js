const dbMigration = require('../db/migrations');
const express = require('express');
const cors = require('../middlewares/cors');
const bodyParser = require('body-parser');
const Runner = require('./runner');

// db initialization
const dbPromise = dbMigration.prepaireDb();

const tournamentRunner = new Runner();

// express app
var app = express();

app.use(cors);

app.use(bodyParser.json());

app.get('/favicon.ico', (req, res) => {
  res.status(404);
  res.end();
});

app.get('/', (req, res) => {
  res.json(tournamentRunner.getInfo());
  res.end();
});

app.get('/:tournamentShortName', (req, res) => {
  const tournamentShortName = req.params.tournamentShortName;
  if (tournamentShortName) {
    tournamentRunner.push(tournamentShortName);
    res.json({ message: 'Tournament round scheduled for ' + tournamentShortName });
  } else {
    res.json({ message: 'Tournament ShortName should not be empty' });
  }

  res.end();
});

Promise.all([dbPromise])
  .then(() => {
    app.listen(3002, '0.0.0.0', err => {
      if (err) {
        return console.error(err);
      }
      console.log('Listening at port 3002');

      tournamentRunner.start();
    });
  });
