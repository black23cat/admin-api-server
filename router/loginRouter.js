const { Router } = require('express');
const controller = require('../controller/loginController');

const loginRouter = Router();

loginRouter.post('/', controller.loginValidation, controller.loginAuth);

module.exports = loginRouter;
