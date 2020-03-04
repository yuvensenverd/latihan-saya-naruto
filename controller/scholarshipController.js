const { Sequelize, sequelize, User, Student , scholarship, Subscription, Payment, school, dokumen_siswa} = require('../models')
const Op = Sequelize.Op
const moment = require('moment')
const {uploader} = require('../helpers/uploader')
const fs = require('fs')
const { transporter } = require('../helpers/mailer')

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
    getScholarshipPerUser : ( req, res) => {
        console.log('------------------------> masuk per user')
        var { offset, limit, name, date, pendidikanTerakhir, provinsiMurid, isVerified} = req.body;

        if(!isVerified) {
            isVerified = 'Verified'
        }

        console.log(req.body)
        const { userId } = req.user
        console.log(req.user)
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
                            ["id", "idSiswa"],
                            ["name", "namaSiswa"],
                            "studentImage",
                            "tanggalLahir",
                            "provinsi",
                            "story",
                            "kelas",
                            "pendidikanTerakhir",
                            'nisn',
                            'kegiatanSosial'
                            // "biayaSekolah"
                        ],
                        include: [
                            {
                                model : school,
                                attributes : [
                                    ['nama', 'namaSekolah'],
                                    ['alamat', 'alamatSekolah'],
                                    'cabangBank',
                                    'bank',
                                    'email',
                                    ['telepon', 'teleponSekolah'],
                                    'namaPemilikRekening',
                                    'nomorRekening'

                                ]
                            },
                        ],
                        where: {
                            dataStatus: isVerified,
                            pendidikanTerakhir: {
                                [Op.in] : pendidikanTerakhir
                            }, 
                            provinsi: {
                                [Op.in] : provinsiMurid
                            },
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
                            [Op.like] : `%${name}%`,
                        },
                        userId,
                        // isDeleted : 0,
                        isOngoing : 1
                    },
                    // order: [['id', `${date}`], ['createdAt', `${date}`]],
                    order: [['currentValue', 'DESC']],
                    group : ['id']
                     
                })

                .then((results) => {
                    console.log(results)
                    return res.status(200).send({results})
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
        // sequelize.transaction(function(t){
        //     return(
                scholarship.findAll({
                    subQuery: false,
                    attributes : [
                        "id",
                        "judul",
                        "studentId",
                        'currentValue',
                        // [sequelize.col('Student.id'), 'siswaId'],
                        // [sequelize.col('Student.name'), 'namaSiswa'],
                        // [sequelize.col('Student.status'), 'status'],
                        // [sequelize.col('Student.alamat'), 'alamat'],
                        // [sequelize.col('Student.gender'), 'gender'],
                        // [sequelize.col('Student.tanggalLahir'), 'tanggalLahir'],
                        // [sequelize.col('Student.pendidikanTerakhir'), 'pendidikanTerakhir'],
                        // [sequelize.col('Student.studentImage'), 'studentImage'],
                        // [sequelize.col('Student.provinsi'), 'provinsi'],
                        // [sequelize.col('Student.story'), 'story'],
                        // [sequelize.col('Student.alamatSekolah'), 'alamatSekolah'],
                        // [sequelize.col('Student.biayaSekolah'), 'biayaSekolah'],
                        // [sequelize.col('Student.namaSekolah'), 'namaSekolah'],
                        // [sequelize.col('Student.teleponSekolah'), 'teleponSekolah'],
                        // [sequelize.col('Student.kelas'), 'kelas'],

                        

                        // [sequelize.col('Student.shareDescription'), 'shareDescription'],
                        // [sequelize.col('Student.kartuSiswa'), 'kartuSiswa'],
                        // [sequelize.col('Student.raportTerakhir'), 'raportTerakhir'],
                        // [sequelize.col('Student.kartuKeluarga'), 'kartuKeluarga'],
                        // [sequelize.col('Student.createdAt'), 'studentCreated'],

                        // [sequelize.col('Student->school.nama'), 'namaSekolah'],

                        // [sequelize.fn('SUM', sequelize.col('Payments.nominal')), 'totaldonation'],
                        [sequelize.fn('COUNT', sequelize.col('Payments.id')), 'jumlahdonation'],
                    ],
                    
                    include : [
                        {
                        model : Student,
                        attributes : [
                            ["id", "idSiswa"],
                            ['name', 'namaSiswa'],
                            'status',
                            'alamat',
                            'gender',
                            'tanggalLahir',
                            'pendidikanTerakhir',
                            'studentImage',
                            'provinsi',
                            'story',
                            'biayaSekolah',
                            'kelas',
                            'shareDescription',
                            'nisn',
                            'kegiatanSosial',
                            ['createdAt', 'studentCreated']

                        ],
                        include: [
                            {
                                model : school,
                                attributes : [
                                    ['nama', 'namaSekolah'],
                                    ['alamat', 'alamatSekolah'],
                                    'cabangBank',
                                    'bank',
                                    'email',
                                    ['telepon', 'teleponSekolah'],
                                    'namaPemilikRekening',
                                    'nomorRekening'

                                ],
                            }
                        ]
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
                    console.log(result)
                    // console.log(result)
                    return res.status(200).send(result)
                }).catch((err)=>{
                    return res.status(500).send({message: err})
                })
        //     )
        // })
    },
    // DI PAGE HOME UI
    getAllScholarshipList : (req,res) =>{
        var { offset, limit, name, date, pendidikanTerakhir, provinsiMurid, sekolahFilter} = req.body;
        
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
                 
                    
                    include : [
                        {
                        model : Student,
                        attributes : [
                            ["name", "namaSiswa"],
                            "studentImage",
                            "tanggalLahir",
                            "provinsi",
                            "story",
                            "kelas",
                            "pendidikanTerakhir"
                            // "biayaSekolah"
                        ],

                        include: [
                            {
                                model : school,
                                attributes : [
                                    ["nama", "namaSekolah"]
                                ],
                                where : {
                                    id: {
                                        [Op.in] : sekolahFilter
                                    }
                                }
                            },
                        ],
                        
                        where: {
                            dataStatus: 'Verified',
                            pendidikanTerakhir: {
                                [Op.in] : pendidikanTerakhir
                            }, 
                            provinsi: {
                                [Op.in] : provinsiMurid
                            },
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
                            [Op.like] : `%${name}%`,
                        },
                       

                        // isDeleted : 0,
                        isOngoing : 1
                    },
                    // order: [['id', `${date}`], ['createdAt', `${date}`]],
                    order: [['currentValue', 'DESC']],
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

    showAvailableProvince: (req, res) => {
        Student.findAll({
            attributes: ['provinsi'],
            group: ['provinsi']
        })
        .then((results) => {
            console.log('Provinsi Murid')
            let data = results.map(results => results.provinsi)
            
            return res.status(200).send(data)
        })
        .catch((err) => {
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
        
        console.log('------------------------> masuk per user')
        var { offset, limit, name, date, pendidikanTerakhir, provinsiMurid, isVerified} = req.body;

        console.log(req.body)
        const { userId } = req.user
        console.log(req.user)
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

                        // [sequelize.fn('SUM', sequelize.col('Payments.nominal')), 'totaldonation'],
                        // [sequelize.fn('COUNT', sequelize.col('Payments.id')), 'jumlahdonation'],
                    ],
                    include : [{
                        model : Student,
                        attributes : [
                            ["id", "idSiswa"],
                            ["name", "namaSiswa"],
                            "studentImage",
                            "tanggalLahir",
                            "provinsi",
                            "story",
                            "kelas",
                            "pendidikanTerakhir",
                            'nisn',
                            'kegiatanSosial',
                            'dataStatus'
                            // "biayaSekolah"
                        ],
                        include: [
                            {
                                model : school,
                                attributes : [
                                    ['nama', 'namaSekolah'],
                                    ['alamat', 'alamatSekolah'],
                                    'cabangBank',
                                    'bank',
                                    'email',
                                    ['telepon', 'teleponSekolah'],
                                    'namaPemilikRekening',
                                    'nomorRekening'

                                ]
                            }
                        ],
                        where: {
                            pendidikanTerakhir: {
                                [Op.in] : pendidikanTerakhir
                            }, 
                            provinsi: {
                                [Op.in] : provinsiMurid
                            },
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
                            [Op.like] : `%${name}%`,
                        },
                        // isDeleted : 0,
                    },
                    // order: [['id', `${date}`], ['createdAt', `${date}`]],
                    order: [['id', 'DESC']],
                    group : ['id']
                     
                })

                .then((results) => {
                    console.log(results)
                    return res.status(200).send({results})
                }).catch((err)=>{
                    return res.status(500).send({message: err})
                })
    },

    getScholarshipDetailByAdmin: (req, res) => {
        const { idSiswa } = req.body
        scholarship.findAll({
            subQuery: false,
            attributes : [
                "id",
                "judul",
                "studentId",
                'currentValue',
            ],
            
            include : [
                {
                model : Student,
                attributes : [
                    ["id", "idSiswa"],
                    ['name', 'namaSiswa'],
                    'userId',
                    'status',
                    'alamat',
                    'gender',
                    'tanggalLahir',
                    'pendidikanTerakhir',
                    'studentImage',
                    'provinsi',
                    'story',
                    'biayaSekolah',
                    'kelas',
                    'shareDescription',
                    'nisn',
                    'kegiatanSosial',
                    ['createdAt', 'studentCreated']

                ],
                include: [
                    {
                        model : school,
                        attributes : [
                            ['nama', 'namaSekolah'],
                            ['alamat', 'alamatSekolah'],
                            'cabangBank',
                            'bank',
                            'email',
                            ['telepon', 'teleponSekolah'],
                            'namaPemilikRekening',
                            'nomorRekening'

                        ],
                    }
                ]
            },
            
            ],
            where : {
                studentId: idSiswa,
                
            },
            group: ['id']
             
        })

        .then((result) => {
            console.log(result)
            // console.log(result)
            return res.status(200).send(result)
        }).catch((err)=>{
            return res.status(500).send({message: err})
        })
    },

    // User
    getAvailableScholarship: (req, res) => {
        console.log('------------------------> masuk per user')
        var { offset, limit, name, date, pendidikanTerakhir, provinsiMurid} = req.body;


        console.log(req.body)
        const { userId } = req.user
        console.log(req.user)
                scholarship.findAll({
                    limit:parseInt(limit),
                    // limit : 10,
                    offset:offset,
                    subQuery: false,
                    attributes : [
                        "id",
                        "judul",
                        "totalPayout",
                        "biayaSekolah",
                        "studentId",
                        "currentValue",
                       
                        [sequelize.fn('SUM', sequelize.col('Payments.nominal')), 'totaldonation'],
                        [sequelize.fn('COUNT', sequelize.col('Payments.id')), 'jumlahdonation'],
                        
              
                    ],
                 
                    
                    include : [{
                        model : Student,
                        attributes : [
                            ["id", "idSiswa"],
                            ["name", "namaSiswa"],
                            "studentImage",
                            "tanggalLahir",
                            "provinsi",
                            "story",
                            "kelas",
                            "pendidikanTerakhir",
                            'nisn',
                            'kegiatanSosial',
                            'dataStatus'
                        ],
                        include: [
                            {
                                model : school,
                                attributes : [
                                    ['nama', 'namaSekolah'],
                                    ['alamat', 'alamatSekolah'],
                                    'cabangBank',
                                    'bank',
                                    'email',
                                    ['telepon', 'teleponSekolah'],
                                    'namaPemilikRekening',
                                    'nomorRekening'

                                ]
                            },
                        ],
                        where: {
                            pendidikanTerakhir: {
                                [Op.in] : pendidikanTerakhir
                            }, 
                            provinsi: {
                                [Op.in] : provinsiMurid
                            },
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
                            [Op.like] : `%${name}%`,
                        },
                        userId,
                        // isDeleted : 0,
                    },
                    // order: [['id', `${date}`], ['createdAt', `${date}`]],
                    order: [['currentValue', 'DESC']],
                    group : ['id']
                     
                })

                .then((results) => {
                    console.log(results)
                    return res.status(200).send({results})
                }).catch((err)=>{
                    return res.status(500).send({message: err})
                })
    },

    getScholarshipTemporaryUser: (req, res) => {
        console.log('------------------------> masuk per user')
        var { offset, limit, name, date, pendidikanTerakhir, provinsiMurid} = req.body;


        console.log(req.body)
        const { userId } = req.user
        console.log(req.user)
                scholarship.findAll({
                    limit:parseInt(limit),
                    // limit : 10,
                    offset:offset,
                    subQuery: false,
                    attributes : [
                        "id",
                        "judul",
                        "totalPayout",
                        "biayaSekolah",
                        "studentId",
                        "currentValue",
                        "isOngoing",
                       
                        [sequelize.fn('SUM', sequelize.col('Payments.nominal')), 'totaldonation'],
                        [sequelize.fn('COUNT', sequelize.col('Payments.id')), 'jumlahdonation'],
                        
              
                    ],
                    include : [{
                        model : Student,
                        attributes : [
                            ["id", "idSiswa"],
                            ["name", "namaSiswa"],
                            
                            'status',
                            'alamat',
                            'gender',
                            'tanggalLahir',
                            'pendidikanTerakhir',
                            'studentImage',
                            'provinsi',
                            'story',
                            ["biayaSekolah", "biayaSekolahPerbulan" ],
                            'kelas',
                            'shareDescription',
                            'nisn',
                            'kegiatanSosial',
                            'jumlahSaudara',
                            'schoolId'
                        ],
                        include: [
                            {
                                model : school,
                                attributes : [
                                   
                                    ['nama', 'namaSekolah'],
                                    ['alamat', 'alamatSekolah'],
                                    'cabangBank',
                                    'bank',
                                    'email',
                                    ['telepon', 'teleponSekolah'],
                                    'namaPemilikRekening',
                                    'nomorRekening'
                                ]
                            },
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
                        // judul : {
                        //     [Op.like] : `%${name}%`,
                        // },
                        userId,
                        // isDeleted : 0,
                    },
                    // order: [['id', `${date}`], ['createdAt', `${date}`]],
                    // order: [['currentValue', 'DESC']],
                    // group : ['id']
                     
                })

                .then((results) => {
                    console.log(results)
                    return res.status(200).send({results})
                }).catch((err)=>{
                    return res.status(500).send({message: err})
                })
    },

    verifikasiScholarship: (req, res) => {
        const { idSiswa, idUser } = req.body
        console.log(idSiswa)
        scholarship.update(
            {
                isOngoing : 1
            },
            {
                where : 
                    {
                     studentId : idSiswa
                    }
            }
        )
        .then((results)=>{
            Student.update(
                {
                    dataStatus : 'Verified'
                },
                {
                    where : 
                        {
                         id : idSiswa
                        }
                }
            )
            .then((results2)=>{
                

                User.findOne({
                    where: {
                        id: idUser
                    }
                })
                .then(dataUser => {
        
                    // Ketika sudah daftar kirim link verification dan create jwtToken
                    // const tokenJwt = createJWTToken({ userId: dataUser.dataValues.id, email: dataUser.dataValues.email })

                    // console.log(tokenJwt)

                        let mailOptions = {
                        from: 'KasihNusantara Admin <operational@kasihnusantara.com>',
                        to: dataUser.dataValues.email,
                        subject: 'Beasiswa berhasil di approve',
                        html: `
                                <div>
                                    <hr />
                                    <h4>Beasiswa anda berhasil di approve oleh tim kami.</h4>
                                    <p>Terima Kasih</p>
                                    <hr />
                                </div>`
                    }

                    transporter.sendMail(mailOptions, (err1, res1) => {
                        if (err1) {
                            return res.status(500).send({ status: 'error', err: err1 })
                        }

                        return res.status(200).send(dataUser)

                    })

                  
                })
                .catch((err) => {
                    return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                })


                
                
            })
            .catch((err)=>{
                console.log(err)
            })
        })
        .catch((err)=>{
            console.log(err)
        })
    }

} 