'use strict';
const crypto = require('crypto');
const db = require('../config/db.config');

async function addNewUserToDb(user) {
  let result = await db.execute(
    'INSERT INTO users (name,email,password) VALUES(?,?,?)',
    [...Object.values(user)]
  );
  return result;
}

async function getUserByEmail(email) {
  const [user] = await db.execute('SELECT * FROM users WHERE email = ?', [
    email,
  ]);
  if (!Object.values.length > 0) {
    throw { status: 400, message: 'failed to login' };
  } else {
    return user[0];
  }
}
 function getProfileImage(email) {
  let hash = crypto
    .createHash('sha256')
    .update(email.toLowerCase().trim())
    .digest('hex');
  return `https://gravatar.com/avatar/${hash}.jpg`
}

module.exports = { addNewUserToDb, getUserByEmail, getProfileImage };
