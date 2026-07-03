const { Router } = require('express');
const controller = require('../controller/jobDataController');

const jobDataRouter = Router();

jobDataRouter.get('/', controller.jobData);

module.exports = jobDataRouter;
