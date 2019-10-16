
const { User, Sequelize, sequelize } = require('../models');
const Op = Sequelize.Op
const Crypto = require('crypto');
const fs = require('fs');

const { uploader } = require('../helpers/uploader');
const { createJWTToken, createForgotPasswordToken } = require('../helpers/jwtoken');

module.exports = {
    getUserData :  (req,res) =>{

    },
    postUser : (req,res) =>{
        
    },

    //Register, Login, KeepLogin, Reset Password / Forgot Password, Change Password, Login Gmail, Login Facebook
    registerUser : (req, res) => {
        console.log(req.body)
        try {
            let path = `/users`; //file save path
            const upload = uploader(path, 'KasihNusantara').fields([{ name: 'imageUser' }]); //uploader(path, 'default prefix')

            upload(req, res, (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Upload picture failed !', error: err.message });
                }

                // Setelah upload berhasil
                // proses parse data JSON karena kita ngirim file gambar
                const data = JSON.parse(req.body.data);
                console.log(data)

                /* 
                 `createdAt` default value ?, 
                `updatedAt` default value */

                User.findAll({
                    where: {
                        email: data.email,
                        [Op.or]: [
                            { isFacebook: 1 },
                            { isGoogle: 1 }
                        ]
                    }
                })
                .then(results => {
                    console.log(results)
                    if(results.length === 0) {
                        console.log('Data Tidak Ketemu Berarti Bisa daftar')

                        const { 
                            name,
                            email,
                            password,
                        } = data

                        let hashPassword = Crypto.createHmac('sha256', 'kasihnusantara_api')
                        .update(password).digest('hex');

                        const { imageUser } = req.files;
                        console.log(imageUser)
                        const imagePath = imageUser ? path + '/' + imageUser[0].filename : '/defaultPhoto/defaultUser.png';
                        console.log(imagePath)
    
                        console.log(data)

                        User.create({
                            nama: name,
                            email,
                            password: hashPassword,
                            role: 'User',
                            userImage: imagePath
                        })
                        .then(results1 => {
                            console.log(results1)
                            console.log(results1.dataValues)

                            // Ketika sudah daftar kirim link verification dan create jwtToken
                            User.findOne({
                                where: {
                                    id: results1.dataValues.id,
                                    email: data.email
                                }
                            })
                            .then(results2 => {
                                if(results2.length === 0) {
                                    
                                    return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                                
                                } else {

                                    console.log(results2)
                                    console.log(results2.id)


                                    // const tokenJwt = createJWTToken({ userId: results2.id, email: results2.email })

                                    // let linkVerifikasi = `http://localhost:3000/verified/${tokenJwt}`;
                                    // //untuk live
                                    // //let linkVerifikasi = `https://testingui4.herokuapp.com/verified/${tokenJwt}`
                           
                                    // let mailOptions = {
                                    //     from: 'TestingUi Admin <rezardiansyah1997@gmail.com>',
                                    //     to: email,
                                    //     subject: 'Verifikasi Email for Kasih Nusantara',
                                    //     html: `
                                    //             <div>
                                    //                 <hr />
                                    //                 <h4>Link Verification</h4>
                                    //                 <p>This is a link verification for Email: <span style='font-weight:bold'>${results2.email}</span>.</p>
                                    //                 <p>To verification your account <a href='${linkVerifikasi}'>Click Here!</a></p>
                                    //                 <hr />
                                    //             </div>`
                                    // }

                                    // transporter.sendMail(mailOptions, (err1, res1) => {
                                    //     if (err1) {
                                    //         return res.status(500).send({ status: 'error', err: err1 })
                                    //     }

                                    //     return res.status(200).send({
                                    //         name: results[0].name,
                                    //         email: results[0].email,
                                    //         token: tokenJwt,
                                    //         status: results[0].status,
                                    //         UserImage: results[0].UserImage,
                                    //         role: results[0].role
                                    //     });

                                    // })
                                }
                                // kirim link verification set jwttoken
                            })
                        })
                    } else {
                        return res.status(500).json({ message: "Email has been registered", error: err.message });
                    }
                })

            })
        } catch(err) {
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        }
       
    }
}