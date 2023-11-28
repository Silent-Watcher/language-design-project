'use strict';

const handleNotFoundError = (req, res, next) => {
  return res.status(404).render('404');
};

module.exports = handleNotFoundError;