const dbMigration = require('./db/migrations');
const express = require('express');
const cors = require('./middlewares/cors');
const users = require('./middlewares/users');
const stormpath = require('express-stormpath');
const bodyParser = require('body-parser');

const clientUrl = 'http://127.0.0.1:3000';

// db initialization
const dbPromise = dbMigration.prepaireDb();

// express app
var app = express();

app.use(cors);

app.use(users(app));

const stormPathPromise = new Promise(resolve => app.on('stormpath.ready', resolve));

app.use(bodyParser.json());

app.post('/me', stormpath.loginRequired, function (req, res) {
  function writeError(message) {
    res.status(400);
    res.json({ message: message, status: 400 });
    res.end();
  }

  function saveAccount() {
    req.user.givenName = req.body.givenName;
    req.user.surname = req.body.surname;
    req.user.email = req.body.email;

    req.user.save(function (err) {
      if (err) {
        return writeError(err.userMessage || err.message);
      }
      res.end();
    });
  }

  if (req.body.password) {
    var application = req.app.get('stormpathApplication');

    application.authenticateAccount({
      username: req.user.username,
      password: req.body.existingPassword
    }, function (err) {
      if (err) {
        return writeError('The existing password that you entered was incorrect.');
      }

      req.user.password = req.body.password;

      saveAccount();
    });
  } else {
    saveAccount();
  }
});

app.use('/bots', require('./controllers/ttt3BotController'));

// for testing purposes only
app.get('/', (req, res) => {
  res.json({ message: 'I am accessible' });
  res.end();
})

Promise.all([dbPromise, stormPathPromise])
  .then(() => app.listen(3001, '0.0.0.0', err => {
    if (err) {
      return console.error(err);
    }
    console.log('Listening at port 3001');
  }));
