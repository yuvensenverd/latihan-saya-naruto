const {projectController, studentDetailController, stundentController , userController} 
= require('../controller')

console.log('masuk')

const schedule = require('node-schedule');

var schedulerInvoice = schedule.scheduleJob('*/9 * * * * *', function(){
    userController.reminderInvoice() //params
});

module.export = {
    schedulerInvoice
}




