
const { User, Sequelize, sequelize } = require('../models');
const Op = Sequelize.Op
const Crypto = require('crypto');
const fs = require('fs');

const { uploader } = require('../helpers/uploader');
const { createJWTToken, createForgotPasswordToken } = require('../helpers/jwtoken');
const transporter = require('../helpers/mailer')

module.exports = {

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
                            { isFacebook: null },
                            { isGoogle: null }
                        ]
                    }
                })
                .then(results => {
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
                            userImage: imagePath,
                            phoneNumber: '0',
                            lastLogin: new Date(),
                            createdAt: new Date(),
                            updatedAt: new Date()
                        })
                        .then(results1 => {

                            // Ketika user telah input data
                            User.findOne({
                                where: {
                                    id: results1.dataValues.id,
                                    email: results1.dataValues.email
                                }
                            })
                            .then(dataUser => {
                                console.log('Get data user')
                                console.log(dataUser.dataValues)
                                console.log(dataUser.dataValues.id)
                                // Ketika sudah daftar kirim link verification dan create jwtToken
                                const tokenJwt = createJWTToken({ userId: dataUser.dataValues.id, email: dataUser.dataValues.email })

                                console.log(tokenJwt)

                                let linkVerifikasi = `http://localhost:3000/verified/${tokenJwt}`;
                                //untuk live
                                //let linkVerifikasi = `https://testingui4.herokuapp.com/verified/${tokenJwt}`
                        
                                let mailOptions = {
                                    from: 'KasihNusantara Admin <rezardiansyah1997@gmail.com>',
                                    to: email,
                                    subject: 'Verifikasi Email for Kasih Nusantara',
                                    html: `
                                            <div>
                                                <hr />
                                                <h4>Link Verification</h4>
                                                <p>This is a link verification for Email: <span style='font-weight:bold'>${dataUser.dataValues.email}</span>.</p>
                                                <p>To verification your account <a href='${linkVerifikasi}'>Click Here!</a></p>
                                                <hr />
                                            </div>`
                                }

                                transporter.sendMail(mailOptions, (err1, res1) => {
                                    if (err1) {
                                        return res.status(500).send({ status: 'error', err: err1 })
                                    }

                                    return res.status(200).send({
                                        dataUser: dataUser.dataValues,
                                        token: tokenJwt
                                    });

                                })
                            })
                            .catch((err) => {
                                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                            })
                        })
                    } else {
                        return res.status(500).json({ message: "Email has been registered", error: err.message });
                    }
                })
                .catch((err) => {
                    return res.status(500).json({ message: "Email has been registered", error: err.message });
                })

            })
        } catch(err) {
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        }
       
    },

    emailVerification: (req, res) => {
        User.findAll({
            where: {
                id: req.user.userId,
                role: 'User',
                verified: 0
            }
        })
        .then((results) => {
            console.log(results)
            if(results.length === 0) {
                return res.status(500).send({ status: 'error', message: 'User not found' });
            } else {

                User.update(
                    {verified: 1},
                    {
                        where : {
                            id: req.user.userId
                        }
                    }
                )
                .then((resultUpdate) => {
                    console.log(resultUpdate)
                    User.findOne({
                        where: {
                            id: req.user.userId
                        }
                    })
                    .then((dataUser) => {
                        console.log(dataUser)

                        return res.status(200).send({
                            dataUser: dataUser.dataValues,
                            token: tokenJwt
                        });
                        
                    })
                    .catch((err) => {
                        return res.status(500).send({ status: 'error', message: 'User not found' });
                    })
                })
                .catch((err) => {
                    return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                })
            }
        })
        .catch((err) => {
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        })
    },

    resendEmailVerification: (req, res) => {
        User.findOne({
            where: {
                email: req.user.email
            }
        })
        .then((dataUser) => {

            if(dataUser.dataValues) {
                const tokenJwt = createJWTToken({ userId: dataUser.dataValues.id, email: dataUser.dataValues.email })
                let linkVerifikasi = `http://localhost:3000/verified/${tokenJwt}`;
                //untuk live
                //let linkVerifikasi = `https://testingui4.herokuapp.com/verified/${tokenJwt}`
        
                let mailOptions = {
                    from: 'KasihNusantara Admin <rezardiansyah1997@gmail.com>',
                    to: email,
                    subject: 'Verifikasi Email for Kasih Nusantara',
                    html: `
                            <div>
                                <hr />
                                <h4>Link Verification</h4>
                                <p>This is a link verification for Email: <span style='font-weight:bold'>${dataUser.dataValues.email}</span>.</p>
                                <p>To verification your account <a href='${linkVerifikasi}'>Click Here!</a></p>
                                <hr />
                            </div>`
                }

                transporter.sendMail(mailOptions, (err1, res1) => {
                    if (err1) {
                        return res.status(500).send({ status: 'error', err: err1 })
                    }

                    return res.status(200).send({
                        dataUser: dataUser.dataValues,
                        token: tokenJwt,
                    });

                })
            } else {
                return res.status(500).send({ status: 'error', message: 'User not found' });
            }
        })
        .catch((err) => {
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        })
    },

    keepLogin: (req, res) => {
        console.log('Test Keep Login')
        User.findOne({
            where: {
                id: req.user.userId 
            }
        })
        .then((dataUser) => {
            console.log('Masuk')
            if(dataUser) {
                console.log(dataUser)
                const tokenJwt = createJWTToken({ userId: dataUser.id, email: dataUser.email })

                console.log(dataUser)
                return res.status(200).send({
                    dataUser,
                    token: tokenJwt,
                });

            } else {
                return res.status(500).send({ status: 'error', err: 'User Not Found!' })
            }
        })
        .catch((err) => {
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        })
    },

    userLogin: (req, res) => {
        let hashPassword = Crypto.createHmac('sha256', 'kasihnusantara_api')
            .update(req.body.password).digest('hex');
        console.log(req.body)
        User.findOne({
            where: {
                email: req.body.email,
                password: hashPassword
            }
        })
        .then((results) => {
            if(results.dataValues) {
                
                User.update({
                    lastLogin: new Date()
                }, {
                    where: {
                        email: req.body.email,
                        password: hashPassword
                    }
                })
                .then((result1) => {
                    User.findOne({
                        where: {
                            email: req.body.email
                        }
                    })
                    .then((dataUser) => {
                        const tokenJwt = createJWTToken({ userId: dataUser.dataValues.id, email: dataUser.dataValues.email })

                        return res.status(200).send( {
                            dataUser: dataUser.dataValues,
                            token: tokenJwt
                        });
                    })
                    .catch((err) => {
                        return res.status(500).json({ message: "User Not Found", error: err.message });
                    })
                })
                .catch((err) => {
                    return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                })

            } else {
                return res.status(500).json({ message: "User Not Found", error: err.message });
            }
        })
        .catch((err) => {
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        })
    },

    getResetPasswordToken: (req, res) => {
        User.findOne({
            where: {
                email: req.body.email
            }
        })
        .then((dataUser) => {
            if(dataUser) {

                if(dataUser.isGoogle && dataUser.password === null) {
                    return res.status(500).send({ status: 'gmailTrue', message: `Silahkan Login with Gmail dengan Email = ${req.body.email}` })
                } 

                if(dataUser.isFacebook && dataUser.password === null) {
                    return res.status(500).send({ status: 'facebookTrue', message: `Silahkan Login with Facebook dengan Email = ${req.body.email}` })
                }

                const tokenPassword = createForgotPasswordToken({ userId: dataUser.id, email: dataUser.email })

                let linkVerifikasi = `http://localhost:3000/verifiedReset?token=${tokenPassword}`;
                //untuk live
                //let linkVerifikasi = `https://testingui4.herokuapp.com/verifiedReset?token=${tokenPassword}`

                let mailOptions = {
                    from: 'TestingUi Admin <rezardiansyah1997@gmail.com>',
                    to: req.body.email,
                    subject: `Reset Password for ${req.body.email}`,
                    html: `
                        <div>
                            <hr />
                            <h4>Reset Password</h4>
                            <p>This is a link reset password for Email: <span style='font-weight:bold'>${req.body.email}</span>.</p>
                            <p>This link will expire in 5 minutes</p>
                            <p>To reset your account password <a href='${linkVerifikasi}'>Click Here!</a></p>
                            <hr />
                        </div>`
                }

                transporter.sendMail(mailOptions, (err1, res1) => {
                    if (err1) {
                        return res.status(500).send({ status: 'error', err: err1 })
                    }

                    return res.status(200).send({
                        token: tokenPassword
                    });

                })

            } else {
                return res.status(500).send({ status: 'notFoundEmail', message: 'Email belum terdaftar, harap Register terlebih dahulu' })
            }
        })
        .catch((err) => {
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        })
    },

    userResetPassword: (req, res) => {
        let hashPassword = Crypto.createHmac('sha256', 'kasihnusantara_api')
                .update(req.body.data.password).digest('hex');
        
        User.update({
            password: hashPassword
        },
        {
            where: {
                email: req.body.data.email
            }
        })
        .then((results) => {
            return res.status(200).send(results)
        })
        .catch((err) => {
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        })
    },

    userChangePassword: (req, res) => {
        let oldPw = Crypto.createHmac('sha256', 'kasihnusantara_api').update(req.body.oldpw).digest('hex');
        let newPw = Crypto.createHmac('sha256', 'kasihnusantara_api').update(req.body.newpw).digest('hex');

        User.findOne({
            where: {
                email: req.body.email,
                password: oldPw
            }
        })
        .then((results) => {
            if(results) {
                User.update({
                    password: newPw

                }, 
                {
                    where: {
                        password: oldPw
                    }
                })
                .then((lastResults) => {
                    return res.status(200).send(results)
                })
                .catch((err) => {
                    return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                })
            } else {
                return res.status(500).json({ message: "Password Lama Anda Salah", error: err.message });
            }
        })
        .catch((err) => {
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        })
    },

    userCheckResetToken: (req, res) => {
        let email = req.resetToken.email

        return res.status(200).send(email)
    },

    loginWithGoogle: (req, res) => {
        User.findOne({
            where: {
                email: req.body.data.email,
                isGoogle: null,

            }
        })
        .then((results) => {
            if(results !== null) {
                // Kalo sudah pernah mendaftar dengan email google, dan user ingin mencoba
                // login lewat gmail, maka muncul errornya
                return res.status(500).send({ status: 'error', message: `Anda sudah pernah mendaftar dengan Email = ${req.body.data.email}`})
            } else {
                console.log('Testing')
                let encryptGoogleId = Crypto.createHmac('sha256', 'kasihnusantaraGoogleId_api')
                                    .update(req.body.data.googleId).digest('hex')
                
                User.findOne({
                    where: {
                        email: req.body.data.email,
                        isGoogle: encryptGoogleId
                    }
                })
                .then((dataUser) => {
                    if(dataUser !== null) {
                        // Jika ada
                        const tokenJwt = createJWTToken({ userId: dataUser.id, email: dataUser.email })

                        console.log(dataUser.id)

                        return res.status(200).send({
                            dataUser,
                            token: tokenJwt,
                        });
                    } else {
                        // Jika belum ada
                        req.body.data.isGoogle = encryptGoogleId
                        req.body.data.role = 'User'
                        req.body.data.verified = 1
                        req.body.data.userImage = '/defaultPhoto/defaultUser.png'
                        req.body.data.lastLogin = new Date();
                        req.body.data.createdAt = new Date();
                        req.body.data.updatedAt = new Date();
                        req.body.data.phoneNumber = '0'

                        delete req.body.data.googleId

                        User.create(req.body.data)
                        .then((results) => {

                            User.findOne({
                                isGoogle: encryptGoogleId
                            })
                            .then((dataUserInsert) => {
                                const tokenJwt = createJWTToken({ userId: dataUserInsert.id, email: dataUserInsert.email })

                                return res.status(200).send({
                                    dataUser: dataUserInsert,
                                    token: tokenJwt
                                });
                            })
                            .catch((err) => {
                                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                            })
                        })
                        .catch((err) => {
                            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });

                        })
                    }
                })
                .catch((err) => {
                    return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                })
            }
        })
        .catch((err) => {
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        })
    },

    loginWithFacebook: (req, res) => {
        User.findOne({
            where: {
                email: req.body.data.email,
                isFacebook: null,

            }
        })
        .then((results) => {
            console.log(results)
            if(results !== null) {
                // Kalo sudah pernah mendaftar dengan email google, dan user ingin mencoba
                // login lewat gmail, maka muncul errornya
                return res.status(500).send({ status: 'error', message: `Anda sudah pernah mendaftar dengan Email = ${req.body.data.email}`})
            } else {
                let encryptFacebookId = Crypto.createHmac('sha256', 'kasihnusantaraFacebookId_api')
                                    .update(req.body.data.facebookId).digest('hex')
                
                User.findOne({
                    where: {
                        email: req.body.data.email,
                        isFacebook: encryptFacebookId
                    }
                })
                .then((dataUser) => {
                    if(dataUser) {
                        // Jika ada
                        const tokenJwt = createJWTToken({ userId: dataUser.id, email: dataUser.email })

                        
                        return res.status(200).send({
                            dataUser,
                            token: tokenJwt,
                        });
                    } else {
                        // Jika belum ada
                        req.body.data.isFacebook = encryptFacebookId
                        req.body.data.role = 'User'
                        req.body.data.verified = 1
                        req.body.data.userImage = '/defaultPhoto/defaultUser.png'
                        req.body.data.lastLogin = new Date();
                        req.body.data.createdAt = new Date();
                        req.body.data.updatedAt = new Date();
                        req.body.data.phoneNumber = '0'

                        delete req.body.data.facebookId

                        User.create(req.body.data)
                        .then((results) => {

                            User.findOne({
                                isGoogle: encryptFacebookId
                            })
                            .then((dataUserInsert) => {
                                const tokenJwt = createJWTToken({ userId: dataUserInsert.id, email: dataUserInsert.email })

                                return res.status(200).send({
                                    dataUser: dataUserInsert,
                                    token: tokenJwt,
                                });
                            })
                            .catch((err) => {
                                return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                            })
                        })
                        .catch((err) => {
                            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });

                        })
                    }
                })
                .catch((err) => {
                    return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
                })
            }
        })
        .catch((err) => {
            return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: err.message });
        })
    },
    getSubscription : (req,res) => {
        User.findOne({
            where: {
                email: req.body.email
            },
            attributes: ['subscriptionStatus', 'subscriptionNominal']
        }).then((results) => {
            res.send(results)
        })
    },

    applySubscription : (req,res) => {
        var { subscriptionNominal, email } = req.body
        console.log(req.body)
        User.update({
            subscriptionStatus: 1,
            subscriptionNominal 
        },{
            where: { email }
        })
        .then(() => {
            console.log('masuk')
            res.send('success')
        })
    }
}