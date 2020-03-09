const {Sequelize, sequelize, dokumen_siswa} = require('../models')
const Op = Sequelize.Op
const {uploader}=require('../helpers/uploader')
const fs=require('fs')

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
                'deskripsi',
                'orders'
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
                'id',
                'dokumenPath',
                'keterangan',
                'deskripsi',
                'orders'
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

    updateDokumentById: (req, res) => {
        console.log('===== Masuk Pergantian Dokument')

        try {

            const path = '/student/images';
            const upload = uploader(path, 'STD').fields([
                {name: 'dokumen_image'}, 
            ]);

            upload(req, res, (err) => {
                if(err) {
                    return res.status(500).json({ message: 'Upload picture failed !', error: err.message });
                }

                const { dokumen_image } = req.files;

                if(dokumen_image) {
                    var dokumen_imageDB = dokumen_image[0] ? path + '/' + dokumen_image[0].filename : '/defaultPhoto/defaultCategory.png';
                }

                const data = JSON.parse(req.body.data);

                const {
                    idSiswa,
                    idDokument
                } = data

                dokumen_siswa.update({
                    dokumenPath: dokumen_imageDB
                }, {
                    where: {
                        studentId: idSiswa,
                        id: idDokument
                    }
                })
                .then((resultUpdate) => {
                    return res.status(200).send(resultUpdate)
                })
                .catch((err) => {
                    fs.unlinkSync('./public' + dokumen_imageDB);

                    return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                })
            })
            
        } catch (error) {
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: error.message });
        }
    }
}


