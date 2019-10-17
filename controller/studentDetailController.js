const { Student, StudentDetail } = require('../models')
const fs = require('fs')
const { uploader } = require('../helpers/uploader')

module.exports = {
    getStudentData :  (req,res) =>{
        const { id } = req.params
        Student.findAll({where: {id}})
        .then((results) => {
            res.send(results);
        })
        .catch((err) => {
            console.log(err);
        })
    },
    addStudentData : (req,res) => {
        const {
            name, 
            pendidikanTerakhir, 
            gender, 
            status, 
            alamat, 
            tanggalLahir, 
            userId, 
            story, 
            sekolah
        } = req.body
        Student.create({
            name,
            pendidikanTerakhir,
            gender,
            status,
            alamat,
            tanggalLahir,
            studentImage: 'asd',
            isDeleted : 0,
            userId,
            story,
            sekolah
        }).then(() => {
            Student.findAll({where: {name}})
            .then((results) => {
                res.send(results);
            })
            .catch((err) => {
                console.log(err);
            })
        })
    },
    editStudentData : (req,res) => {
        try { //kalo try ada error langsung masuk ke catch
            const path = '/student/images'; //file save path
            const upload = uploader(path, 'NVM').fields([{ name: 'image'}]); //uploader(path, 'default prefix')
    
            upload(req, res, (err) => {
                if(err){
                    return res.status(500).json({ message: 'Upload picture failed !', error: err.message });
                }
    
                const { image } = req.files;
                const imagePath = image ? path + '/' + image[0].filename : null;
                const data = JSON.parse(req.body.data);
                data.imgPath = imagePath;
                const { id } = req.params
                console.log(data)
                const {
                    name, 
                    pendidikanTerakhir, 
                    gender, 
                    status, 
                    alamat, 
                    tanggalLahir, 
                    story, 
                    sekolah
                } = data
                Student.update({ 
                    name, 
                    pendidikanTerakhir, 
                    gender, 
                    status, 
                    alamat, 
                    tanggalLahir, 
                    studentImage: imagePath,
                    story, 
                    sekolah
                },{ where: { id } })
                .then(() => {
                    Student.findAll({ where: { id } })
                    .then((results) => {
                        res.send(results);
                    })
                })
                
            })
        } catch(err) {
            return res.status(500);
        }
    },
    getStudentDetail : (req,res) => {
        const { id } = req.params
            StudentDetail.findAll({
                where: {
                    studentId: id
                },
                include: [
                    {
                        model: Student,
                        require: true,
                        attributes: ['name']
                    }
                ],
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            })
            .then((results) => {
                res.send(results);
            })
            .catch((err) => {
                console.log(err);
            })
    },
    addStudentDetail : (req,res) => {
        try { //kalo try ada error langsung masuk ke catch
            const path = '/student/images'; //file save path
            const upload = uploader(path, 'RPT').fields([{ name: 'image'}]); //uploader(path, 'default prefix')
    
            upload(req, res, (err) => {
                if(err){
                    return res.status(500);
                }
                const { image } = req.files;
                const imagePath = image ? path + '/' + image[0].filename : null;
                const data = JSON.parse(req.body.data);
                data.imgPath = imagePath;
                const {
                    deskripsi, 
                    studentId, 
                } = data
                StudentDetail.create({
                    pictureReport: imagePath,
                    deskripsi,
                    studentId
                })
                .then(() => {
                    StudentDetail.findAll({where: {studentId}})
                    .then((results) => {
                        res.send(results);
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                })
            })
        } catch(err) {
            return res.status(500);
        }
    },
    deleteStudentDetail : (req,res) => {
        var { id, studentId } = req.body
        StudentDetail.findAll({ where: {id} })
        .then((results) =>{
            var oldImgPath = results[0].dataValues.pictureReport
            fs.unlinkSync('./Public' + oldImgPath)
            StudentDetail.destroy(
                {where: { id }})
            .then(() => {
                StudentDetail.findAll({where: {studentId}})
                .then((results2) => {
                    res.send(results2);
                })
            })
        }).catch((err) => {
            console.log(err)
        })   
    },
    editStudentDetail : (req,res) => {
        try { //kalo try ada error langsung masuk ke catch
            const path = '/student/images'; //file save path
            const upload = uploader(path, 'RPT').fields([{ name: 'image'}]); //uploader(path, 'default prefix')
    
            upload(req, res, (err) => {
                if(err){
                    return res.status(500);
                }
                const { image } = req.files;
                const imagePath = image ? path + '/' + image[0].filename : null;
                const data = JSON.parse(req.body.data);
                data.imgPath = imagePath;
                const {
                    id,
                    deskripsi, 
                    studentId, 
                } = data
                if(!data.imgPath){
                    return StudentDetail.update({
                        deskripsi
                    },{
                        where: { id }
                    }).then(() => {
                        StudentDetail.findAll({where: {studentId}})
                        .then((results2) => {
                            res.send(results2);
                        })
                    })
                }
                StudentDetail.findAll({where: {studentId}})
                .then((results2) => {
                    var oldImgPath = results2[0].dataValues.pictureReport
                    console.log(oldImgPath)
                    fs.unlinkSync('./Public' + oldImgPath)
                    StudentDetail.update({
                        deskripsi,
                        pictureReport: imagePath
                    }, { 
                        where: {id}
                     }).then(() => {
                        StudentDetail.findAll({where: {studentId}})
                        .then((results3) => {
                            res.send(results3);
                        })
                    })
                    
                })
            })
        } catch(err) {
            return res.status(500);
        }
        
    }
}