const { Sequelize, sequelize, StudentRevision, School, Student, scholarship } = require('../models')
const Op = Sequelize.Op
const Moment=require('moment')
const {uploader} = require('../helpers/uploader')
const fs = require('fs')

module.exports = {
    adminGetStudent : (req,res)=>{
        console.log('--------==========------- > masuesk')
        var value = ''

        if(req.query.type === 'new'){
            value = 'Unverified'
        }else if(req.query.type === 'update'){
            value = 'Update Unverified'
        }

        Student.findAll({
            attributes:{
                exclude:['createdAt','updatedAt']
            },
            where:{
                isDeleted:0,
                dataStatus : value
            },
            // include : [
            //     {
            //         model : School,
            //         attributes: 
            //            [ 'bank', ['alamat','alamatSekolah'], 'namaPemilikRekening', 'nomorRekening', 'telepon', ['nama', 'schoolName']]
            //     }
            // ]
        })
        .then((result)=>{
            return res.status(200).send(result)
        }).catch((err)=>{
            res.status(500).send({message:'error post', error:err})
        })
    },
    updateApprove : (req,res) =>{
        // body : {
        //     revid : 2,
        //     studentid : 1,

        // }
        console.log('updateee approve')
        console.log(req.body)
        return sequelize.transaction(function (t){
            return StudentRevision.update({
                isDeleted : 1
            }, {
                where : {
                    id : req.body.revid,
                    isDeleted : 0
                }
            },{ transaction : t })
            .then((result)=>{
                Student.update({
                    dataStatus : 'Approved'
                },{
                    where : {
                        id : req.body.studentid,
                    }
                }, {transaction : t})
                .then((result2)=>{
                    console.log('success update verified')
                  
                })
            })
        })
        .then((resultt)=>{
       
            return res.status(200).send({message : 'success update'})
        })
        .catch((errtrans)=>{
            return res.status(500).send({ message : 'admin error', error : errtrans.message})
        })
    },
    updateReject : (req,res)=>{
        // body : {
        //     revid : 2,
        //     studentid : 1,
        //     message : 'asdjaisdja'
        // }
        console.log('update reject')
        return sequelize.transaction(function (t){
            return StudentRevision.update({
                isDeleted : 1
            }, {
                where : {
                    id : req.body.revid,
                    isDeleted : 0
                }
            },{ transaction : t })
            .then((result)=>{
                Student.update({
                    dataStatus : 'Rejected',
                    statusNote : req.body.message
                },{
                    where : {
                        id : req.body.studentid
                    }
                }, {transaction : t})
                .then((result2)=>{
                    console.log('success update verified')
                  
                })
            })
        })
        .then((resultt)=>{
       
            return res.status(200).send({message : 'success update'})
        })
        .catch((errtrans)=>{
            return res.status(500).send({ message : 'admin error', error : errtrans.message})
        })
    },
    getStudentRevisions : async (req,res) =>{
        console.log('find revision')
        try {

            var result = await StudentRevision.findAll({
                attributes : {
                    exclude : ['createdAt', 'updatedAt']
                },
                where :{
                    studentId : req.params.id,
                    isDeleted : 0
                },
                include : [
                    {
                        model : School,
                        attributes: 
                           [ ['nama', 'schoolName']]
                    }
                ]
            })
            return res.status(200).send({ message : 'success get revision', result})
        }
        catch(err){
            return res.status(500).send({ message : 'error admin', err : err.message})
        }
    },

   
    postStudentRevision : (req,res) =>{
        const path = '/student/images'; //file save path
        const upload = uploader(path, 'STD').fields([{ name: 'image'}]); //uploader(path, 'default prefix')

        upload(req, res, (err) => {
            if(err){
                console.log("Masuk")
                return res.status(500).json({ message: 'Upload picture failed !', error: err.message });
            }

            const { image } = req.files;
            console.log(image)
            const imagePath = image ? path + '/' + image[0].filename : null;
            console.log(imagePath)
      

            const data = JSON.parse(req.body.data);
         
  
            // need revision, udah bener ga kalau ga ganti gambar datanya masih ttp ada di studentrev
            console.log('---------changeimage---------------')
            console.log(data.result[1].changeImage)
            if(data.result[1].changeImage){
                data.result[1].studentImage = imagePath
            }else{
                data.result[1].studentImage = data.result[0].studentImage
            }
            console.log(data.result[0].studentImage)
            console.log(data.result[1].studentImage)
       
            // if(data.changeImage){
            //     fs.unlinkSync('./public' + data.oldimg);
            // }
           
            const {name,pendidikanTerakhir,gender,status,alamat,tanggalLahir,userId,story,schoolId,studentImage,studentId, dataStatus, provinsi}=data.result[0]
            console.log(name)
            return sequelize.transaction(function (t){
                return StudentRevision.create({
                    name:name,
                    pendidikanTerakhir:pendidikanTerakhir,
                    gender:gender,
                    status,
                    alamat,
                    provinsi,
                    tanggalLahir:Moment(tanggalLahir),
                    userId,
                    story,
                    schoolId,
                    studentImage,
                    studentId
                },{transaction:t})
                .then((result)=>{
                    console.log('insert student transaction success')
                    
                    const {pendidikanTerakhir, story, alamat, status, schoolId, id, studentImage} = data.result[1]
                    return Student.update({
                        pendidikanTerakhir,
                        story,
                        alamat,
                        status,
                        schoolId,
                        studentImage,
                        dataStatus : dataStatus === 'Register Rejected' ? 'Unverified' : 'Update Unverified'
                    }, {
                        where : {
                            id : id
                        }
                    }, {transaction : t}).then((result2)=>{
                        console.log('berhasuil')

                        // return res.status(200).send({message : 'success'})
                    }).catch((err)=>{
                        console.log('err1')
                        throw new Error();
                        // return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message })
                    })
            
                }).catch((err)=>{
                    console.log('err2')
                    throw new Error();
                    // return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message })
                })
            }).then((result)=>{
                console.log('masukmasuk,asuk')
                return res.status(200).send(result)
            }).catch((err)=>{
                console.log(err.message)
                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message })
            })

        })
    },
    newStudentApprove : (req,res) =>{
        console.log('student approve')
        Student.update({
            dataStatus : 'Approved'
        }, {
            where : {
                id : req.params.id
            }
        })
        .then((result) => {
            return res.status(200).send({message : 'oke', result})
        })
        .catch((err)=>{
            console.log('asd')
            return res.status(500).send({message : err})
        })
    },
    newStudentReject : (req,res) =>{
        console.log('student reject')
        Student.update({
            dataStatus : 'Register Rejected',
            statusNote : `${req.body.text}`
        }, {
            where : {
                id : req.params.id
            }
        })
        .then((result) => {
            return res.status(200).send({message : 'oke', result})
        })
        .catch((err)=>{
            console.log('asd')
            return res.status(500).send({message : err})
        })
    },
    studentRejectRevert : async (req,res) =>{
        console.log('revert changes')

        try { 
            var result = await StudentRevision.findOne({
                attributes : {
                    exclude : ['createdAt, updatedAt']
                },
                where : {
                    studentId : req.params.id,
                    
                },
                order : [['createdAt', 'desc']]  // data terbaru
               
            })
            console.log(result.dataValues)
            var olddata = result.dataValues
    
            await Student.update({
                name : olddata.name,
                pendidikanTerakhir : olddata.pendidikanTerakhir,
                gender : olddata.gender,
                status : olddata.status,
                alamat : olddata.alamat,
                tanggalLahir : olddata.tanggalLahir,
                studentImage : olddata.studentImage,
                isDeleted : 0,
                story : olddata.story,
                schoolId : olddata.schoolId,
                dataStatus : 'Approved',
                statusNote : ''
            },{
                where : {
                    id : req.params.id
                }
            })
    
            console.log('berhasil update')
            res.status(200).send({message : 'Success Revert'})
        }
        catch(err){
            res.status(200).send({message : err})
        }
            
    },

    // ============================== NEW =================================

    editDataStudent : async (req, res) => {
        console.log('----------------------<<<< edit >>>>----------------------')
        console.log(req.body)
        const oldData = await  Student.findOne({
            where : {
                id : req.params.id
            },
            include: [
                {
                    model: scholarship,
                    attributes: ['biayaSekolah']
                }
            ]
        })
        const PARSE_OLD_DATA = JSON.parse(JSON.stringify(oldData));
        console.log('--------------------------> OLD DATA <---------------------')
        console.log(PARSE_OLD_DATA)
        if(PARSE_OLD_DATA){
            console.log('-----masuk----')
            return sequelize.transaction(t => {
                    return StudentRevision.create({
                        name: PARSE_OLD_DATA.name,
                        pendidikanTerakhir: PARSE_OLD_DATA.pendidikanTerakhir,
                        gender: PARSE_OLD_DATA.gender,
                        status: PARSE_OLD_DATA.status,
                        alamat: PARSE_OLD_DATA.alamat,
                        tanggalLahir: PARSE_OLD_DATA.tanggalLahir,
                        studentImage: PARSE_OLD_DATA.studentImage,
                        provinsi: PARSE_OLD_DATA.provinsi,
                        userId: PARSE_OLD_DATA.userId,
                        story: PARSE_OLD_DATA.story,
                        shareDescription: PARSE_OLD_DATA.shareDescription,
                        nomorRekening: PARSE_OLD_DATA.nomorRekening,
                        pemilikRekening: PARSE_OLD_DATA.pemilikRekening,
                        alamatSekolah: PARSE_OLD_DATA.alamatSekolah,
                        bank: PARSE_OLD_DATA.bank,
                        cabangBank: PARSE_OLD_DATA.cabangBank,
                        teleponSekolah: PARSE_OLD_DATA.teleponSekolah,
                        namaSekolah: PARSE_OLD_DATA.namaSekolah,
                        kartuSiswa: PARSE_OLD_DATA.kartuSiswa,
                        raportTerakhir: PARSE_OLD_DATA.raportTerakhir,
                        kartuKeluarga: PARSE_OLD_DATA.kartuKeluarga,
                        jumlahSaudara: PARSE_OLD_DATA.jumlahSaudara,
                        biayaSekolah: PARSE_OLD_DATA.scholarship.biayaSekolah,
                        kelas: PARSE_OLD_DATA.kelas,
                        dataPenghasilan: PARSE_OLD_DATA.dataPenghasilan,
                        studentId: PARSE_OLD_DATA.id,
                    },{
                        transaction: t
                    }) //close student revision create
                    .then((result) => {
                        console.log('=======> sukses backup ')
                        console.log(result)
                        const path = '/student/images';
                        const upload = uploader(path, 'STD').fields([{ name: 'image'}]);
                        upload(req, res,(err) => {
                            if(err){
                                return res.status(500).json({ message: 'Upload picture failed'})
                            }
                            const { image } = req.files;
                            console.log('------------------------------------image <<<<<<<<<<<')
                            // console.log(req)
                            let listgambar = [];
                            console.log(image)
                            
                            for(let i = 0; i < 5; i= i+ 1){
                                if(image){
                                    const imagePath = image[i] ? path + '/' + image[i].filename : null;
                                    listgambar.push(imagePath)
                                }else{
                                    listgambar.push('')
                                }
                            }
                            console.log(listgambar)
    
                            const NEWDATA = JSON.parse(req.body.data)
                            console.log('>>>>>>>>>>>>>>> new data <<<<<<<<<<<<<')
                            console.log(NEWDATA)
                            console.log(NEWDATA.tanggalLahir)
                            console.log(Moment(NEWDATA.tanggalLahir))
                            Student.update({
                                name: NEWDATA.name,
                                pendidikanTerakhir: NEWDATA.pendidikanTerakhir,
                                gender: NEWDATA.gender,
                                status: NEWDATA.status,
                                provinsi: NEWDATA.provinsi,
                                alamat: NEWDATA.alamat,
                                tanggalLahir: NEWDATA.tanggalLahir,
                                userId: NEWDATA.userId,
                                story: NEWDATA.story,
                                shareDescription: NEWDATA.shareDescription,
                                nomorRekening: NEWDATA.nomorRekening,
                                pemilikRekening: NEWDATA.pemilikRekening,
                                alamatSekolah: NEWDATA.alamatSekolah,
                                bank: NEWDATA.bank,
                                cabangBank: NEWDATA.cabangBank,
                                teleponSekolah: NEWDATA.teleponSekolah,
                                namaSekolah: NEWDATA.namaSekolah,
                                kelas: NEWDATA.kelas,
                                jumlahSaudara: NEWDATA.jumlahSaudara,
                                studentImage: listgambar[0] ? listgambar[0] : PARSE_OLD_DATA.studentImage,
                                kartuSiswa: listgambar[1] ? listgambar[1] : PARSE_OLD_DATA.kartuSiswa,
                                raportTerakhir: listgambar[2] ? listgambar[2] : PARSE_OLD_DATA.raportTerakhir,
                                kartuKeluarga: listgambar[3] ? listgambar[3] : PARSE_OLD_DATA.kartuKeluarga,
                                dataPenghasilan: listgambar[4] ? listgambar[4] : PARSE_OLD_DATA.dataPenghasilan,
                                statusNote: 'Unverified'
                            },{
                                where : {
                                    id: req.params.id
                                }
                            },{ 
                                transaction : t 
                            })
                            .then(result2 => {
                                console.log('--------------------- update success --------')
                                console.log(result2)
                                // scholarship.update({
                                //     biayaSekolah: NEWDATA.biayaSekolah * 12,
                                // },{
                                //     where: {
                                //         id: result2.dataValues.id
                                //     }
                                // },{
                                //     transaction : t
                                // })
                                // .then((resScholarhip) => {
                                //     console.log('-------success res scholarship =======')
                                //     console.log(resScholarhip)
                                // })
                                // .catch(err => { throw err})
                            })
                            .catch((err) => {
                                console.log('error-------------------')
                                for(let i = 0; i < listGambar.length; i = i + 1) {
                                
                                    fs.unlinkSync('./public' + listGambar[i]);
                                }
                                console.log(err)
                                // throw err
                            })
                        })//close upload
                    })
                    .catch(err => { console.log(err)})
            })//close transaction
            .then((results)=>{
                console.log(results)
                res.send(results)
            })
            .catch((err)=>{
                for(let i = 0; i < listGambar.length; i = i + 1) {
                                
                    fs.unlinkSync('./public' + listGambar[i]);
                }
                console.log(err)
            }) 
        } // end If
    }//close endpoint
}