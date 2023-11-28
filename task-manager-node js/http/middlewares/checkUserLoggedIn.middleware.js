'use strict';

const checkUserLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/auth');
  }
};

module.exports = checkUserLoggedIn;
