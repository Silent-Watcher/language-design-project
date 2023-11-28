'use strict';
const bcrypt = require('bcrypt');

function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

function verifyPassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

module.exports = {
  hashPassword,
  verifyPassword,
};
