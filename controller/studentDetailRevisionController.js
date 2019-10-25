const { Sequelize, sequelize, StudentRevision, School, Student } = require('../models')
const Op = Sequelize.Op
const Moment=require('moment')
const {uploader} = require('../helpers/uploader')
const fs = require('fs')

module.exports = {
    
    getStudentUnverified: (req, res) => {
        Student.findAll({
            where : {
                id: req.user.userId
            },
            include: [
                {
                    model: StudentDetail,
                    require: true,
                    // attributes: ['name']
                    // separate:true,
                    where : {
                        dataStatus: 0
                    },
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    }
                }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        })
        .then((results) => {
            res.send(results);
        })
        .catch((err) => {
            console.log(err);
        }) 
    }
}