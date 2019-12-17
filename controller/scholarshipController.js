const { Sequelize, sequelize, User, Student , scholarship, Subscription, Payment } = require('../models')
const Op = Sequelize.Op
const moment = require('moment')
const {uploader} = require('../helpers/uploader')
const fs = require('fs')

module.exports = {
    postScholarship : ( req, res) => { // need changes
        // console.log('masuk post scholarship')
        var Date = moment()
        const { 
            judul, 
            studentId, 
            // schoolId, 
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
            // schoolId,
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
    putScholarship : (req, res) => { // need changes
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
        const { userId } = req.user
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
                        // {
                        //     model : School,
                        //     attributes : [

                        //         ["nama", "namaSekolah"]
                        //     ]
                        // },
                    
                    ],
                    where : {
                        // isOngoing : 1,
                        userId
                    },
                     
                })

                .then((result) => {
                    console.log(result)
                    return res.status(200).send(result)
                }).catch((err)=>{
                    return res.status(500).send({message: err})
                })

    },
    getScholarshipDonations: (req, res) => {
        // console.log(req.body)
        // const userId = req.body.userId
        // const offset = req.body.offset
        // const limit = req.body.limit
  
        Payment.findAndCountAll({
        //   limit:parseInt(limit),
        //   // limit : 10,
        //   offset:offset,
          // subQuery: false,
            attributes : [
              'nominal',
              [sequelize.col('scholarship.judul'), 'judulScholarship'],
              [sequelize.col('scholarship.id'), 'scholarshipId'],
            //   [sequelize.col('scholarship->student.name'), 'namaMurid'],
            //   [sequelize.col('scholarship->student.studentImage'), 'fotoMurid'],
              [sequelize.col('user.nama'), 'donators'],
            //   'order_id',
              'komentar',
              'createdAt',
              'id'
            ],
            where : {
                isRefund : 0,
                isDeleted : 0,
                scholarshipId : req.body.id
                // statusPayment : 'settlement'
            },
            include : [
              {
                  model : User,
                  required : false,
                  attributes : [] 
              },
              {
                model : scholarship,
                required : true,
                attributes : [] 
            },
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        }).then((result)=>{
          console.log('erresult')
          console.log(result)
          console.log(result.count)
          
          return res.status(200).send({result : result.rows, count : result.count})
        }).catch((err)=>{
            console.log(err)
          return res.status(500).send({message : err})
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
                        "id",
                        "judul",
                        "studentId",
                        'currentValue',
                        [sequelize.col('Student.biayaSekolah'), 'biayaSekolah'],
                        [sequelize.col('Student.kelas'), 'kelas'],
                        [sequelize.col('Student.provinsi'), 'provinsi'],
                        [sequelize.col('Student.story'), 'story'],

                        [sequelize.col('Student.shareDescription'), 'shareDescription'],
                        [sequelize.col('Student.kartuSiswa'), 'kartuSiswa'],
                        [sequelize.col('Student.raportTerakhir'), 'raportTerakhir'],
                        [sequelize.col('Student.studentImage'), 'studentImage'],
                        [sequelize.col('Student.kartuKeluarga'), 'kartuKeluarga'],
                        [sequelize.col('Student.id'), 'siswaId'],
                        [sequelize.col('Student.name'), 'namaSiswa'],
                        [sequelize.col('Student.studentImage'), 'studentImage'],
                        [sequelize.col('Student.createdAt'), 'studentCreated'],

                        // [sequelize.fn('SUM', sequelize.col('Payments.nominal')), 'totaldonation'],
                        [sequelize.fn('COUNT', sequelize.col('Payments.id')), 'jumlahdonation'],
                    ],
                    
                    include : [{
                        model : Student,
                        attributes : []
                    },
                    {
                        model : Payment,
                        attributes : []
                    }],
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
    // DI PAGE HOME UI
    getAllScholarshipList : (req,res) =>{
        var { offset, limit, name, date} = req.body;
        
        // console.log(req.body)
        // console.log(offset)

                scholarship.findAll({
                    limit:parseInt(limit),
                    // limit : 10,
                    offset:offset,
                    subQuery: false,
                    attributes : [
                        "id",
                        "judul",
                        // "nominal",
                        // // "durasi",
                        // "description",
                        "biayaSekolah",
                        "studentId",
                        "currentValue",
                        // "shareDescription",
                        // "scholarshipStart",
                        // "paymentSource",
                        // "scholarshipEnded",
                        // [sequelize.fn('datediff', sequelize.col('scholarshipEnded') ,  sequelize.col('scholarshipStart')), 'SisaHari'],
                        // [sequelize.fn('SUM', sequelize.col('Subscriptions.nominalSubscription')), 'currentSubs'],
                        [sequelize.fn('SUM', sequelize.col('Payments.nominal')), 'totaldonation'],
                        [sequelize.fn('COUNT', sequelize.col('Payments.id')), 'jumlahdonation'],
          
              
                    ],
                 
                    
                    include : [{
                        model : Student,
                        attributes : [
                            ["name", "namaSiswa"],
                            "studentImage",
                            "tanggalLahir",
                            // "biayaSekolah"
                        ],
                        where: {
                            dataStatus: 'Verified'
                        }
                    },
                    // {
                    //     model : School,
                    //     attributes : [
                    //         ["nama", "namaSekolah"]
                    //     ]
                    // },
                    // {
                    //     model : Subscription,
                    //     attributes :   [
                    //         'nominalSubscription',
                    //         [sequelize.fn('SUM', sequelize.col('nominalSubscription')), 'currentSubs']
                    //     ], 
                    //     group : ['scholarshipId'],    
                    //     separate : true
                    // },
                    {
                        model : Payment,
                        attributes : []
                    }
                    ],
                    where : {
                        judul : {
                            [Op.like] : `%${name}%`
                        },
                        // isDeleted : 0,
                        isOngoing : 1
                    },
                    order: [['id', `${date}`], ['createdAt', `${date}`]],
                    group : ['id']
                     
                })

                .then((results) => {
                    // console.log(result[0].dataValues.Subscriptions.length)
                    // console.log(result[0].dataValues.Subscriptions[0].dataValues)
                    // return res.status(200).send(result)
                    // console.log(results)
                    // Kurang Counting

                    console.log('masuk')
                    
                    // return res.status(200).send(result)

                    scholarship.count({
                        where : {
                            judul : {
                                [Op.like] : `%${name}%`
                            },
                            isOngoing : 1
                        }
                    })
                    .then((resultTotalScholarship) => {
                        console.log(results)
                        var total = resultTotalScholarship;

                        return res.status(200).send({message: 'Success Get All Scholarship', results, total})
                        // return res.status(200).send(result)
                    })
                    .catch((err) => {
                        console.log('masukerr')
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
            isOngoing : 0
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
            // console.log(res)
            return res.status(200).send(result)
        })
    },
    putVerification:(req, res) => {
        console.log('--------------------> put Verification')
        let {id} = req.query
        let {  note, isOngoing } = req.body
        // console.log(req.body)
        // console.log(req.query)
        scholarship.update({
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
    },
    generateImgUrlquill(req,res){
        const path = '/post/image/scholarship'; //file save path
        const upload = uploader(path, 'PQuil').fields([{ name: 'image'}]); //uploader(path, 'default prefix')

        upload(req, res, (err) => {

            if(err){
                console.log('masuk2')
                return res.status(500).json({ message: 'Upload picture failed !', error: err.message });
            }
            const { image } = req.files;
            console.log(image)
            const imagePath = image ? path + '/' + image[0].filename : null;
            console.log(imagePath)
            if(imagePath){
                return res.status(200).send(imagePath)
            }else{
                return res.status(404).send('error')
            }
        })  
    },



    // GetScholarshipAllUserByAdmin
    getScholarshipAllUserByAdmin: (req, res)  => {
        
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
                        // "paymentSource",
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
                            "studentImage",
                            "tanggalLahir"
                        ]
                    },
                    // {
                    //     model : School,
                    //     attributes : [
                    //         ["nama", "namaSekolah"]
                    //     ]
                    // },
                    // {
                    //     model : Subscription,
                    //     attributes :   [
                    //         'nominalSubscription',
                    //         [sequelize.fn('SUM', sequelize.col('nominalSubscription')), 'currentSubs']
                    //     ], 
                    //     group : ['scholarshipId'],    
                    //     separate : true
                    // },
                    {
                        model : Payment,
                        attributes : []
                    }
                    ],
                    where : {
                        judul : {
                            [Op.like] : `%${name}%`
                        },
                        // isDeleted : 0,
                    },
                    order: [['id', `${date}`], ['createdAt', `${date}`]],
                    group : ['id']
                     
                })

                .then((results) => {
                    // console.log(result[0].dataValues.Subscriptions.length)
                    // console.log(result[0].dataValues.Subscriptions[0].dataValues)
                    // return res.status(200).send(result)
                    // console.log(results)
                    // Kurang Counting
                    
                    // return res.status(200).send(result)

                    scholarship.count({
                        where : {
                            judul : {
                                [Op.like] : `%${name}%`
                            }
                        }
                    })
                    .then((resultTotalScholarship) => {
                        var total = resultTotalScholarship;

                        return res.status(200).send({message: 'Success Get All Scholarship', results, total})
                        // return res.status(200).send(result)
                    })
                    .catch((err) => {
                        console.log(err)
                        return res.status(500).send({message: err})
                    })
                }).catch((err)=>{
                    console.log(err)
                    return res.status(500).send({message: err})
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

