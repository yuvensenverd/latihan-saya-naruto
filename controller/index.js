const userController = require('./userController')
const stundentController=require('./studentController')
const projectController = require('./projectController')
const studentDetailController = require('./studentDetailController')

const schedule = require('node-schedule');

module.exports = {
    userController,
    stundentController,
    projectController,
    studentDetailController
}


