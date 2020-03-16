const { Sequelize, sequelize, Payment,Student, Payout,scholarship, pencairan_dana} = require('../models')
const Axios = require('axios')
const Op = Sequelize.Op;
const { uploader } = require('../helpers/uploader');

module.exports = {
    cair: (req,res)=>{
        const {
            kode_transaksi,
            status,
            nominal,
            tgl_pengajuan,
            scholarshipId,
            norek,
            bank,
            note
        } = req.body
        console.log('***************** masuk pencairan dana ********************')
        console.log(req.body)
        console.log('***************** masuk pencairan dana ********************')
        
        pencairan_dana.create({
            kode_transaksi,
            status: 0,
            nominal,
            tgl_pengajuan,
            scholarshipId,
            norek,
            bank,
            note
        })
        .then((result) =>{
            scholarship.update({
                totalPayout: nominal
            }, {
                where: {
                    id: scholarshipId
                }
            })
            .then((resultUpdate) => {
                return res.status(200).send(result)
            })
            .catch((err) => {
                console.log(err)
            })
        }).catch((err)=>{
            console.log(err)
        })
    },
    approve: (req, res) => {

        console.log('========================masuk approve =================')
        try{
            const path = '/cair';
            const upload = uploader(path, 'cair').fields([{name: 'image'}])

            upload(req, res, (err) =>{
                if(err){
                    return res.status(500).json({message: 'upload bukti pencairan gagal!'})
                }

                
                console.log(req.files)
                const {image} = req.files;
                if(image){
                    var bukti = image ? path + '/' + image[0].filename : null
                }

                console.log(bukti)
                
                const data = JSON.parse(req.body.data);

                const {id, tgl_mutasi} = data
                console.log(data)

                return sequelize.transaction(function(t) {
                    return pencairan_dana.update({
                        status: 1,
                        tgl_mutasi,
                        bukti_transaksi: bukti
                    },{
                        where: {
                            id
                        }
                    },{ transaction: t})
                    .then((result)=>{
                        return res.status(200).send(result)
                    })
                    .catch((err)=>{
                        throw new Error()
                    })
                })
            })
        }catch(error){
            return res.status(200).send(error.message)
        }
    },
    checkspp: (req,res)=>{
        console.log('=============================> cek payout')
        console.log(req.body)
        const {id, bln} = req.body
        pencairan_dana.findAll({
            where:{
                scholarshipId: id
            }
        })
        .then((result1)=>{
            let checked = false
            // console.log(result1)
            if(result1){
                result1.map((val,i) =>{
                    console.log(val.dataValues.note.split(" ").slice(2,4).join(" "))
                    let check = val.dataValues.note.split(" ").slice(2,4).join(" ") == bln
                    // let bulan = val.dataValues.notes.slpit(' ')
                    console.log(check)
                    if(check){
                        checked = true
                    }
                })
            }
            
            return res.status(200).send(checked)
        })
    },
    getPencairan:(req, res)=>{
        console.log('++++++++++++++++ get all pencairn dana ++++++++++++++++')
        console.log(req.body)
        const {limit, offset, status} = req.body

        pencairan_dana.findAndCountAll({
            limit: parseInt(limit),
            offset: offset,
            attributes: ['id','kode_transaksi', 'status', 'nominal', 'bukti_transaksi', 'tgl_pengajuan', 'tgl_mutasi', 'scholarshipId', 'norek', 'bank', 'note'],
            // include: [
            //     {
            //         model: scholarship,
            //         attribute: [],
            //         include: [
            //             {
            //                 model: Student,
            //                 attribute: ['nama']
            //             }
            //         ]
            //     }
            // ]
            where: {
                status
            },
            order: [['createdAt', 'DESC']],
        })
        .then((result)=>{
            return res.status(200).send({result:result.rows, count: result.count})
        })
        .catch((err)=>{
            console.log(err)
        })
    },
    getSelectedPencairan:(req, res)=>{
        
        console.log('***************** masuk pencairan dana ********************')
        console.log(req.body)
        console.log('***************** masuk pencairan dana ********************')
        const {scholarshipId, limit, offset} = req.body
        pencairan_dana.findAndCountAll({
            limit: parseInt(limit),
            offset: offset,
            attribute: {
                exclude: ['createdAt', 'updatedAt'],
            },
            // include: [
            //     {
            //         model: scholarship,
            //         attribute: ['id']
            //     }
            // ],
            where: {
                scholarshipId
            },
            order: [['createdAt', 'DESC']],
        })
        .then((result)=>{
            
            return res.status(200).send({result:result.rows, count: result.count})
        })
        .catch((err)=>{
            console.log(err)
        })
    },

    getlastid : (req, res)=>{
        pencairan_dana.findOne({
            attributes: ['id'],
            order: [['id','DESC']]
        })
        .then((result)=>{
            console.log(result)
            return res.status(200).send(result)
        })
    },

    
}