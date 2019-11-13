const {projectController, studentDetailController, stundentController , userController, subscriptionController} 
= require('../controller')

console.log('masuk')

const schedule = require('node-schedule');

var schedulerInvoice = schedule.scheduleJob('*/5 * * * * *', function(){
    // subscriptionController.subscriptionPayment()
    // userController.scholarshipCheck() //params
    // userController.reminderInvoice()
});



module.export = {
    // schedulerInvoice
    schedulerInvoice
}




