const { Sequelize, sequelize, User, Student, StudenDetail, School, scholarship, Subscription, Payment } = require('../models')
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
        var end = moment().add(durasi, 'month').format('YYYY-MM-DD h:mm:ss')

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
            scholarshipEnded : end
        }).then((result) => {
         
            return res.status(200).send(result)

        }).catch((err) => {
            return res.status(500).send(err.message)
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
                        "isOngoing",
                        "note"
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
    // getScholarship : ( req, res) =>{
    //     const {id} = req.query
    //             scholarship.findAll({
    //                 attributes : [
    //                     "id",
    //                     "userId",
    //                     "judul",
    //                     "nominal",
    //                     "durasi",
    //                     "description",
    //                     "studentId",
    //                     "shareDescription",
    //                     "scholarshipStart",
    //                     "scholarshipEnded",
    //                     "isVerified",
    //                     "isOngoing"
    //                 ],
                   
    //                 include : [{
    //                         model : Student,
    //                         attributes : [
    //                             ["name", "namaSiswa"],
    //                             "studentImage"
    //                         ],
    //                         include : [{
    //                             model : User,
    //                             require: true,
    //                             attributes:["nama"]
    //                         }]
    //                     },
    //                     {
    //                         model : School,
    //                         attributes : [

    //                             ["nama", "namaSekolah"]
    //                         ]
    //                     },
    //                 ],
    //                 order:[['id', 'DESC']]
                     
    //             })

    //             .then((result) => {
    //                 // console.log(result)
    //                 return res.status(200).send(result)
    //             }).catch((err)=>{
    //                 return res.status(500).send({message: err})
    //             })

    // },
    getScholarshipDetail:(req,res) => {
        const {id} = req.query
        // console.log('---------------> masuk secDetail')
        // console.log(req.query)
        sequelize.transaction(function(t){
            return(
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
                        [sequelize.fn('datediff', sequelize.col('scholarshipEnded') ,  sequelize.col('scholarshipStart')), 'SisaHari'],
                        [sequelize.fn('SUM', sequelize.col('Subscriptions.nominalSubscription')), 'currentSubs'],
                        [sequelize.fn('COUNT', sequelize.col('Subscriptions.id')), 'totalDonasi']
                        
        
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
                    {
                        model : Subscription,
                        attributes : []
                    }


                    ],
                    where : {
                        id,
                        isOngoing: 1,
                    },
                    group: ['id']
                     
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
    // DI PAGE SUBSCRIPTION UI
    getAllScholarshipList : (req,res) =>{
        var { page, limit, name, date} = req.body;
        
        var offset = (page * limit) - limit
        console.log(req.body)
        console.log(offset)

                scholarship.findAll({
                    limit:parseInt(limit),
                    // limit : 10,
                    offset:offset,
                    subQuery: false,
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
                        [sequelize.fn('datediff', sequelize.col('scholarshipEnded') ,  sequelize.col('scholarshipStart')), 'SisaHari'],
                        // [sequelize.fn('SUM', sequelize.col('Subscriptions.nominalSubscription')), 'currentSubs'],
                        [sequelize.fn('SUM', sequelize.col('Payments.nominal')), 'totaldonation'],
                        [sequelize.fn('COUNT', sequelize.col('Payments.id')), 'jumlahdonation'],
          
              
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
                    {
                        model : Subscription,
                        attributes :   [[sequelize.fn('SUM', sequelize.col('nominalSubscription')), 'currentSubs']], 
                                    
                        separate : true
                    },
                    {
                        model : Payment,
                        attributes : []
                    }
                    ],
                    where : {
                        // isOngoing : 1,
                        judul : {
                            [Op.like] : `%${name}%`
                        },
                        // isDeleted : 0,
                        isOngoing : 1,
                        isVerified: 1
                    },
                    group : ['id']
                     
                })

                .then((result) => {
                    // console.log(result)
                    // Kurang Counting
                    
                    // return res.status(200).send(result)

                    scholarship.count({
                        where : {
                            judul : {
                                [Op.like] : `%${name}%`
                            },
                            isOngoing : 1,
                            isVerified: 1
                        }
                    })
                    .then((resultTotalScholarship) => {
                        var total = resultTotalScholarship;

                        return res.status(200).send({message: 'Success Get All Scholarship', result, total})
                    })
                    .catch((err) => {
                        console.log(err)
                        return res.status(500).send({message: err})
                    })
                }).catch((err)=>{
                    console.log(err)
                    return res.status(500).send({message: err})
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

    // getAllScholarship: (req, res) => {
        
    //     var { page, limit, name, date} = req.body;
        
    //     var offset = (page * limit) - limit
    //     console.log(req.body)
    //     console.log(offset)

    //     scholarship.findAll({
    //         limit: parseInt(limit),
    //         offset: offset,
    //         subQuery: false, 
    //         attributes : [
    //             "id",
    //             "judul",
    //             "nominal",
    //             "durasi",
    //             "description",
    //             "studentId",
    //             "shareDescription",
    //             "scholarshipStart",
    //             "scholarshipEnded",
    //             "isVerified",
    //             "isOngoing",
    //             // [sequelize.fn('datediff', sequelize.col('scholarshipEnded') ,  sequelize.fn("scholarshipStart")), 'SisaHari'],
    //             // [sequelize.fn('SUM', sequelize.col('Payments.nominal')), 'totalNominal'],
    //             // [sequelize.fn('COUNT', sequelize.col('Payments.id')), 'totalDonasi']
    //         ],
           
    //         include : [{
    //             model : Student,
    //             attributes : [
    //                 ["name", "namaSiswa"],
    //                 "studentImage"
    //             ]
    //         },
    //         {
    //             model : School,
    //             attributes : [

    //                 ["nama", "namaSekolah"]
    //             ]
    //         },
    //         // {
    //         //     model : Payment,
    //         //     required : false
    //         // },
    //         // {
    //         //     model: Subscription,
    //         //     required: false
    //         // }
    //     ]
    //     })
    //     .then((results) => {
    //         scholarship.count({
    //             where: {
    //                 judul: {
    //                     [Op.like] : `%${name}%`
    //                     },
    //                     isVerified : 1,
    //                     isOngoing : 1
    //             }
    //         })
    //         .then((resultsTotalScholarship) => {
    //             let total = resultsTotalScholarship

    //             console.log(results)
    //             return res.status(200).send({message: 'success get scholarship', results, total})
    //         })
    //         .catch((err) => {
    //             console.log(err)
    //         })

    //     }).catch((err)=>{
    //         return res.status(500).send({message: err})
    //     })
    
    
    // }

