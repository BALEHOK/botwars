const stormpath = require('express-stormpath');
const usersRepo = require('../db/usersRepo');

module.exports = app => {
  app.use(stormpath.init(app, {
    web: {
      produces: ['application/json']
    }
  }));

  return (req, res, next) => {
    stormpath.getUser(req, res, getUserId);

    function getUserId() {
      console.log('user', req.user);
      if (req.user) {
        let username = req.user.username;
        usersRepo.getUserId(username)
          .then(userId => {
            if (userId) {
              req.user.userId = userId;
              next();
            } else {
              usersRepo.setUserId(username)
                .then(userId => {
                  req.user.userId = userId;
                  next();
                });
            }
          })
      } else {
        next();
      }
    }
  }
};
