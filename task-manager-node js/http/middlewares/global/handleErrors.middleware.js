'use strict';

const handleErrors = (err, req, res, next) => {
  return res.status(err.status || 500).render('error', {
    code: res.statusCode,
    error: {
      message: err.message || 'internal server error',
      ...err,
    },
  });
};

module.exports = handleErrors;