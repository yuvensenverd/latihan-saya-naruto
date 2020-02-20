
const { Sequelize, sequelize,  Student, School, scholarship, dokumen_siswa} = require('../models')
const Moment=require('moment')
const Op = Sequelize.Op
const {uploader}=require('../helpers/uploader')
const fs=require('fs')
module.exports={
    // getStudentdata(req,res){
    //     Student.findAll({
    //         attributes:{
    //             exclude:['createdAt','updatedAt']
    //         },
    //         where:{
    //             isDeleted:0
    //         }
    //     })
    //     .then((result)=>{
    //         return res.status(200).send(result)
    //     }).catch((err)=>{
    //         res.status(500).send({message:'error post', error:err})
    //     })
    // },
    postStudentdata(req,res){
        try {

            const path = '/student/images'; //file save path
            const upload = uploader(path, 'STD').fields([{ name: 'image'}, {name: 'image2'}, {name: 'image3'}, {name: 'raport'}, {name: 'ijazah'}]);

            upload(req,res,(err)=>{
                if(err){
                    return res.status(500).json({ message: 'Upload picture failed !', error: err.message });
                }
                const {image, image2, image3, raport, ijazah }=req.files;
                console.log('---------------- >>>>>> image <<<<< ------------------')
                // console.log(image)

                console.log(image)
                console.log(image2)
                console.log(image3)
                console.log(raport)
                console.log(ijazah)
                
                let listGambar = [];

                for(let i = 0; i < image.length; i = i + 1) {
                    const imagePath = image[i] ? path + '/' + image[i].filename : 'http://localhost:2019/defaultPhoto/defaultCategory.png';
                    listGambar.push(imagePath)
                }

                console.log('====== gambar')
                console.log(listGambar)


                const data = JSON.parse(req.body.data);
                console.log('Data siswa ================')
                console.log(data)

                const {
                    userId,
                    name,
                    pendidikanTerakhir,
                    gender,
                    status,
                    alamat,
                    tanggalLahir,
                    story,
                    shareDescription,
                    scholarshipTitle,
                    schoolId,
                    jumlahSaudara,
                    biayaSekolah,
                    kelas,
                    provinsi,
                    nisn, 
                    kegiatanSosial
                } = data

                console.log(name)
                return sequelize.transaction(function (t){
                    return Student.create({
                        name:name,
                        pendidikanTerakhir:pendidikanTerakhir,
                        gender:gender,
                        status,
                        provinsi,
                        alamat,
                        tanggalLahir:Moment(tanggalLahir),
                        userId: req.user.userId,
                        shareDescription,
                        schoolId,
                        jumlahSaudara,
                        biayaSekolah,
                        kelas,
                        story,
                        nisn,
                        kegiatanSosial,

                        studentImage: listGambar[0],
                        // kartuSiswa: listGambar[1],
                        // raportTerakhir: listGambar[2],
                        // kartuKeluarga: listGambar[2],
                        // dataPenghasilan: listGambar[4],

                        isDeleted: 0,
                        dataStatus : 'Unverified',
                        // dataStatus : 'Verified',
                        statusNote: ''
                    },{transaction:t})
                    .then((result)=>{
                        console.log('ini id student ========================================')
                        console.log(result.dataValues.id)
                        let listImage = [];
                        let studentId = result.dataValues.id
                        let dokumenPath = ''

                        for(let i = 1; i < listGambar.length; i++) {
                            // if(i === 1) {
                            //     dokumenPath = listGambar[i]
                            //     keterangan = `kartu-siswa`
                            //     listImage.push({
                            //         studentId,
                            //         dokumenPath,
                            //         keterangan
                            //     })
                            // }

                            // if(i === 2) {
                            //     dokumenPath = listGambar[i]
                            //     keterangan = `kartu-keluarga`
                            //     listImage.push({
                            //         studentId,
                            //         dokumenPath,
                            //         keterangan
                            //     })
                            // }
                            if(i === 1) {
                                dokumenPath = listGambar[i]
                                keterangan = `kartu-keluarga`
                                listImage.push({
                                    studentId,
                                    dokumenPath,
                                    keterangan
                                })
                            }
                        }

                        if(raport) {
                            for(let i = 0; i < raport.length; i++) {
                                dokumenPath = path + '/' + raport[i].filename
                                keterangan = `raport`
                                listImage.push({
                                    studentId,
                                    dokumenPath,
                                    keterangan
                                })
                            }
                        }

                        let jenjang_pendidikan = [
                            'SD',
                            'SMP',
                            'SMA',
                            'SMK',
                        ]

                        if(ijazah) {
                            for(let i = 0; i < ijazah.length; i++) {
                                    dokumenPath = path + '/' + ijazah[i].filename
                                    keterangan = `ijazah`
                                    listImage.push({
                                        studentId,
                                        dokumenPath,
                                        keterangan
                                    })
                                
                            }
                        }

                        

                        for(let i=0; i < image2.length; i++){
                            dokumenPath = path + '/' + image2[i].filename
                            let keterangan = ''
                            if(i === 0) {
                                keterangan = 'rekom-kepala-sekolah'
                                listImage.push({
                                    studentId,
                                    dokumenPath,
                                    keterangan
                                })
                            }
                            
                            if(i === 1) {
                                keterangan = 'rekom-wali-guru'
                                listImage.push({
                                    studentId,
                                    dokumenPath,
                                    keterangan
                                })
                            }

                            // if(i === 2) {
                            //     keterangan = 'rekom-guru1-sekolah'
                            //     listImage.push({
                            //         studentId,
                            //         dokumenPath,
                            //         keterangan
                            //     })
                            // }

                            // if(i === 3) {
                            //     keterangan = 'rekom-guru2-sekolah'
                            //     listImage.push({
                            //         studentId,
                            //         dokumenPath,
                            //         keterangan
                            //     })
                            // }

                            if(pendidikanTerakhir === 'SMA' || pendidikanTerakhir === 'SMK' || pendidikanTerakhir === 'KULIAH') {
                                // if(i === 4) {
                                //     keterangan = 'kegiatan-sosial-siswa'
                                //     listImage.push({
                                //         studentId,
                                //         dokumenPath,
                                //         keterangan
                                //     })
                                // }
                            }
                        }

                        for(let i=0; i < image3.length; i++){
                            dokumenPath = path + '/' + image3[i].filename
                            let keterangan = 'sertifikat'
                            listImage.push({
                                studentId,
                                dokumenPath,
                                keterangan
                            })
                        }

                        dokumen_siswa.bulkCreate(listImage)
                        .then((hasilBulkCreate) => {

                            scholarship.create({
                                judul : scholarshipTitle,
                                studentId : result.dataValues.id,
                                userId,
                                biayaSekolah : biayaSekolah * 12,
                                currentValue : 0,
                                totalPayout : 0,
                                // isVerified : 0,
                                isOngoing : 0
                                // isOngoing : 1
                            }).then((results)=>{
                                // return res.status(200).send(results)
                            }).catch((err)=>{
                                console.log(err)
                                throw new Error()
                            })

                        })
                        .catch((err) => {
                            console.log(err)
                            throw new Error()
                        })
                        
                        
                    }).catch((err)=>{
                        console.log(err.message)
                        for(let i = 0; i < listGambar.length; i = i + 1) {
                            
                            fs.unlinkSync('./public' + listGambar[i]);
                        }
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message })
                    })
                }).then((result)=>{
                    console.log('success upload')
                    return res.status(200).send(result)
                    // return res.status(200).send(result)
                }).catch((err)=>{
                    console.log(err.message)
                    for(let i = 0; i < listGambar.length; i = i + 1) {
                            
                        fs.unlinkSync('./public' + listGambar[i]);
                    }
                    throw new Error()
                    // fs.unlinkSync('./public' + imagePath);
                    // return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message })
                })
            })

            // console.log(req.body)
            
            
        } catch (error) {
            console.log(err.message)
         
            // fs.unlinkSync('./public' + imagePath);
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        }
    },
    putStudentdata(req,res){
        console.log('Ubahhhh')
        console.log(req.params.id)
        const {id}=req.params
        console.log(id)
        Student.findAll(
            {
                where:{
                    id:id
                }
            }
        )
        .then((result)=>{
            if(result.length>0){
                console.log(result[0].studentImage)
                const path = '/student/images'; //file save path
                const upload = uploader(path, 'STD').fields([{ name: 'image'}]);
                upload(req,res,(err)=>{
                    if(err){
                        return res.status(500).json({ message: 'Upload picture failed !', error: err.message });
                    }
                    const { image } = req.files;
                    // console.log(image)
                    const imagePath = image ? path + '/' + image[0].filename : null;
                    const data = JSON.parse(req.body.data);
                    console.log(imagePath)
                    try {
                        if(imagePath) {
                            data.studentImage = imagePath;
                        }
                        if(data.tanggalLahir){
                            data.tanggalLahir=Moment(data.tanggalLahir)
                        }
                        // const {name,pendidikanTerakhir,gender,status,alamat,tanggalLahir,userId,story,sekolah,studentImage}=data
                        Student.update(data,{
                            where:{
                                id:id
                            }
                        }).then((result2)=>{
                            if(imagePath) {
                                console.log('masuk')
                                fs.unlinkSync('./public' + result[0].studentImage);
                            }
                            // Student.findAll(
                            //     {
                            //         attributes:{
                            //             exclude:['createdAt','updatedAt']
                            //         },
                            //         where:{
                            //             isDeleted:0
                            //         }
                            
                            //     }
                            // )
                            // .then((result1)=>{
                            //     console.log('berhasil')
                            return res.status(200).send(result2)
                            // }).catch((err)=>{
                            //     return res.status(500).send({message:'error post', error:err})
                            // })
                            // return res.status(200).send(result1)
                        }).catch((err)=>{
                            if(imagePath) {
                                fs.unlinkSync('./public' + imagePath);
                            }
                            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err1.message });
                        })
                    } catch (error) {
                        console.log(err.message)
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                    }
                })
            }
        }).catch((err)=>{
            throw err;
        })
    },
    deleteStudentdata(req,res){
        const {id}=req.params
        Student.update({
            isDeleted:1
        },{
            where:{
                id:id
            }
        }).then((result)=>{
          
            return res.status(200).send(result)
          
        }).catch((err)=>{
            return res.status(500).send({message:'error post', error:err})
        })
    },
    getStudentdatapaging(req,res){ // DUPLIKAT FUNCTION INI UNTUK HOME ( TAPI GA ADA FILTERING BERDASARKAN ID )
        console.log('masukdatapaging')
        console.log(req.body)
        console.log(req.user)

        var { page, limit, name, orderby } = req.body;
        // var listpendidikan = ['SMA', 'SMK', 'S1', 'SD', 'SMP', 'TK']
   
        var offset = ( page * limit ) - limit
        // console.log()
        console.log(offset)

        Student.findAndCountAll({
            // limit:parseInt(limit),
            // offset:offset,
            // order:[['id','asc']],
            limit:parseInt(limit),
            // limit : 10,
            offset:offset,
            subQuery: false,
            attributes:{
                exclude:['createdAt','updatedAt']
            },
            where : {
                name : {
                    [Op.like] : `%${name}%`
                },
                userId: req.user.userId,
                isDeleted : 0
            },
            order: [['id', `${orderby}`]],
            // where:{
            //     isDeleted:0,
            //     // pendidikanTerakhir : {
            //     //     [Op.in] : pendidikan ? pendidikan : listpendidikan
            //     // },
            //     userId : req.user.userId
            //     // [School.nama] : `%${sekolah ? sekolah : ''}%`
            // }
        })
        .then((result)=>{
            // console.log('======> hasilnya')
            console.log(result)
            return res.status(200).send(result)
        }).catch((err)=>{
            return res.status(500).send({message:'error post', error:err})
        })
    },
    getStudentPerUser : (req, res) => {
        console.log('masuk sini')
        // const {userId} = req.body
        // console.log(req.query)
        Student.findAll({
            attributes: [
                'id',
                'name',
                'pendidikanTerakhir',
            ],
            where : {
                userId: req.query.id,
                isDeleted: 0,
                dataStatus: 'Approved'
            }
        })
        .then((result) => {
            console.log(result)
            return res.status(200).send(result)
        }).catch((err)=>{
            console.log(err)
            return res.status(500).send({err})
        })
    },

    getStudentAdmin : (req,res) =>{
        // var { page, limit, sekolah,  pendidikan} = req.body;
        // var listpendidikan = ['SMA', 'SMK', 'S1', 'SD', 'SMP', 'TK']
   
        // var offset=(page*limit)-limit
        
        console.log('-----------================ masuk ')
        Student.findAndCountAll({
            // limit:parseInt(limit),
            // offset:offset,
            // order:[['id','asc']],
            attributes:{
                include : [
                    [sequelize.col('scholarship.judul'), 'judulScholarship'],
                    [sequelize.col('scholarship.id'), 'idScholarship'],
                    // [sequelize.col('scholarship.id'), 'idScholarship']
                ],
                exclude:['createdAt','updatedAt']
            },
            // include : [
            //     {
            //         model : School,
            //         required : true,
            //         attributes : [['nama', 'schoolName']],
            //         where : {
            //             nama : {
            //                 [Op.like] : `%%`,
            //                 // [Op.like] : `%${sekolah ? sekolah : ''}%`
            //             },
                  
            //         },
               
            //     },
            //     {
            //         model : scholarship,
            //         required : false,
            //         attributes : []
            //     }
            // ],
            where : {
                // userId: req.user.userId,
                isDeleted : 0
            }
            // where:{
            //     isDeleted:0,
            //     // pendidikanTerakhir : {
            //     //     [Op.in] : pendidikan ? pendidikan : listpendidikan
            //     // },
            //     userId : req.user.userId
            //     // [School.nama] : `%${sekolah ? sekolah : ''}%`
            // }
        })
        .then((result)=>{
            console.log('======> hasilnya')
            console.log(result)
            return res.status(200).send(result)
        }).catch((err)=>{
            return res.status(500).send({message:'error post', error:err})
        })
    },

    getStudentDetails: (req, res) => {
        const { id } = req.params
        console.log('masuk detail')
        console.log(id)
            Student.findAll({
                where: {
                    id: id,
                },
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },
                include:[
                    {
                        model: scholarship,
                        attributes: ['biayaSekolah', 'judul']
                    }
                ]
            })
            .then((results) => {
                console.log(results[0])
                return res.status(200).send(results);
            })
            .catch((err) => {
                console.log(err);
            })
    }
}
