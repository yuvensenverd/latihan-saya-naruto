const { Sequelize, sequelize, StudentRevision, School, Student } = require('../models')
const Op = Sequelize.Op
const Moment=require('moment')
const {uploader} = require('../helpers/uploader')
const fs = require('fs')

module.exports = {
    adminGetStudent : (req,res)=>{
        Student.findAll({
            attributes:{
                exclude:['createdAt','updatedAt']
            },
            where:{
                isDeleted:0,
                dataStatus : 'Unverified'
            },
            include : [
                {
                    model : School,
                    attributes: 
                       [ 'bank', 'alamat', 'namaPemilikRekening', 'nomorRekening', 'telepon', ['nama', 'schoolName']]
                    
                }
            ]
        })
        .then((result)=>{
            console.log(result[0])
            return res.status(200).send(result)
        }).catch((err)=>{
            res.status(500).send({message:'error post', error:err})
        })
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
      
            console.log(req.body.data)
            const data = JSON.parse(req.body.data);
            console.log(data)
            data.result[1].studentImage = imagePath
       
            // if(data.changeImage){
            //     fs.unlinkSync('./public' + data.oldimg);
            // }
           
            const {name,pendidikanTerakhir,gender,status,alamat,tanggalLahir,userId,story,schoolId,studentImage}=data.result[0]
            console.log(name)
            return sequelize.transaction(function (t){
                return StudentRevision.create({
                    name:name,
                    pendidikanTerakhir:pendidikanTerakhir,
                    gender:gender,
                    status,
                    alamat,
                    tanggalLahir:Moment(tanggalLahir),
                    userId,
                    story,
                    schoolId,
                    studentImage
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
                        dataStatus : 'Update Unverified'
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
            dataStatus : 'Rejected',
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
    }
}