const { Sequelize, sequelize, school, school_pictures, User} = require('../models')
const Op = Sequelize.Op;
const { uploader } = require('../helpers/uploader');

module.exports = {
    getSchool : (req, res) => {
        school.findAll({
            attributes:{
                exclude : ['createdAt', 'updatedAt']
            },
                where : {
                    isDeleted : 0,
                    isVerified: 1
                }
        })
        .then((results)=>{
            // console.log(result)
            return res.status(200).send({results})
        }).catch((err)=>{
            return res.status(500).send({message: 'error', error: err})
        })
    },
    getAllSchool : (req,res) => {
        console.log(req.body)
        const offset = req.body.offset ? req.body.offset : 0
        const limit = req.body.limit ? req.body.limit : 6
        const text = req.body.text ? req.body.text : ''
        school.findAndCountAll({
            offset : offset,
            limit : limit,
            attributes:{
                exclude : ['createdAt', 'updatedAt']
            },
            where : {
                isDeleted : 0,
                isVerified: 1,
                nama : {
                    [Op.like] : `%${text}%`
                },
            },
            include : [{
                model : school_pictures,
                limit: 1
            },
           ]
        })
        .then((results)=>{
            // console.log(result)
            // return res.status(200).send(results)
            console.log(results)
            return res.status(200).send({result : results.rows, count : results.count})
        }).catch((err)=>{
            console.log(err)
            return res.status(500).send({message: 'error', error: err})
        })
    },
    getSchoolDetails : (req,res) => {
        console.log('School Details ---- > with id  ', req.params.id)

        school.findOne({
            attributes : {
                exclude : ['createdAt', 'updatedAt']
            },
            where : {
                id : req.params.id,
                isDeleted : 0,
                isVerified: 1
            },
            include : [{
                model : school_pictures,
                attributes : ['imagePath']
            }]
        }).then(result => {
            // console.log(res)
            return res.status(200).send({result : result})
        }).catch(err => {
            console.log(err)
            return res.status(500).send({message: 'error', error: err})
        })
    },
    getSelectedSchool: (req, res) => {
        console.log('--------------->')
        const {id} = req.query
        school.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            where: {
                id
            }
        }).then((result)=>{
            console.log(result)
            return res.status(200).send(result)
        }).catch((err)=>{
            console.log(err)
            return res.status(500).send(err)
        })
    },

    addSchool : (req, res) => {
        try {
            const path = '/school';
            const upload = uploader(path, 'sekolah').fields([{name: 'image'}])
        
            upload(req, res, (err) => {
                if(err) {
                    return res.status(500).json({ message: 'Upload picture failed !', error: err.message });
                }

                const { image } = req.files;

                const data = JSON.parse(req.body.data);

                const {
                    nama,
                    alamat, 
                    telepon,
                    namaPemilikRekening,
                    nomorRekening,
                    bank, 
                    email,
                    cabangBank,
                    provinsi
                } = data

                return sequelize.transaction(function(t) {
                    return school.create({
                        nama,
                        alamat,
                        telepon,
                        namaPemilikRekening,
                        nomorRekening,
                        bank,
                        email,
                        cabangBank,
                        provinsi
                    }, {transaction: t})
                    .then((result) => {
                        let schoolId = result.dataValues.id

                        let listImage = [];
                        for(let i=0; i < image.length; i++){
                            const imagePath = path + '/' + image[i].filename
                            listImage.push({
                                schoolId,
                                imagePath
                            })
                        }
                        return school_pictures.bulkCreate(listImage, {transaction: t})
                        .then((result2) => {
                            return res.status(200).send(result2)
                        })
                        .catch((err) => {
                            throw new Error()
                        })
                    })
                    .catch((err) => {
                        throw new Error()
                    })
                })

                // school.create({
                //     nama,
                //     alamat,
                //     telepon,
                //     namaPemilikRekening,
                //     nomorRekening,
                //     bank,
                //     email
                // }).then((result) => {
                //     return res.status(200).send(result)
                // }).catch((err) => {
                //     return res.status(200).send(err.message)
                // })
            })
        } catch (error) {
            return res.status(200).send(error.message)
        }
        // const {nama, alamat, telepon, namaPemilikRekening, nomorRekening, bank, email} = req.body
    },

    putSchool : (req,res) => {
        const {id} = req.query
        const {nama, alamat, telepon, namaPemilikRekening, nomorRekening, bank, email} = req.body
        school.update({
            nama,
            alamat,
            telepon,
            namaPemilikRekening,
            nomorRekening,
            bank,
            email,
            isVerified: 0
        },{
            where : {
                id
            }
        })
        .then((result) => {
            return res.status(200).send(result)
        }).catch((err) => {
            return res.status(500).send(err)
        })
    },
    verifiedSchool : (req, res) => {
        const {id} = req.query
        console.log(id)
        school.update({
            isVerified: 1
        },{
            where: {
                id
            }
        })
        .then((result) => {
            return res.status(200).send(result)
        }).catch((err) => {
            return res.status(500).send(err)
        })
    },
    deleteSchool : (req, res) => {
        console.log('---------------------> masuk delete school')
        const {id} = req.query
        school.update({
            isDeleted: 1
        }, {
            where: {
                id
            }
        })
        .then((result) => {
            return res.status(200).send({result})
        }).catch((err) => {
            return res.status(500).send(err)
        })
    },

    getSelectedSchool : (req, res) => {
        const { id } = req.query
        console.log(id)
        school.findOne({
            attributes:{
                exclude : ['createAt', 'updateAt']
            },
                where : {
                    id,
                    isDeleted : 0
                }
        })
        .then((result)=>{
            // console.log(result.dataValues)
            return res.status(200).send(result.dataValues)
        }).catch((err)=>{
            return res.status(500).send({message: 'error', error: err})
        })
    },

    getAllSchoolByAdmin: (req, res) => {
        const { id } = req.user;

        User.findOne({
            where: {
                id,
                role: 'Admin'
            }
        })
        .then((result) => {
            if(result) {
                school.findAll({
                    attributes:{
                        exclude : ['createdAt', 'updatedAt']
                    },
                        where : {
                            isDeleted : 0
                        }
                })
                .then((results)=>{
                    return res.status(200).send({results})
                }).catch((err)=>{
                    return res.status(500).send({message: 'error', error: err})
                })
            } else {
                return res.status(200).send({results: 'NotAdmin'})
            }
        })
        .catch((err) => {
            return res.status(500).send({message: 'error', error: err})
        })
    },

    getSchoolPerUser: (req, res) => {
        school.findAll({
            attributes:{
                exclude : ['createdAt', 'updatedAt']
            },
                where : {
                    isDeleted : 0,
                    isVerified: 1
                }
        })
        .then((results)=>{
            // console.log(result)
            return res.status(200).send({results})
        }).catch((err)=>{
            return res.status(500).send({message: 'error', error: err})
        })
    }
}
