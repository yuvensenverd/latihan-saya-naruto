const {User} = require('../models')

module.exports = {
    getUserData :  (req,res) =>{
        const { email, password } = req.body
        User.findAll({where: {email, password}})
        .then((results) => {
            console.log(results);
            res.send(results);
        })
        .catch((err) => {
            console.log(err);
        })
    },
    postUser : (req,res) =>{
        const { nama, password, email } = req.body
        User.create({
            nama,
            password,
            email,
            isGoogle: 0, 
            isFacebook: 0, 
            userImage: 'contoh',
            lastLogin: new Date(),
            verified: 0,
            role: 'user',
            subcriptionStatus: 0,
            subcriptionNominal: 0
        }) 
        .then(() => {
            User.findAll({where: {email, password}})
            .then((results) => {
                console.log(results);
                res.send(results);
            })
            .catch((err) => {
                console.log(err);
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }
}