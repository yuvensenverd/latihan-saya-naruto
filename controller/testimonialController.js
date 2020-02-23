const {Sequelize, sequelize, Student, school, testimoni} = require('../models')
const Op = Sequelize.Op

module.exports = {
    getTestimonial: (req, res) => {
        testimoni.findAll({
            
                where: {
                    studentId: req.body.idSiswa
                }
            
        })
        .then((result) => {
            return res.status(200).send(result)
        })
        .catch((err) => {
            return res.status(500).send({message:'Admin Error', error:err})
        })
    },

    postTestimonial: (req, res) => {
        console.log(req.body)

        const {
            idSiswa,
            testimonialStudent
        } = req.body

        testimoni.create({
            studentId: idSiswa,
            testimoni: testimonialStudent
        })
        .then((result) => {
            return res.status(200).send(result)
        })
        .catch((err) => {
            return res.status(500).send({message:'Admin Error', error:err})
        })
    },

    guestGetTestimonialStudent: (req, res) => {
        testimoni.findAll({
            
            where: {
                studentId: req.body.idSiswa
            }
        
    })
    .then((result) => {
        return res.status(200).send(result)
    })
    .catch((err) => {
        return res.status(500).send({message:'Admin Error', error:err})
    })
    },

    getAllTestimonialGuest: (req, res) => {
        testimoni.findAll({
           
            include: [
                {
                    model: Student,
                    include: [
                        {
                            model: school,
                            attributes : [
                                ['nama', 'namaSekolah'],
                                ['provinsi', 'provinsiSekolah']
                            ]
                        }
                    ]
                },
               
            ]
        })
        .then((result) => {
            return res.status(200).send(result)
        })
        .catch((err) => {
            return res.status(500).send({message:'Admin Error', error:err})
        })
    }
}