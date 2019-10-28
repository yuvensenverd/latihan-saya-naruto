const { Sequelize, sequelize, User, Student, StudenDetail, School, scholarship } = require('../models')
const Op = Sequelize.Op
const moment = require('moment')


module.exports = {
    postScholarship : ( req, res) => {
        console.log('masuk post scholarship')
        var Date = moment()
        const { 
            judul, 
            studentId, 
            schoolId, 
            userId, 
            nominal, 
            durasi, 
            desctiption, 
            shareDescription,
        } = req.body
        console.log(req.body)

        scholarship.create({
            judul,
            studentId,
            schoolId,
            userId,
            nominal,
            durasi,
            desctiption,
            shareDescription,
            scholarshipStart: Date
        }).then(() => {
            scholarship.findAll()
            .then((result) => {
                console.log(result)
                res.send(result)
            })
        }).catch((err) => {
            console.log(err)
        })
    },
    getScholarshipPerUser : ( req, res) =>{
        const {id} = req.query
        console.log('masuk getScholarshipPerUser')
        console.log(req.query)
        sequelize.transaction(function(t){
            return(
                scholarship.findAll({
                    attributes : [
                        "judul",
                        "nominal",
                        "durasi",
                        "description",
                        "studentId",
                        // "shareDescription",
                        // "scholarshipStart",
                        // "scholarshipEnded",
                        "isVerified",
                        "isOngoing"
                    ],
                    where : {
                        userId : id
                    },
                    include : [{
                        model : Student,
                        attributes : [
                            ["name", "namaSiswa"]
                        ]
                    },
                    {
                        model : School,
                        attributes : [
                            ["nama", "namaSekolah"]
                        ]
                    },
                    
                    ]
                     
                })

                .then((result) => {
                    console.log(result)
                    return res.status(200).send(result)
                }).catch((err)=>{
                    return res.status(500).send({message: err})
                })
            )
        })

    },
    getScholarshipDetail:(req,res) => {
        const {id} = req.query
        console.log('---------------> masuk secDetail')
        console.log(req.query)
        sequelize.transaction(function(t){
            return(
                scholarship.findAll({
                    attributes : [
                        "judul",
                        "nominal",
                        "durasi",
                        "description",
                        "studentId",
                        "shareDescription",
                        "scholarshipStart",
                        "scholarshipEnded"
                    ],
                    
                    include : [{
                        model : Student,
                        attributes : [
                            ["name", "namaSiswa"],
                            "studentImage"
                        ]
                    },
                    {
                        model : School,
                        attributes : [
                            ["nama", "namaSekolah"]
                        ]
                    }
                    ],
                    where : {
                        id
                    },
                     
                })

                .then((result) => {
                    console.log(result)
                    return res.status(200).send(result)
                }).catch((err)=>{
                    return res.status(500).send({message: err})
                })
            )
        })
    }
}