var express = require('express');
var cors = require('./middlewares/cors');
var users = require('./middlewares/users');
var stormpath = require('express-stormpath');
var bodyParser = require('body-parser');

const clientUrl = 'http://127.0.0.1:3000';

var app = express();

app.use(cors);

app.use(users(app));

app.on('stormpath.ready', function () {
  app.listen(3001, '127.0.0.1', function (err) {
    if (err) {
      return console.error(err);
    }
    console.log('Listening at http://127.0.0.1:3001');
  });
});

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
