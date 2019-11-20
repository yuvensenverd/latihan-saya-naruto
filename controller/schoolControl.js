const { Sequelize, sequelize, School} = require('../models')
const Op = Sequelize.Op

module.exports = {
    getSchool : (req, res) => {
        var { page, limit, name, date} = req.body;
        
        var offset = (page * limit) - limit

        School.findAll({
            limit:parseInt(limit),
            // limit : 10,
            offset:offset,
            attributes:{
                exclude : ['createAt', 'updateAt']
            },
            where : {
                nama : {
                    [Op.like] : `%${name}%`
                },
                isDeleted : 0
            },
            order: [['id', `${date}`], ['createdAt', `${date}`]],
        })
        .then((results)=>{
            School.count({
                where : {
                    isDeleted: 0
                }
            })
            .then((resultsCountSchool) => {
                let total = resultsCountSchool

                return res.status(200).send({message: 'Success Get All Schools', results, total})
            })
            .catch((err) => {
                return res.status(500).send({message: 'error', error: err})
            })
        }).catch((err)=>{
            return res.status(500).send({message: 'error', error: err})
        })
    },
    addSchool : (req, res) => {
        const {nama, alamat, telepon, namaPemilikRekening, nomorRekening, bank, email} = req.body
        School.create({
            nama,
            alamat,
            telepon,
            namaPemilikRekening,
            nomorRekening,
            bank,
            email
        }).then((result) => {
            return res.status(200).send(result)
        }).catch((err) => {
            return res.status(200).send(err.message)
        })
    },
    putSchool : (req,res) => {
        const {id} = req.query
        const {nama, alamat, telepon, namaPemilikRekening, nomorRekening, bank, email} = req.body
        School.update({
            nama,
            alamat,
            telepon,
            namaPemilikRekening,
            nomorRekening,
            bank,
            email,
            isVerified: '0'
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
        School.update({
            isVerified: '1'
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
        School.update({
            isDeleted: '1'
        }, {
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

    getSelectedSchool : (req, res) => {
        const { id } = req.query
        console.log(id)
        School.findOne({
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

    // admin semua sekolah yg dihapus atau tidak
    getSchoolAdmin: (req, res) => {
        var { page, limit, name, date} = req.body;
        
        var offset = (page * limit) - limit

        School.findAll({
            limit:parseInt(limit),
            // limit : 10,
            offset:offset,
            attributes:{
                exclude : ['createAt', 'updateAt']
            },
            where : {
                nama : {
                    [Op.like] : `%${name}%`
                }
            },
            order: [['id', `${date}`], ['createdAt', `${date}`]],
        })
        .then((results)=>{
            School.count({
                where : {
                    isDeleted: {
                        [Op.or] : [0, 1]
                    }
                }
            })
            .then((resultsCountSchool) => {
                let total = resultsCountSchool

                return res.status(200).send({message: 'Success Get All Schools', results, total})
            })
            .catch((err) => {
                return res.status(500).send({message: 'error', error: err})
            })
        }).catch((err)=>{
            return res.status(500).send({message: 'error', error: err})
        })
    }
}