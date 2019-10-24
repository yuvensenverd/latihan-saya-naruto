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
        try {
            console.log('upload')
            const path = '/student/images'; //file save path
            const upload = uploader(path, 'STD').fields([{ name: 'image'}]);
            upload(req,res,(err)=>{
                if(err){
                    return res.status(500).json({ message: 'Upload picture failed !', error: err.message });
                }
                const {image}=req.files;
                console.log(image)
                const imagePath = image ? path + '/' + image[0].filename : null;
                console.log(imagePath)
                const data = JSON.parse(req.body.data);
                console.log(data)
                data.studentImage=imagePath
                // data.tanggalLahir=Moment(data.tanggalLahir)
                const {name,pendidikanTerakhir,gender,status,alamat,tanggalLahir,userId,story,schoolId,studentImage}=data
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
                        return result
                    }).catch((err)=>{
                        console.log(err.message)
                        fs.unlinkSync('./public' + imagePath);
                        return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message })
                    })
                }).then((result)=>{
                    // console.log('success upload')
                    // StudentRevision.findAll({
                    //     attributes:{
                    //         exclude:['createdAt','updatedAt']
                    //     },
                    //     where:{
                    //         isDeleted:0
                    //     }
                    // })
                    // .then((result1)=>{
                    //     return res.status(200).send(result1)
                    // }).catch((err)=>{
                    //     res.status(500).send({message:'error post', error:err})
                    // })
                    return res.status(200).send(result)
                }).catch((err)=>{
                    console.log(err.message)
                    fs.unlinkSync('./public' + imagePath);
                    return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message })
                })
            })
            
        } catch (error) {
            console.log(err.message)
            fs.unlinkSync('./public' + imagePath);
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        }
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