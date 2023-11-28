const db = require('../config/db.config');

function getFolders(userId) {
  return new Promise(async (res, rej) => {
    const folders = await db.execute(
      'SELECT id,name FROM folders where user_id = ?',
      [userId]
    );
    if (folders) {
      res(folders);
    } else {
      rej('query execution failed');
    }
  });
}

function deleteFolderById(folderId) {
  return new Promise(async (res, rej) => {
    const deletedFolder = await db.execute('DELETE from folders where id = ?', [
      folderId,
    ]);
    if (deletedFolder) {
      res(deletedFolder);
    } else {
      rej('failed to delete the folder');
    }
  });
}

function createNewFolder(name, user) {
  return new Promise(async (res, rej) => {
    const result = db.execute(
      'INSERT INTO folders (user_id,name)  VALUES(?,?);',
      [user.id, name]
    );
    if (result) {
      res(result);
    } else {
      rej('failed to create new folder');
    }
  });
}

module.exports = {
  getFolders,
  deleteFolderById,
  createNewFolder,
};
