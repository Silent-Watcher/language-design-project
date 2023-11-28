'use strict';

const db = require('../config/db.config');

function getTasks(userId) {
  return new Promise(async (res, rej) => {
    const tasks = await db.execute('SELECT * FROM tasks where user_id = ?', [
      userId,
    ]);
    if (tasks) res(tasks);
    else rej('failed to get the tasks');
  });
}

function getFolderTasks(folderId, userId) {
  return new Promise(async (res, rej) => {
    const tasks = await db.execute(
      'SELECT * FROM tasks where user_id = ? AND folder_id = ?',
      [userId, folderId]
    );
    if (tasks) res(tasks);
    else rej("failed to get the folder' tasks");
  });
}

function deleteTaskById(taskId) {
  return new Promise(async (res, rej) => {
    const deletedTask = await db.execute('DELETE from tasks where id = ?', [
      taskId,
    ]);
    if (deletedTask) {
      res(deletedTask);
    } else {
      rej('failed to delete the folder');
    }
  });
}

function updateTaskState(taskId) {
  return new Promise(async (res, rej) => {
    const updateResult = db.query(
      'UPDATE tasks set is_done = 1 - is_done where id = ?',
      [taskId]
    );
    if (updateResult) res(updateResult);
    else rej('failed to update the task status');
  });
}

function createNewTask(userId , folderId , title){
  return new Promise(async (res, rej) => {
    const result = db.execute(
      'INSERT INTO tasks (user_id,title,folder_id)  VALUES(?,?,?);',
      [userId, title,folderId]
    );
    if (result) {
      res(result);
    } else {
      rej('failed to create new task');
    }
  });
}

module.exports = {
  getTasks,
  getFolderTasks,
  deleteTaskById,
  updateTaskState,
  createNewTask
};
