const express = require('express');
const chalk = require('chalk');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const session = require('express-session');
const gravatar = require('gravatar');

const handleNotFoundError = require('./http/middlewares/global/notFoundError.middleware');
const checkUserLoggedIn = require('./http/middlewares/checkUserLoggedIn.middleware');
const {
  getFolders,
  deleteFolderById,
  createNewFolder,
} = require('./helpers/folders.helpers');
const {
  getTasks,
  getFolderTasks,
  deleteTaskById,
  updateTaskState,
  createNewTask,
} = require('./helpers/tasks.helpers');
const handleErrors = require('./http/middlewares/global/handleErrors.middleware');
const { hashPassword, verifyPassword } = require('./helpers/password.helpers');
const {
  addNewUserToDb,
  getUserByEmail,
  getProfileImage,
} = require('./helpers/users.helpers');

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.set('view engine', 'ejs');
app.set('views', [
  path.join(__dirname, 'views', 'pages'),
  path.join(__dirname, 'views', 'errors'),
]);
app.use(
  express.json(),
  express.urlencoded({ extended: true }),
  express.static('public'),
  helmet(),
  session({ secret: 'SESSION SECRET', cookie: { maxAge: 60000 } })
);

app.get('/', checkUserLoggedIn, async (req, res) => {
  const user = req.session.user;
  const { folderId, deleteFolderId, deleteTaskId, taskId } = req.query;
  const profileImage = getProfileImage(user.email);
  let activeFolderId = 0;
  let tasks;
  if (deleteFolderId) {
    const deletedFolder = await deleteFolderById(deleteFolderId);
  }
  if (deleteTaskId) {
    const deletedTaskId = await deleteTaskById(deleteTaskId);
  }
  if (taskId) {
    const stateUpdateResult = await updateTaskState(taskId);
  }
  if (folderId) {
    activeFolderId = folderId;
    [tasks] = await getFolderTasks(folderId, user.id);
  } else {
    [tasks] = await getTasks(user.id);
  }
  const [folders] = await getFolders(user.id);
  res.render('index', { user, folders, tasks, activeFolderId, profileImage });
});

app.post('/folder', checkUserLoggedIn, async (req, res, next) => {
  const newFolder = req.body;
  if (newFolder?.name) {
    const folderCreationResult = await createNewFolder(
      newFolder.name,
      req.session.user
    );
    if (folderCreationResult[0].affectedRows == 1) {
      res
        .status(201)
        .send({ id: folderCreationResult[0].insertId, name: newFolder.name });
    }
  } else {
    throw new {
      status: 400,
      message: 'you have to provide a name for your new folder',
    }();
  }
});

app.post('/task', checkUserLoggedIn, async (req, res, next) => {
  const newTask = req.body;
  if (newTask?.title) {
    const taskCreationResult = await createNewTask(
      req.session.user.id,
      newTask.folderId,
      newTask.title
    );
    if (taskCreationResult[0].affectedRows == 1) {
      res
        .status(201)
        .send({ id: taskCreationResult[0].insertId, name: newTask.title });
    }
  } else {
    throw new {
      status: 400,
      message: 'you have to provide a name for your new folder',
    }();
  }
});

app.get('/auth', (req, res) => {
  if (req.session.user) {
    res.redirect('/');
  }
  res.render('auth');
});

app.get('/logout', checkUserLoggedIn, (req, res, next) => {
  delete req.session.user;
  res.status(301).redirect('/auth');
});

app.post('/register', async (req, res, next) => {
  const newUser = req.body;
  newUser.password = hashPassword(newUser.password);
  const [insertionResult] = await addNewUserToDb(newUser);
  if (insertionResult.affectedRows === 1) {
    res.status(201).send({
      code: 201,
      message: 'user created successfully \n please login to your account',
    });
  } else {
    throw { code: 400, message: 'failed to register user' };
  }
});

app.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  const user = await getUserByEmail(email);
  const isPasswordValid = verifyPassword(password, user.password);
  if (isPasswordValid) {
    req.session.user = user;
    return res.json({
      code: 200,
      message: `welcome ${user.name}!`,
    });
  } else {
    throw { status: 400, message: 'login failed' };
  }
});

app.use(handleNotFoundError);
app.use(handleErrors);

app.listen(PORT, console.log(chalk.yellow('http://localhost:' + PORT)));
