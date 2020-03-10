
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
        console.log('=====================================================masuk post sini dah =================================s')
        try {

            const path = '/student/images'; //file save path
            const upload = uploader(path, 'STD').fields([
                {name: 'sertifikat_image'}, 
                {name: 'student_image'}, 
                {name: 'student_card'}, 
                {name: 'raport'}, 
                {name: 'ijazah'},
                {name: 'school_image'},
                {name: 'family_card'},
                {name: 'rekom_kepala_sekolah'},
                {name: 'rekom_wali_sekolah'}
            ]);

            upload(req,res,(err)=>{
                if(err){
                    return res.status(500).json({ message: 'Upload picture failed !', error: err.message });
                }
                const {sertifikat_image, raport, ijazah, student_image,  student_card, school_image, family_card, rekom_kepala_sekolah, rekom_wali_sekolah }=req.files;
                console.log('---------------- >>>>>> image <<<<< ------------------')
                // console.log(image)

                // console.log(image)
                // console.log(image2)
                // console.log(image3)
                // console.log(raport)
                // console.log(ijazah)
                
                // let raport = [];

                // for(let i = 0; i < image.length; i = i + 1) {
                //     const imagePath = image[i] ? path + '/' + image[i].filename : 'http://localhost:2019/defaultPhoto/defaultCategory.png';
                //     raport.push(imagePath)
                // }

                // var student_imageDB = ''

                if(student_image) {
                   var student_imageDB = student_image[0] ? path + '/' + student_image[0].filename : 'http://localhost:2019/defaultPhoto/defaultCategory.png';
                }


                // console.log('====== gambar')
                // console.log(raport)


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
                    kegiatanSosial,
                    raportKeterangan,
                    ijazahKeterangan
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
                        kegiatanSosial: kegiatanSosial ? kegiatanSosial : null,

                        studentImage: student_imageDB,
                        // kartuSiswa: raport[1],
                        // raportTerakhir: raport[2],
                        // kartuKeluarga: raport[2],
                        // dataPenghasilan: raport[4],

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
                        let deskripsi = ''

                        // for(let i = 1; i < raport.length; i++) {
                            // if(i === 1) {
                            //     dokumenPath = raport[i]
                            //     keterangan = `kartu-siswa`
                            //     listImage.push({
                            //         studentId,
                            //         dokumenPath,
                            //         keterangan
                            //     })
                            // }

                            // if(i === 2) {
                            //     dokumenPath = raport[i]
                            //     keterangan = `kartu-keluarga`
                            //     listImage.push({
                            //         studentId,
                            //         dokumenPath,
                            //         keterangan
                            //     })
                            // }
                            // if(i === 1) {
                            //     dokumenPath = raport[i]
                            //     keterangan = `kartu-keluarga`
                            //     deskripsi = 'Kartu Keluarga'
                            //     listImage.push({
                            //         studentId,
                            //         dokumenPath,
                            //         keterangan, 
                            //         deskripsi
                            //     })
                            // }
                        // }

                        if(family_card) {
                            dokumenPath = path + '/' + family_card[0].filename
                            keterangan = `kartu-keluarga`
                            deskripsi = 'Kartu Keluarga'
                            listImage.push({
                                studentId,
                                dokumenPath,
                                keterangan, 
                                deskripsi
                            })
                        }

                        if(pendidikanTerakhir !== 'UNIVERSITAS') {
                            if(rekom_kepala_sekolah) {
                                dokumenPath = path + '/' + rekom_kepala_sekolah[0].filename
                                keterangan = 'rekom-kepala-sekolah'
                                deskripsi = 'Surat Rekomendasi Kepala Sekolah'
                                listImage.push({
                                    studentId,
                                    dokumenPath,
                                    keterangan, 
                                    deskripsi
                                })
                            }

                            if(rekom_wali_sekolah) {
                                dokumenPath = path + '/' + rekom_wali_sekolah[0].filename
                                keterangan = 'rekom-wali-guru'
                                deskripsi = 'Surat Rekomendasi Wali Guru'
                                listImage.push({
                                    studentId,
                                    dokumenPath,
                                    keterangan, 
                                    deskripsi
                                })
                            }
                        } else {
                            if(rekom_kepala_sekolah) {
                                dokumenPath = path + '/' + rekom_kepala_sekolah[0].filename
                                keterangan = 'rekom-kepala-fakultas'
                                deskripsi = 'Surat Rekomendasi Kepala Fakultas'
                                listImage.push({
                                    studentId,
                                    dokumenPath,
                                    keterangan, 
                                    deskripsi
                                })
                            }

                            if(rekom_wali_sekolah) {
                                dokumenPath = path + '/' + rekom_wali_sekolah[0].filename
                                keterangan = 'rekom-kepala-jurusan'
                                deskripsi = 'Surat Rekomendasi Kepala Jurusan'
                                listImage.push({
                                    studentId,
                                    dokumenPath,
                                    keterangan, 
                                    deskripsi
                                })
                            }
                        }



                        if(raport) {
                            if(pendidikanTerakhir !== 'UNIVERSITAS') {

                                for(let i = 0; i < raport.length; i++) {
                                    dokumenPath = path + '/' + raport[i].filename
                                    keterangan = `raport`
                                    deskripsi = raportKeterangan[i]
                                    listImage.push({
                                        studentId,
                                        dokumenPath,
                                        keterangan,
                                        deskripsi
                                    })
                                }

                            } else {

                                for(let i = 0; i < raport.length; i++) {
                                    dokumenPath = path + '/' + raport[i].filename
                                    keterangan = `dokumen-ipk`
                                    deskripsi = raportKeterangan[i]
                                    listImage.push({
                                        studentId,
                                        dokumenPath,
                                        keterangan,
                                        deskripsi
                                    })
                                }

                            }
                        }

                        // let jenjang_pendidikan = [
                        //     'SD',
                        //     'SMP',
                        //     'SMA / SMK',
                        // ]

                        // let sma_smk = [
                            
                        // ]

                        if(ijazah) {
                            for(let i = 0; i < ijazah.length; i++) {
                                dokumenPath = path + '/' + ijazah[i].filename
                                keterangan = `ijazah`
                                deskripsi =  ijazahKeterangan[i]
                                listImage.push({
                                    studentId,
                                    dokumenPath,
                                    keterangan,
                                    deskripsi
                                })
                            }
                        }

                        

                        // if(pendidikanTerakhir !== 'UNIVERSITAS') {
                        //     for(let i=0; i < image2.length; i++) {
                        //         dokumenPath = path + '/' + image2[i].filename
                        //         let keterangan = ''
                        //         if(i === 0) {
                        //             keterangan = 'rekom-kepala-sekolah'
                        //             deskripsi = 'Surat Rekomendasi Kepala Sekolah'
                        //             listImage.push({
                        //                 studentId,
                        //                 dokumenPath,
                        //                 keterangan,
                        //                 deskripsi
                        //             })
                        //         }
                                
                        //         if(i === 1) {
                        //             keterangan = 'rekom-wali-guru'
                        //             deskripsi = 'Surat Rekomendasi Wali Guru'
                        //             listImage.push({
                        //                 studentId,
                        //                 dokumenPath,
                        //                 keterangan,
                        //                 deskripsi
                        //             })
                        //         }
    
                        //         // if(i === 2) {
                        //         //     keterangan = 'rekom-guru1-sekolah'
                        //         //     listImage.push({
                        //         //         studentId,
                        //         //         dokumenPath,
                        //         //         keterangan
                        //         //     })
                        //         // }
    
                        //         // if(i === 3) {
                        //         //     keterangan = 'rekom-guru2-sekolah'
                        //         //     listImage.push({
                        //         //         studentId,
                        //         //         dokumenPath,
                        //         //         keterangan
                        //         //     })
                        //         // }
    
                        //         if(pendidikanTerakhir === 'SMA' || pendidikanTerakhir === 'SMK' || pendidikanTerakhir === 'UNIVERSITAS') {
                        //             // if(i === 4) {
                        //             //     keterangan = 'kegiatan-sosial-siswa'
                        //             //     listImage.push({
                        //             //         studentId,
                        //             //         dokumenPath,
                        //             //         keterangan
                        //             //     })
                        //             // }
                        //         }
                        //     }

                        // } else {
                            
                        //     // Untuk UNIVERSITAS

                        //     for(let i=0; i < image2.length; i++) {
                        //         dokumenPath = path + '/' + image2[i].filename
                        //         let keterangan = ''
                        //         if(i === 0) {
                        //             keterangan = 'rekom-kepala-fakultas'
                        //             deskripsi = 'Surat Rekomendasi Kepala Fakultas'
                        //             listImage.push({
                        //                 studentId,
                        //                 dokumenPath,
                        //                 keterangan,
                        //                 deskripsi
                        //             })
                        //         }
                                
                        //         if(i === 1) {
                        //             keterangan = 'rekom-kepala-jurusan'
                        //             deskripsi = 'Surat Rekomendasi Kepala Jurusan'
                        //             listImage.push({
                        //                 studentId,
                        //                 dokumenPath,
                        //                 keterangan,
                        //                 deskripsi
                        //             })
                        //         }
    
                        //         if(pendidikanTerakhir === 'SMA' || pendidikanTerakhir === 'SMK' || pendidikanTerakhir === 'UNIVERSITAS') {
                                  
                        //         }
                        //     }
                        // }


                        if(sertifikat_image) {
                            for(let i=0; i < sertifikat_image.length; i++){
                                dokumenPath = path + '/' + sertifikat_image[i].filename
                                keterangan = 'sertifikat'
                                deskripsi = 'Sertifikat'
                                listImage.push({
                                    studentId,
                                    dokumenPath,
                                    keterangan,
                                    deskripsi
                                })
                            }
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
                                return res.status(200).send(results)
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
                        for(let i = 0; i < raport.length; i = i + 1) {
                            
                            fs.unlinkSync('./public' + raport[i]);
                        }
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message })
                    })
                }).then((result)=>{
                    console.log('success upload')
                    return res.status(200).send(result)
                    // return res.status(200).send(result)
                }).catch((err)=>{
                    console.log(err.message)
                    for(let i = 0; i < raport.length; i = i + 1) {
                            
                        fs.unlinkSync('./public' + raport[i]);
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

    postTemporaryStudentData: (req, res) => {
        console.log('=====================================================masuk post sini dah =================================s')
        try {

            const path = '/student/images'; //file save path
            const upload = uploader(path, 'STD').fields([
                {name: 'sertifikat_image'}, 
                {name: 'student_image'}, 
                {name: 'student_card'}, 
                {name: 'raport'}, 
                {name: 'ijazah'},
                {name: 'school_image'},
                {name: 'family_card'},
                {name: 'rekom_kepala_sekolah'},
                {name: 'rekom_wali_sekolah'}
            ]);

            upload(req,res,(err)=>{
                if(err){
                    return res.status(500).json({ message: 'Upload picture failed !', error: err.message });
                }
                const {sertifikat_image, raport, ijazah, student_image,  student_card, school_image, family_card, rekom_kepala_sekolah, rekom_wali_sekolah }=req.files;
                console.log('---------------- >>>>>> image <<<<< ------------------')
                // console.log(image)

                // console.log(image)
                // console.log(image2)
                // console.log(image3)
                // console.log(raport)
                // console.log(ijazah)
                
                // let raport = [];

                // if(image) {
                //     for(let i = 0; i < image.length; i = i + 1) {
                //         const imagePath = image[i] ? path + '/' + image[i].filename : 'http://localhost:2019/defaultPhoto/defaultCategory.png';
                //         raport.push(imagePath)
                //     }
                // }

                // var student_imageDB = ''

                if(student_image) {
                   var student_imageDB = student_image[0] ? path + '/' + student_image[0].filename : 'http://localhost:2019/defaultPhoto/defaultCategory.png';
                } else {
                    var student_imageDB = null
                }


                // console.log('====== gambar')
                // console.log(raport)


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
                    kegiatanSosial,
                    raportKeterangan,
                    ijazahKeterangan
                } = data

                console.log(name)

                // console.log(data)
                
                    Student.create({
                        name: name,
                        pendidikanTerakhir: pendidikanTerakhir !== '' ? pendidikanTerakhir : null,
                        gender: gender !== '' ? gender : null,
                        status: status !== '' ? status : null,
                        provinsi: provinsi !== 'Pilih Provinsi' ? provinsi : null,
                        alamat: alamat !== '' ? alamat : null,
                        tanggalLahir: tanggalLahir !== '' ? Moment(tanggalLahir) : null,
                        userId: req.user.userId,
                        shareDescription: shareDescription !== '' ? shareDescription : null,
                        schoolId: schoolId ? schoolId : null,
                        jumlahSaudara: jumlahSaudara !== '' ? jumlahSaudara : null,
                        biayaSekolah: biayaSekolah !== '' ? biayaSekolah : null,
                        kelas: kelas !== 'Pilih Kelas' ? kelas : null,
                        story: story !== '' ? story : null,
                        nisn: nisn !== '' ? nisn : null,
                        kegiatanSosial: kegiatanSosial ? kegiatanSosial : null,

                        studentImage: student_imageDB,
                        // kartuSiswa: raport[1],
                        // raportTerakhir: raport[2],
                        // kartuKeluarga: raport[2],
                        // dataPenghasilan: raport[4],

                        isDeleted: 0,
                        dataStatus : 'Not Completed',
                        // dataStatus : 'Verified',
                        statusNote: ''
                    })
                    .then( async (result)=>{
                        console.log('ini id student ========================================')
                        console.log(result.dataValues.id)
                        let listImage = [];
                        let studentId = result.dataValues.id
                        let dokumenPath = ''
                        let deskripsi = ''

                        // if(raport) {
                        //     for(let i = 1; i < raport.length; i++) {
                                // if(i === 1) {
                                //     dokumenPath = raport[i]
                                //     keterangan = `kartu-siswa`
                                //     listImage.push({
                                //         studentId,
                                //         dokumenPath,
                                //         keterangan
                                //     })
                                // }
    
                                // if(i === 2) {
                                //     dokumenPath = raport[i]
                                //     keterangan = `kartu-keluarga`
                                //     listImage.push({
                                //         studentId,
                                //         dokumenPath,
                                //         keterangan
                                //     })
                                // }
                        //         if(i === 1) {
                        //             dokumenPath = raport[i]
                        //             keterangan = `kartu-keluarga`
                        //             deskripsi = 'Kartu Keluarga'
                        //             listImage.push({
                        //                 studentId,
                        //                 dokumenPath,
                        //                 keterangan, 
                        //                 deskripsi
                        //             })
                        //         }
                        //     }
                        // }

                        if(family_card) {
                            dokumenPath = path + '/' + family_card[0].filename
                            keterangan = `kartu-keluarga`
                            deskripsi = 'Kartu Keluarga'
                            listImage.push({
                                studentId,
                                dokumenPath,
                                keterangan, 
                                deskripsi
                            })
                        }

                        if(pendidikanTerakhir !== 'UNIVERSITAS') {
                            if(rekom_kepala_sekolah) {
                                dokumenPath = path + '/' + rekom_kepala_sekolah[0].filename
                                keterangan = 'rekom-kepala-sekolah'
                                deskripsi = 'Surat Rekomendasi Kepala Sekolah'
                                listImage.push({
                                    studentId,
                                    dokumenPath,
                                    keterangan, 
                                    deskripsi
                                })
                            }

                            if(rekom_wali_sekolah) {
                                dokumenPath = path + '/' + rekom_wali_sekolah[0].filename
                                keterangan = 'rekom-wali-guru'
                                deskripsi = 'Surat Rekomendasi Wali Guru'
                                listImage.push({
                                    studentId,
                                    dokumenPath,
                                    keterangan, 
                                    deskripsi
                                })
                            }
                        } else {
                            if(rekom_kepala_sekolah) {
                                dokumenPath = path + '/' + rekom_kepala_sekolah[0].filename
                                keterangan = 'rekom-kepala-fakultas'
                                deskripsi = 'Surat Rekomendasi Kepala Fakultas'
                                listImage.push({
                                    studentId,
                                    dokumenPath,
                                    keterangan, 
                                    deskripsi
                                })
                            }

                            if(rekom_wali_sekolah) {
                                dokumenPath = path + '/' + rekom_wali_sekolah[0].filename
                                keterangan = 'rekom-kepala-jurusan'
                                deskripsi = 'Surat Rekomendasi Kepala Jurusan'
                                listImage.push({
                                    studentId,
                                    dokumenPath,
                                    keterangan, 
                                    deskripsi
                                })
                            }
                        }

                        if(raport) {
                            if(pendidikanTerakhir !== 'UNIVERSITAS') {

                                for(let i = 0; i < raport.length; i++) {
                                    dokumenPath = path + '/' + raport[i].filename
                                    keterangan = `raport`
                                    deskripsi = raportKeterangan[i]
                                    listImage.push({
                                        studentId,
                                        dokumenPath,
                                        keterangan,
                                        deskripsi
                                    })
                                }

                            } else {

                                for(let i = 0; i < raport.length; i++) {
                                    dokumenPath = path + '/' + raport[i].filename
                                    keterangan = `dokumen-ipk`
                                    deskripsi = raportKeterangan[i]
                                    listImage.push({
                                        studentId,
                                        dokumenPath,
                                        keterangan,
                                        deskripsi
                                    })
                                }

                            }
                        }

                        // let jenjang_pendidikan = [
                        //     'SD',
                        //     'SMP',
                        //     'SMA / SMK',
                        // ]

                        // let sma_smk = [
                            
                        // ]

                        // if(ijazah) {
                        //     for(let i = 0; i < ijazah.length; i++) {
                        //         dokumenPath = path + '/' + ijazah[i].filename
                        //         keterangan = `ijazah`
                        //         deskripsi =  ijazahKeterangan[i]
                        //         listImage.push({
                        //             studentId,
                        //             dokumenPath,
                        //             keterangan,
                        //             deskripsi
                        //         })
                        //     }
                        // }

                        

                        // if(image2) {
                        //     if(pendidikanTerakhir !== 'UNIVERSITAS') {
                        //         for(let i=0; i < image2.length; i++) {
                        //             dokumenPath = path + '/' + image2[i].filename
                        //             let keterangan = ''
                        //             if(i === 0) {
                        //                 keterangan = 'rekom-kepala-sekolah'
                        //                 deskripsi = 'Surat Rekomendasi Kepala Sekolah'
                        //                 listImage.push({
                        //                     studentId,
                        //                     dokumenPath,
                        //                     keterangan,
                        //                     deskripsi
                        //                 })
                        //             }
                                    
                        //             if(i === 1) {
                        //                 keterangan = 'rekom-wali-guru'
                        //                 deskripsi = 'Surat Rekomendasi Wali Guru'
                        //                 listImage.push({
                        //                     studentId,
                        //                     dokumenPath,
                        //                     keterangan,
                        //                     deskripsi
                        //                 })
                        //             }
        
                        //             // if(i === 2) {
                        //             //     keterangan = 'rekom-guru1-sekolah'
                        //             //     listImage.push({
                        //             //         studentId,
                        //             //         dokumenPath,
                        //             //         keterangan
                        //             //     })
                        //             // }
        
                        //             // if(i === 3) {
                        //             //     keterangan = 'rekom-guru2-sekolah'
                        //             //     listImage.push({
                        //             //         studentId,
                        //             //         dokumenPath,
                        //             //         keterangan
                        //             //     })
                        //             // }
        
                        //             if(pendidikanTerakhir === 'SMA' || pendidikanTerakhir === 'SMK' || pendidikanTerakhir === 'UNIVERSITAS') {
                        //                 // if(i === 4) {
                        //                 //     keterangan = 'kegiatan-sosial-siswa'
                        //                 //     listImage.push({
                        //                 //         studentId,
                        //                 //         dokumenPath,
                        //                 //         keterangan
                        //                 //     })
                        //                 // }
                        //             }
                        //         }
    
                        //     } else {
                                
                        //         // Untuk UNIVERSITAS
    
                        //         for(let i=0; i < image2.length; i++) {
                        //             dokumenPath = path + '/' + image2[i].filename
                        //             let keterangan = ''
                        //             if(i === 0) {
                        //                 keterangan = 'rekom-kepala-fakultas'
                        //                 deskripsi = 'Surat Rekomendasi Kepala Fakultas'
                        //                 listImage.push({
                        //                     studentId,
                        //                     dokumenPath,
                        //                     keterangan,
                        //                     deskripsi
                        //                 })
                        //             }
                                    
                        //             if(i === 1) {
                        //                 keterangan = 'rekom-kepala-jurusan'
                        //                 deskripsi = 'Surat Rekomendasi Kepala Jurusan'
                        //                 listImage.push({
                        //                     studentId,
                        //                     dokumenPath,
                        //                     keterangan,
                        //                     deskripsi
                        //                 })
                        //             }
        
                        //             if(pendidikanTerakhir === 'SMA' || pendidikanTerakhir === 'SMK' || pendidikanTerakhir === 'UNIVERSITAS') {
                                      
                        //             }
                        //         }
                        //     }
                        // }


                        if(sertifikat_image) {
                            for(let i=0; i < sertifikat_image.length; i++){
                                dokumenPath = path + '/' + sertifikat_image[i].filename
                                keterangan = 'sertifikat'
                                deskripsi = 'Sertifikat'
                                listImage.push({
                                    studentId,
                                    dokumenPath,
                                    keterangan,
                                    deskripsi
                                })
                            }
                        }

                        if(family_card || rekom_kepala_sekolah || rekom_wali_sekolah || raport || ijazah || sertifikat_image) {
                            dokumen_siswa.bulkCreate(listImage)
                            .then((hasilBulkCreate) => {

                                scholarship.create({
                                    judul : scholarshipTitle !== '' ? scholarshipTitle : '',
                                    studentId : result.dataValues.id,
                                    userId: req.user.userId,
                                    biayaSekolah : biayaSekolah !== '' ? biayaSekolah * 12 : 0,
                                    currentValue : 0,
                                    totalPayout : 0,
                                    // isVerified : 3,
                                    isOngoing : 3
                                    // isOngoing : 1
                                }).then( async (results)=>{
                                    let resultsDataSiswa_temp = await Student.findAll({
                                        where: {
                                            id: studentId
                                        }
                                    })
                                    
                                    return res.status(200).send(resultsDataSiswa_temp)

                                    // return res.status(200).send(results)
                                }).catch((err)=>{
                                    console.log(err)
                                    throw new Error()
                                })

                            })
                            .catch((err) => {
                                console.log(err)
                                if(raport) {
                                    for(let i = 0; i < raport.length; i = i + 1) {
                            
                                        fs.unlinkSync('./public' + raport[i]);
                                    }
                                }
                                throw new Error()
                            })

                        } else {
                            scholarship.create({
                                judul : scholarshipTitle,
                                studentId : result.dataValues.id,
                                userId: req.user.userId,
                                biayaSekolah : biayaSekolah * 12,
                                currentValue : 0,
                                totalPayout : 0,
                                // isVerified : 3,
                                isOngoing : 3
                                // isOngoing : 1
                            }).then(async (results)=>{

                                let resultsDataSiswa_temp = await Student.findAll({
                                    where: {
                                        id: studentId
                                    }
                                })
                                
                                return res.status(200).send(resultsDataSiswa_temp)

                                // return res.status(200).send(results)
                            }).catch((err)=>{
                                console.log(err)
                                throw new Error()
                            })
                        }

                        

                       

                        // console.log('=-----------------------------------------------------------asd-asdasdas')

                        // console.log(resultsDataSiswa_temp)

                       
                        
                        
                    }).catch((err)=>{
                        console.log(err.message)
                        for(let i = 0; i < raport.length; i = i + 1) {
                            
                            fs.unlinkSync('./public' + raport[i]);
                        }
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message })
                    })
                })

            // console.log(req.body)
            
            
        } catch (error) {
            console.log(error.message)
         
            // fs.unlinkSync('./public' + imagePath);
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: error.message });
        }
    },
    
    updateTemporaryStudentData: (req, res) => {
        console.log('=====================================================masuk updateTemporaryStudentData sini dah =================================s')
        try {

            const path = '/student/images'; //file save path
            const upload = uploader(path, 'STD').fields([
                {name: 'sertifikat_image'}, 
                {name: 'student_image'}, 
                {name: 'student_card'}, 
                {name: 'raport'}, 
                {name: 'ijazah'},
                {name: 'school_image'},
                {name: 'family_card'},
                {name: 'rekom_kepala_sekolah'},
                {name: 'rekom_wali_sekolah'}
            ]);

            upload(req,res,(err)=>{
                if(err){
                    return res.status(500).json({ message: 'Upload picture failed !', error: err.message });
                }
                const {sertifikat_image, raport, ijazah, student_image,  student_card, school_image, family_card, rekom_kepala_sekolah, rekom_wali_sekolah }=req.files;
                console.log('---------------- >>>>>> image <<<<< ------------------')
                // console.log(image)

                // console.log(image)
                // console.log(image2)
                // console.log(image3)
                // console.log(raport)
                // console.log(ijazah)
                
                // let raport = [];

                // if(image) {
                //     for(let i = 0; i < image.length; i = i + 1) {
                //         const imagePath = image[i] ? path + '/' + image[i].filename : 'http://localhost:2019/defaultPhoto/defaultCategory.png';
                //         raport.push(imagePath)
                //     }
                // }

                // console.log('====== gambar')
                // console.log(raport)

                if(student_image) {
                    var student_imageDB = student_image[0] ? path + '/' + student_image[0].filename : 'http://localhost:2019/defaultPhoto/defaultCategory.png';
                 } else {
                    var student_imageDB = null
                 }


                const data = JSON.parse(req.body.data);
                console.log('Data siswa ================')
                console.log(data)

                const {
                    userId,
                    idSiswa, 
                    idScholarship,
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
                    kegiatanSosial,
                    raportKeterangan,
                    ijazahKeterangan
                } = data

                console.log(data)

                console.log(name)

                console.log(schoolId)
                
                    Student.update({
                        name: name,
                        pendidikanTerakhir: pendidikanTerakhir !== '' ? pendidikanTerakhir : null,
                        gender: gender !== '' ? gender : null,
                        status: status !== '' ? status : null,
                        provinsi: provinsi !== 'Pilih Provinsi' ? provinsi : null,
                        alamat: alamat !== '' ? alamat : null,
                        tanggalLahir: tanggalLahir !== '' ? Moment(tanggalLahir) : null,
                        userId: req.user.userId,
                        shareDescription: shareDescription !== '' ? shareDescription : null,
                        schoolId,
                        jumlahSaudara: jumlahSaudara !== '' ? jumlahSaudara : null,
                        biayaSekolah: biayaSekolah !== '' ? biayaSekolah : null,
                        kelas: kelas !== 'Pilih Kelas' ? kelas : null,
                        story: story !== '' ? story : null,
                        nisn: nisn !== '' ? nisn : null,
                        kegiatanSosial: kegiatanSosial ? kegiatanSosial : null,

                        studentImage: student_imageDB,
                        // kartuSiswa: raport[1],
                        // raportTerakhir: raport[2],
                        // kartuKeluarga: raport[2],
                        // dataPenghasilan: raport[4],

                        // isDeleted: 0,
                        // dataStatus : 'Unverified',
                        // dataStatus : 'Verified',
                        statusNote: ''
                    },{
                        where: {
                            id: idSiswa
                        }
                    })
                    .then( async (result)=>{
                        console.log('ini id student ========================================')
                        // console.log(result.dataValues.id)
                        let listImage = [];
                        let studentId = idSiswa
                        let dokumenPath = ''
                        let deskripsi = ''

                        // if(raport) {
                        //     for(let i = 1; i < raport.length; i++) {
                                // if(i === 1) {
                                //     dokumenPath = raport[i]
                                //     keterangan = `kartu-siswa`
                                //     listImage.push({
                                //         studentId,
                                //         dokumenPath,
                                //         keterangan
                                //     })
                                // }
    
                                // if(i === 2) {
                                //     dokumenPath = raport[i]
                                //     keterangan = `kartu-keluarga`
                                //     listImage.push({
                                //         studentId,
                                //         dokumenPath,
                                //         keterangan
                                //     })
                                // }
                        //         if(i === 1) {
                        //             dokumenPath = raport[i]
                        //             keterangan = `kartu-keluarga`
                        //             deskripsi = 'Kartu Keluarga'
                        //             listImage.push({
                        //                 studentId,
                        //                 dokumenPath,
                        //                 keterangan, 
                        //                 deskripsi
                        //             })
                        //         }
                        //     }
                        // }

                        if(family_card) {
                            dokumenPath = path + '/' + family_card[0].filename
                            keterangan = `kartu-keluarga`
                            deskripsi = 'Kartu Keluarga'
                            listImage.push({
                                studentId,
                                dokumenPath,
                                keterangan, 
                                deskripsi
                            })
                        }

                        if(pendidikanTerakhir !== 'UNIVERSITAS') {
                            if(rekom_kepala_sekolah) {
                                dokumenPath = path + '/' + rekom_kepala_sekolah[0].filename
                                keterangan = 'rekom-kepala-sekolah'
                                deskripsi = 'Surat Rekomendasi Kepala Sekolah'
                                listImage.push({
                                    studentId,
                                    dokumenPath,
                                    keterangan, 
                                    deskripsi
                                })
                            }

                            if(rekom_wali_sekolah) {
                                dokumenPath = path + '/' + rekom_wali_sekolah[0].filename
                                keterangan = 'rekom-wali-guru'
                                deskripsi = 'Surat Rekomendasi Wali Guru'
                                listImage.push({
                                    studentId,
                                    dokumenPath,
                                    keterangan, 
                                    deskripsi
                                })
                            }
                        } else {
                            if(rekom_kepala_sekolah) {
                                dokumenPath = path + '/' + rekom_kepala_sekolah[0].filename
                                keterangan = 'rekom-kepala-fakultas'
                                deskripsi = 'Surat Rekomendasi Kepala Fakultas'
                                listImage.push({
                                    studentId,
                                    dokumenPath,
                                    keterangan, 
                                    deskripsi
                                })
                            }

                            if(rekom_wali_sekolah) {
                                dokumenPath = path + '/' + rekom_wali_sekolah[0].filename
                                keterangan = 'rekom-kepala-jurusan'
                                deskripsi = 'Surat Rekomendasi Kepala Jurusan'
                                listImage.push({
                                    studentId,
                                    dokumenPath,
                                    keterangan, 
                                    deskripsi
                                })
                            }
                        }

                        if(raport) {
                            if(pendidikanTerakhir !== 'UNIVERSITAS') {

                                for(let i = 0; i < raport.length; i++) {
                                    dokumenPath = path + '/' + raport[i].filename
                                    keterangan = `raport`
                                    deskripsi = raportKeterangan[i]
                                    listImage.push({
                                        studentId,
                                        dokumenPath,
                                        keterangan,
                                        deskripsi,
                                        orders: raportKeterangan[i].split(' ')[2]
                                    })
                                }

                            } else {

                                for(let i = 0; i < raport.length; i++) {
                                    dokumenPath = path + '/' + raport[i].filename
                                    keterangan = `dokumen-ipk`
                                    deskripsi = raportKeterangan[i]
                                    listImage.push({
                                        studentId,
                                        dokumenPath,
                                        keterangan,
                                        deskripsi,
                                        orders: raportKeterangan[i].split(' ')[2]
                                    })
                                }

                            }
                        }

                        // let jenjang_pendidikan = [
                        //     'SD',
                        //     'SMP',
                        //     'SMA / SMK',
                        // ]

                        // let sma_smk = [
                            
                        // ]

                        if(ijazah) {
                            if(pendidikanTerakhir !== 'UNIVERSITAS') {
                                for(let i = 0; i < ijazah.length; i++) {
                                    let orders = 0
                                    dokumenPath = path + '/' + ijazah[i].filename
                                    keterangan = `ijazah`
                                    deskripsi =  ijazahKeterangan[i]

                                    if(ijazahKeterangan[i].split(' ')[1] === 'SD') {
                                        orders = 1
                                    }

                                    if(ijazahKeterangan[i].split(' ')[1] === 'SMP') {
                                        orders = 2
                                    }

                                    if(ijazahKeterangan[i].split(' ')[1] === 'SMA') {
                                        orders = 3
                                    }

                                    listImage.push({
                                        studentId,
                                        dokumenPath,
                                        keterangan,
                                        deskripsi,
                                        orders
                                    })
                                }
                            } else {

                                for(let i = 0; i < ijazah.length; i++) {
                                    let orders = 0
                                    dokumenPath = path + '/' + ijazah[i].filename
                                    keterangan = `ijazah`
                                    deskripsi =  ijazahKeterangan[i]

                                    if(ijazahKeterangan[i].split(' ')[1] === 'SD') {
                                        orders = 1
                                    }

                                    if(ijazahKeterangan[i].split(' ')[1] === 'SMP') {
                                        orders = 2
                                    }

                                    if(ijazahKeterangan[i].split(' ')[1] === 'SMA/SMK') {
                                        orders = 3
                                    }

                                    listImage.push({
                                        studentId,
                                        dokumenPath,
                                        keterangan,
                                        deskripsi,
                                        orders
                                    })
                                }
                                
                            }
                        }

                        

                        // if(image2) {
                        //     if(pendidikanTerakhir !== 'UNIVERSITAS') {
                        //         for(let i=0; i < image2.length; i++) {
                        //             dokumenPath = path + '/' + image2[i].filename
                        //             let keterangan = ''
                        //             if(i === 0) {
                        //                 keterangan = 'rekom-kepala-sekolah'
                        //                 deskripsi = 'Surat Rekomendasi Kepala Sekolah'
                        //                 listImage.push({
                        //                     studentId,
                        //                     dokumenPath,
                        //                     keterangan,
                        //                     deskripsi
                        //                 })
                        //             }
                                    
                        //             if(i === 1) {
                        //                 keterangan = 'rekom-wali-guru'
                        //                 deskripsi = 'Surat Rekomendasi Wali Guru'
                        //                 listImage.push({
                        //                     studentId,
                        //                     dokumenPath,
                        //                     keterangan,
                        //                     deskripsi
                        //                 })
                        //             }
        
                        //             // if(i === 2) {
                        //             //     keterangan = 'rekom-guru1-sekolah'
                        //             //     listImage.push({
                        //             //         studentId,
                        //             //         dokumenPath,
                        //             //         keterangan
                        //             //     })
                        //             // }
        
                        //             // if(i === 3) {
                        //             //     keterangan = 'rekom-guru2-sekolah'
                        //             //     listImage.push({
                        //             //         studentId,
                        //             //         dokumenPath,
                        //             //         keterangan
                        //             //     })
                        //             // }
        
                        //             if(pendidikanTerakhir === 'SMA' || pendidikanTerakhir === 'SMK' || pendidikanTerakhir === 'UNIVERSITAS') {
                        //                 // if(i === 4) {
                        //                 //     keterangan = 'kegiatan-sosial-siswa'
                        //                 //     listImage.push({
                        //                 //         studentId,
                        //                 //         dokumenPath,
                        //                 //         keterangan
                        //                 //     })
                        //                 // }
                        //             }
                        //         }
    
                        //     } else {
                                
                        //         // Untuk UNIVERSITAS
    
                        //         for(let i=0; i < image2.length; i++) {
                        //             dokumenPath = path + '/' + image2[i].filename
                        //             let keterangan = ''
                        //             if(i === 0) {
                        //                 keterangan = 'rekom-kepala-fakultas'
                        //                 deskripsi = 'Surat Rekomendasi Kepala Fakultas'
                        //                 listImage.push({
                        //                     studentId,
                        //                     dokumenPath,
                        //                     keterangan,
                        //                     deskripsi
                        //                 })
                        //             }
                                    
                        //             if(i === 1) {
                        //                 keterangan = 'rekom-kepala-jurusan'
                        //                 deskripsi = 'Surat Rekomendasi Kepala Jurusan'
                        //                 listImage.push({
                        //                     studentId,
                        //                     dokumenPath,
                        //                     keterangan,
                        //                     deskripsi
                        //                 })
                        //             }
        
                        //             if(pendidikanTerakhir === 'SMA' || pendidikanTerakhir === 'SMK' || pendidikanTerakhir === 'UNIVERSITAS') {
                                      
                        //             }
                        //         }
                        //     }
                        // }


                        if(sertifikat_image) {
                            for(let i=0; i < sertifikat_image.length; i++){
                                dokumenPath = path + '/' + sertifikat_image[i].filename
                                keterangan = 'sertifikat'
                                deskripsi = 'Sertifikat'
                                listImage.push({
                                    studentId,
                                    dokumenPath,
                                    keterangan,
                                    deskripsi
                                })
                            }
                        }

                        if(family_card || rekom_kepala_sekolah || rekom_wali_sekolah || raport || ijazah || sertifikat_image) {
                            dokumen_siswa.bulkCreate(listImage)
                            .then((hasilBulkCreate) => {

                                scholarship.update({
                                    judul : scholarshipTitle !== '' ? scholarshipTitle : '',
                                    studentId : studentId,
                                    userId: req.user.userId,
                                    biayaSekolah : biayaSekolah !== '' ? biayaSekolah * 12 : 0,
                                    // currentValue : 0,
                                    // totalPayout : 0,
                                    // isVerified : 3,
                                    // isOngoing : 3
                                    // isOngoing : 1
                                }, {
                                    where: {
                                        id: idScholarship
                                    }
                                }).then( async (results)=>{
                                    let resultsDataSiswa_temp = await Student.findAll({
                                        where: {
                                            id: idSiswa
                                        }
                                    })
            
                        //            
                        return res.status(200).send(resultsDataSiswa_temp)
                        

                                    // return res.status(200).send(results)
                                }).catch((err)=>{
                                    console.log(err)
                                    throw new Error()
                                })

                            })
                            .catch((err) => {
                                console.log(err)
                                if(raport) {
                                    for(let i = 0; i < raport.length; i = i + 1) {
                            
                                        fs.unlinkSync('./public' + raport[i]);
                                    }
                                }
                                throw new Error()
                            })

                        } else {
                            scholarship.update({
                                judul : scholarshipTitle,
                                studentId : idSiswa,
                                userId: req.user.userId,
                                biayaSekolah : biayaSekolah * 12,
                                // currentValue : 0,
                                // totalPayout : 0,
                                // isVerified : 3,
                                // isOngoing : 3
                                // isOngoing : 1
                            },  {
                                where: {
                                    id: idScholarship
                                }
                            }).then(async (results)=>{
                                let resultsDataSiswa_temp = await Student.findAll({
                                    where: {
                                        id: idSiswa
                                    }
                                })
        
                               

                    return res.status(200).send(resultsDataSiswa_temp)

                                // return res.status(200).send(results)
                            }).catch((err)=>{
                                console.log(err)
                                throw new Error()
                            })
                        }
                        
                    }).catch((err)=>{
                        console.log(err.message)
                        for(let i = 0; i < raport.length; i = i + 1) {
                            
                            fs.unlinkSync('./public' + raport[i]);
                        }
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message })
                    })
                })

            // console.log(req.body)
            
            
        } catch (error) {
            console.log(error.message)
         
            // fs.unlinkSync('./public' + imagePath);
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: error.message });
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
            // attributes: [
            //     'id',
            //     'name',
            //     'pendidikanTerakhir',
            // ],
            attributes:{
                exclude:['createdAt','updatedAt']
            },
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
    },

    editDataStudentAndScholarship: (req, res) => {
        console.log(req.body.data)

        const {
            name,
            // pendidikanTerakhir:  pendidikan,
            gender,
            status,
            alamat,
            tanggalLahir,
            story,
            scholarshipTitle,
            provinsi,
            shareDescription,
            // schoolId,
            // jumlahSaudara : saudara,
            biayaSekolah,
            // kelas :  kelas,
            nisn,
        } = req.body.data

        Student.update({
            name:name,
            gender:gender,
            status,
            provinsi,
            alamat,
            tanggalLahir:Moment(tanggalLahir),
            shareDescription,
            biayaSekolah,
            story,
            nisn,
            // pendidikanTerakhir:pendidikanTerakhir,
            // userId: req.user.userId,
            // schoolId,
            // jumlahSaudara,
            // kelas,
            // kegiatanSosial: kegiatanSosial ? kegiatanSosial : null,

            // studentImage: raport[0],
            // kartuSiswa: raport[1],
            // raportTerakhir: raport[2],
            // kartuKeluarga: raport[2],
            // dataPenghasilan: raport[4],

            isDeleted: 0,
            dataStatus : 'Unverified',
            // dataStatus : 'Verified',
            statusNote: ''
        }, {
            where: {
                userId: req.user.userId
            }
        })
        .then((resultEditStudent) => {
            scholarship.update({

                judul : scholarshipTitle,
                biayaSekolah : biayaSekolah * 12,
                isOngoing : 0
                // studentId : result.dataValues.id,
                // userId,
                // currentValue : 0,
                // totalPayout : 0,
                // isVerified : 0,
            },{
                where : {
                    userId: req.user.userId  
                }
            })
            .then((editScholarship) => {
                return res.status(200).send(editScholarship)
            })
            .catch((err) => {
                console.log(err)
            })
        })

    },

    getStudentDataTempPerUser : (req, res) => {
        console.log('masuk sini')
        // const {userId} = req.body
        // console.log(req.query)
        Student.findAll({
            // attributes: [
            //     'id',
            //     'name',
            //     'pendidikanTerakhir',
            // ],
            attributes:{
                exclude:['createdAt','updatedAt']
            },
            where : {
                userId: req.user.userId,
                // isDeleted: 0,
                // dataStatus: 'Approved'
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

    updateDataStudentOngoing: (req, res) => {
        const { idSiswa } = req.body
        scholarship.update({
            isOngoing: '0',
            
        }, {
            where: {
                studentId: idSiswa
            }
        })
        .then((results) => {
           Student.update({
               dataStatus: 'Unverified'
           }, {
               where : {
                   id: idSiswa
               }
           })
           .then((results2) => {
               return res.status(200).send(results2)
           })
        })
        .catch((err) => {
            return res.status(500).send({err})
        })
    },
    verifikasi: (req, res) => {
        console.log('=============================== masuk verifikasi =================')
        console.log(req.body)
        // Student.update({
        //     dataStatus: 'Verified'
        // }, where: {
        //     id
        // })
    }
}
