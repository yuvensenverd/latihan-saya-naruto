const {Sequelize, sequelize, dokumen_siswa} = require('../models')
const Op = Sequelize.Op

module.exports = {
    getDokumenByType: (req, res) => {
        const { studentId, keterangan} = req.body
        
        dokumen_siswa.findAll({
            attributes : [
                'dokumenPath',
                'keterangan',
                'deskripsi'
            ],
            where: {
                studentId,
                keterangan
            }
        })
        .then((results) => {
            console.log(results)
            return res.status(200).send({results})
        })
        .catch((err) => {
            return res.status(500).send({message: err})
        })
    },

    getDokumenByAdmin: (req, res) => {
        const { idSiswa } = req.body

        // console.log(req.body)

        dokumen_siswa.findAll({
            attributes : [
                'dokumenPath',
                'keterangan',
                'deskripsi'
            ],
            where: {
                studentId: idSiswa
            }
        })
        .then((results) => {
            console.log(results)
            return res.status(200).send({results})
        })
        .catch((err) => {
            return res.status(500).send({message: err})
        })
    }, 

    getDokumenByUser: (req, res) => {
        const { idSiswa } = req.body

        console.log(req.body)

        dokumen_siswa.findAll({
            attributes : [
                'dokumenPath',
                'keterangan',
                'deskripsi'
            ],
            where: {
                studentId: idSiswa
            }
        })
        .then((results) => {
            console.log(results)
            return res.status(200).send({results})
        })
        .catch((err) => {
            return res.status(500).send({message: err})
        })
    }
}


