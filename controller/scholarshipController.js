const { Sequelize, sequelize, User, Student, StudenDetail, School, scholarship } = require('../models')
const Op = Sequelize.Op
const moment = require('moment')


module.exports = {
    postScholarship : ( req, res) => {
        // console.log('masuk post scholarship')
        var Date = moment()
        const { 
            judul, 
            studentId, 
            schoolId, 
            userId, 
            nominal, 
            durasi, 
            description, 
            shareDescription,
        } = req.body
        // console.log(req.body)
        var end = moment().add(durasi, 'month').format("YYYY-MM-DD h:mm:ss")

        scholarship.create({
            judul,
            studentId,
            schoolId,
            userId,
            nominal,
            durasi,
            description,
            shareDescription,
            scholarshipStart: Date,
            scholarshipEnded: end
        }).then(() => {
            scholarship.findAll()
            .then((result) => {
                // console.log(result)
                res.send(result)
            })
        }).catch((err) => {
            console.log(err)
        })
    },
    putScholarship : (req, res) => {
        // console.log(req.body)
        // console.log('masuk edit scholarship')
        const {id, judul, nominal, durasi, description, shareDescription} = req.body
        scholarship.update({
            judul,
            nominal,
            durasi,
            description,
            shareDescription
        },{
            where : {
                id  
            }
        })
        .then((result) => {
            // console.log(result)
            return res.status(200).send(result)
        }).catch((err) => {
            return res.status(500).send(err)
        })
    },
    getScholarshipPerUser : ( req, res) =>{
        console.log('------------------------> masuk per user')
        console.log(req.query)
        const {id} = req.query
                scholarship.findAll({
                    attributes : [
                        "id",
                        "judul",
                        "nominal",
                        "durasi",
                        "description",
                        "studentId",
                        "shareDescription",
                        "scholarshipStart",
                        "scholarshipEnded",
                        "isVerified",
                        "isOngoing"
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
                        },
                    
                    ],
                    where : {
                        userId : id 
                    },
                     
                })

                .then((result) => {
                    // console.log(result)
                    return res.status(200).send(result)
                }).catch((err)=>{
                    return res.status(500).send({message: err})
                })

    },
    getScholarship : ( req, res) =>{
        const {id} = req.query
                scholarship.findAll({
                    attributes : [
                        "id",
                        "userId",
                        "judul",
                        "nominal",
                        "durasi",
                        "description",
                        "studentId",
                        "shareDescription",
                        "scholarshipStart",
                        "scholarshipEnded",
                        "isVerified",
                        "isOngoing"
                    ],
                   
                    include : [{
                            model : Student,
                            attributes : [
                                ["name", "namaSiswa"],
                                "studentImage"
                            ],
                            include : [{
                                model : User,
                                require: true,
                                attributes:["nama"]
                            }]
                        },
                        {
                            model : School,
                            attributes : [

                                ["nama", "namaSekolah"]
                            ]
                        },
                    ],
                    order:[['id', 'DESC']]
                     
                })

                .then((result) => {
                    // console.log(result)
                    return res.status(200).send(result)
                }).catch((err)=>{
                    return res.status(500).send({message: err})
                })

    },
    getScholarshipDetail:(req,res) => {
        const {id} = req.query
        // console.log('---------------> masuk secDetail')
        // console.log(req.query)
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
                    // console.log(result)
                    return res.status(200).send(result)
                }).catch((err)=>{
                    return res.status(500).send({message: err})
                })
            )
        })
    },
    cancelScholarship: (req, res) => {
        // console.log(req.query)
        // console.log('--------------------------> masuk cancel')
        scholarship.update({
            isVerified: 'Cancelled',
            isOngoing : 'Cancelled'
        },{
            where : {
                id : req.query.id  
            }
        })
        .then((result) => {
            // console.log(result)
            return res.status(200).send(result)
        }).catch((err) => {
            return res.status(500).send(err)
        })
    },
    getExistStudent: (req, res) => {
        console.log('---------------------> masuk get exist student')
        let {id}=req.query
        scholarship.findAll({
            attributes:[
                "id",
                "studentId"
            ],
            include:[{
                model: Student,
                attributes:["name"]
            }],
            where: {
                userId : id
            }
        })
        .then((result) => {
            console.log(res)
            return res.status(200).send(result)
        })
    },
    putVerification:(req, res) => {
        console.log('--------------------> put Verification')
        let {id} = req.query
        let { isVerified, note, isOngoing } = req.body
        // console.log(req.body)
        // console.log(req.query)
        scholarship.update({
            isVerified,
            isOngoing,
            note
        },{
            where : {
                id  
            }
        })
        .then((result) => {
            return res.status(200).send(result)
        }).catch((err) => {
            return res.status(500).send(err)
        })
    }
} 