
const { User, Sequelize, sequelize } = require('../models');
const Op = Sequelize.Op
const Crypto = require('crypto');



const { uploader } = require('../helpers/uploader');
const { createJWTToken, createForgotPasswordToken } = require('../helpers/jwtoken');
const { transporter } = require('../helpers/mailer')
const  testcontroller  = require('./testpdf')

// FOR EMAILER
const path=require('path')
const fs =require('fs')
const {emailer}=require('../helpers/mailer')
const {pdfcreate}=require('../helpers/pdfcreate')

const moment=require('moment')


const createPdf = async (obj, cb) => {
    // let objObj = JSON.parse(JSON.stringify(obj)) //Forces get of Datavalues
    

    var { email , nama, id , subscriptionNominal, date} = obj
    // console.log(obj)
    try{ 
        const replacements = {
            PaymentReceiptNumber: id,
            PaymentReceiptDate: new Date(date).toLocaleDateString('id-IND'),
            PaymentMethod: 'dadasd',
            FullName: `${nama}`,
            InvoiceNumber: 012334556,
            Description: ['dsadasda','dadasdasda'],
            PayTo: `Kasih Nusantara`,
            NumberDetails: 123456,
            Nominal:subscriptionNominal.toString().toLocaleString(),

            logo: 'file:///' +  path.resolve('./emails') + '/supports/logowithtext.png',
            instagramlogo: 'file:///' +  path.resolve('./emails') + '/supports/instagram_icon.png',
            facebooklogo: 'file:///' +  path.resolve('./emails') + '/supports/facebook_icon.png',
            twitterlogo: 'file:///' +  path.resolve('./emails') + '/supports/twitter_icon.png',
            youtubelogo: 'file:///' +  path.resolve('./emails') + '/supports/youtube_icon.png',
        }

        // console.log(replacements)

        const options = { 
            format: 'A5', 
            orientation: "landscape",
            border : {
                top: "0.5in",
                left: "0.5in",
                right: "0.5in",
                bottom: "0.5in"
            }
        }
        
        await pdfcreate("./emails/PaymentReceipt.html", replacements, options,obj, cb)
    }
    catch(err){
        console.log('asdasda')
        console.log(err)
    }
}

const mailInvoice = async (obj, PDF_STREAM) => {
    // let paymentObj = JSON.parse(JSON.stringify(payment)) //Forces get of Datavalues
    console.log('---------------------------', obj, '--------------------------------------------------')
    try{
        // const { transaction, voucher } = paymentObj
        // const { programSales, subscriptionSales, serviceSales } = transaction
        var { email , nama, id , subscriptionNominal, date} = obj
        // console.log(obj)
        console.log('---------------------------------------------------------')
        // console.log(subscriptionNominal)

        let subject = "Payment Receipt kasihnusantara"
        let InvoiceNumber =012334556
        let NumberDetails = `ACC: ${12345} - ${12333}` //nomr bisa diganti
        let Description = ['dadsasd','dadadasd']



        let emailReplacements = {
            PaymentReceiptNumber: id,
            PaymentReceiptDate: moment('20190208').format("DD MMMM YYYY"),
            PaymentMethod: 'dadasd',
            FullName: `${nama}`,
            InvoiceNumber: InvoiceNumber,
            Description: Description,
            PayTo: `Kasih Nusantara`,
            NumberDetails: NumberDetails,
            Nominal:subscriptionNominal.toString().toLocaleString(),
        }

        let attachments = [
            {
                filename: `paymentreceipt.pdf`,
                content: PDF_STREAM
            }
        ]  
        console.log('email is ' + email)
        await emailer(email, subject, "./emails/PaymentReceiptEmail.html", emailReplacements, attachments)
    }
    catch(err){
        console.log(err)
    }
}



module.exports = {

    //Register, Login, KeepLogin, Reset Password / Forgot Password, Change Password, Login Gmail, Login Facebook
    registerUser : (req, res) => {
        // console.log(req.body)
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
                                // console.log(dataUser.dataValues)
                                // console.log(dataUser.dataValues.id)
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
            // console.log(results)
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
                    //console.log(resultUpdate)
                    User.findOne({
                        where: {
                            id: req.user.userId
                        }
                    })
                    .then((dataUser) => {
                       // console.log(dataUser)

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
                //console.log(dataUser)
                const tokenJwt = createJWTToken({ userId: dataUser.id, email: dataUser.email })

                // console.log(dataUser)
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
        //console.log(req.body)
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
                        // ada
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
                // console.log('Testing')
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
                        // console.log(dataUser.id)
                        // console.log(dataUser.email)
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
           // console.log(results)
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
        var { subscriptionNominal, email, reminderDate } = req.body
        // console.log(req.body)
        User.update({
            subscriptionStatus: 1,
            subscriptionNominal,
            reminderDate
        },{
            where: { email }
        })
        .then(() => {
            console.log('masuk')
            res.send('success')
        })
    },
    reminderInvoice : async (req,results) =>{ // RUN SEKALI / HARI
        // console.log('reminderINvoice')
        // console.log(req)

        var res  = await User.findAll({where: {
            [Op.and] : [
                sequelize.where(sequelize.fn('datediff', sequelize.col('reminderDate') ,  sequelize.fn("NOW")), {
                    [Op.eq] : 0 // OR [Op.gt] : 5
                }),
                {
                    subscriptionStatus : 1
                }
            ]
        },
    
        attributes : ['nama', 'id', 'subscriptionNominal', 'email']})

        var listname = res.map((val) =>{
            // return val.dataValues
            return {...val.dataValues, date : new Date(), deadline : new Date()}
        })

        console.log(listname)


        const loop = async() =>{
            console.log('start')
            for(var i = 0; i<listname.length ; i++){
                console.log(listname[i])
                
                await createPdf(listname[i], async (PDF_STREAM, obj) => {
                    console.log('async')
                    await mailInvoice(obj, PDF_STREAM)
                })
                console.log('finish user ', i )
                
                // console.log(listname[i].email)
         
                // testcontroller.getemail(listname[i].email)
                // testcontroller.getemail(listname[i].email)
            }
            console.log('end')
        }
        await loop()
        console.log('asd--asd--asd--')


        User.update(
        {
            reminderDate : moment().add(1, 'M').format('YYYY-MM-DD') // 1 bulan dari sekarang 
        }
        ,
        {
            where: {
                [Op.and] : [
                    sequelize.where(sequelize.fn('datediff', sequelize.col('reminderDate') ,  sequelize.fn("NOW")), {
                        [Op.eq] : 0 // today is the user reminder date
                    }),
                    {
                        subscriptionStatus : 1
                    }
                ]
            }
        })
        .then((res)=>{
            console.log(res)
            console.log('------------------********************* finish success')
  
            // console.log(res)
           


            //----------------------------------------------------------------------------------------------------------
            // for(var i = 0; i<listname.length ; i++){
            //     console.log(listname[i])
            //     testcontroller.getemail(listname[i].email)
            // }
            
            // // var listname = res[0].dataValues
            // // console.log(listname)
            // console.log('success')
            // //scheduler
            // return results.status(200).send('success')
        })
        .catch((err)=>{
            console.log(err)
        })
    }
}


