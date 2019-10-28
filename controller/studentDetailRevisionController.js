const { Sequelize, sequelize, StudentRevision, School, Student, StudentDetail, StudentDetailRevision } = require('../models')
const Op = Sequelize.Op
const Moment=require('moment')
const {uploader} = require('../helpers/uploader')
const fs = require('fs')

module.exports = {
    getStudentUnverified: (req, res) => {
        let value;
        if(req.query.type == 'new'){
            value = 'Unverified'
        }else if(req.query.type == 'update'){
            value = 'Update Unverified'
        }

        // console.log('-------------------------------------------------------------------')
        // console.log(value)

        Student.findAll({
            where : {
                userId: req.user.userId,
                dataStatus: 'Approved'
            },
            include : [
                {
                    model: StudentDetail,
                    require: true,
                    // attributes: ['name']
                    // separate:true,
                    where : {
                        dataStatus: value
                    },
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'deskripsi', 'id', 'kelas', 'pictureReport', 'studentId']
                    }
                },
                {
                    model : School,
                    attributes: 
                       [['nama', 'schoolName']]
                }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        })
        .then((results) => {
            console.log(results)
            return res.status(200).send(results);
        })
        .catch((err) => {
            console.log(err);
        }) 
    },


    getStudentDetailUnverified: (req, res) => {
        const { id } = req.params
        let value;
        if(req.query.type == 'new'){
            value = 'Unverified'
        }else if(req.query.type == 'update'){
            value = 'Update Unverified'
        }

        Student.findAll({
            where: {
                id: id,
                userId: req.user.userId,
                dataStatus: 'Approved'
            },
            include: [
                {
                    model: StudentDetail,
                    require: true,
                    // attributes: ['name']
                    // separate:true,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    },
                    where: {
                        dataStatus: value
                    }
                }
            ],
            attributes: {
                exclude: [
                    'createdAt', 
                    'updatedAt', 
                    'sekolah', 
                    'alamat',
                    'dataStatus',
                    'gender',
                    'isDeleted',
                    'gender',
                    'pendidikanTerakhir',
                    'schoolId',
                    'status',
                    'statusNote',
                    'story',
                    'studentImage',
                    'tanggalLahir',
                    'userId'
                ]
            }
        })
        .then((results) => {
            console.log(results)
            return res.status(200).send(results);
        })
        .catch((err) => {
            console.log(err);
        })
    },

    postStudentDetailApprove: (req, res) => {
        const {id} = req.params

        StudentDetail.update({
            dataStatus: 'Approved'
        }, {
            where: {
                id: id
            }
        })
        .then((results) => {
            console.log(results)
            return res.status(200).send(results)
        })
        .catch((err) => {
            return res.status(500).send({message:'error post', error:err})
        })
    },

    postStudentDetailRejected: (req, res) => {
        console.log(req.body)
        StudentDetail.update({
            dataStatus: 'Rejected',
            statusNote: req.body.text
        }, {
            where: {
                id: req.body.id
            }
        })
        .then((results) => {
            console.log(results)
            return res.status(200).send(results)
        })
        .catch((err) => {
            return res.status(500).send({message:'error post', error:err})
        })
    },

    getStudentDetailRevision: (req, res) => {
        const { id } = req.params
        StudentDetailRevision.findAll({
            where: {
                studentId: id
            }
        })
        .then((results) => {
            return res.status(200).send(results)
        })
        .catch((err) => {
            console.log(err)
        })
    }
}