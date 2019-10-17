const { Student, StudentDetail } = require('../models')
const fs = require('fs')
const { uploader } = require('../Support/uploader')

module.exports = {
    getStudentDetail : (req,res) => {
        const { id } = req.params
            Student.findAll({
                where: {
                    id: id,
                },
                include: [
                    {
                        model: StudentDetail,
                        require: true,
                        // attributes: ['name']
                        // separate:true,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }
                    }
                ],
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            })
            .then((results) => {
                console.log(results);
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
                console.log(data)
                StudentDetail.create({
                    pictureReport: imagePath,
                    deskripsi,
                    studentId
                })
                .then(() => {
                    StudentDetail.findAll({where: {studentId}})
                    .then((results) => {
                        console.log(results);
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
            StudentDetail.update(
                {pictureReport: null},
                {where: { id }})
            .then(() => {
                StudentDetail.findAll({where: {studentId}})
                .then((results2) => {
                    console.log(results2);
                    res.send(results2);
                })
            })
        }).catch((err) => {
            console.log(err)
        })   
    },
    editStudentDetail : (req,res) => {
        StudentDetail.update({})
    }
}