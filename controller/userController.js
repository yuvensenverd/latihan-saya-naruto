const {
  User,
  Sequelize,
  sequelize,
  school,
  Project,
  Payment,
  Subscription,
  scholarship,
  Student,
  coursesvideo,
  userVideoSubscription,
  quiz,
  question,
} = require("../models");
const Op = Sequelize.Op;
const Crypto = require("crypto");

const { uploader } = require("../helpers/uploader");
const {
  createJWTToken,
  createForgotPasswordToken,
} = require("../helpers/jwtoken");
const { transporter } = require("../helpers/mailer");
const testcontroller = require("./testpdf");

// FOR EMAILER
const path = require("path");
const fs = require("fs");
var mime = require("mime");
const { emailer } = require("../helpers/mailer");
const { pdfcreate } = require("../helpers/pdfcreate");

const moment = require("moment");
const request = require("request");
const axios = require("axios");

const FormData = require("form-data");

const multer = require("multer");
// const streamifier = require('streamifier')
const stream = require("stream");

const { URL_API, UI_LINK } = require("../helpers/url_api");

const createPdf = async (obj, cb) => {
  // let objObj = JSON.parse(JSON.stringify(obj)) //Forces get of Datavalues

  var {
    email,
    username,
    id,
    nominalSubscription,
    date,
    namamurid,
    judulscholarship,
    nominalscholarship,
    scholarshipId,
  } = obj;
  try {
    const replacements = {
      PaymentReceiptNumber: id,
      PaymentReceiptDate: new Date(date).toLocaleDateString("id-IND"),
      PaymentMethod: "dadasd",
      FullName: `${username}`,
      InvoiceNumber: 012334556,
      Description: ["dsadasda", "dadasdasda"],
      PayTo: `Kasih Nusantara`,
      NumberDetails: 123456,
      Nominal: nominalSubscription.toString().toLocaleString(),

      //
      NamaMurid: namamurid,
      JudulScholarship: encodeURIComponent(judulscholarship), // Bantu Reeza sekolah Bantu%Reza%sekolah
      NominalScholarship: nominalscholarship,
      scholarshipId: scholarshipId,

      //

      logo:
        "file:///" + path.resolve("./emails") + "/supports/logowithtext.png",
      instagramlogo:
        "file:///" + path.resolve("./emails") + "/supports/instagram_icon.png",
      facebooklogo:
        "file:///" + path.resolve("./emails") + "/supports/facebook_icon.png",
      twitterlogo:
        "file:///" + path.resolve("./emails") + "/supports/twitter_icon.png",
      youtubelogo:
        "file:///" + path.resolve("./emails") + "/supports/youtube_icon.png",
    };

    const options = {
      format: "A5",
      orientation: "landscape",
      border: {
        top: "0.5in",
        left: "0.5in",
        right: "0.5in",
        bottom: "0.5in",
      },
    };

    await pdfcreate(
      "./emails/PaymentReceipt.html",
      replacements,
      options,
      obj,
      cb
    );
  } catch (err) {
    console.log(err);
  }
};

const mailInvoice = async (obj, PDF_STREAM) => {
  // let paymentObj = JSON.parse(JSON.stringify(payment)) //Forces get of Datavalues
  console.log(
    "---------------------------",
    obj,
    "--------------------------------------------------"
  );
  try {
    // const { transaction, voucher } = paymentObj
    // const { programSales, subscriptionSales, serviceSales } = transaction
    var {
      email,
      username,
      id,
      nominalSubscription,
      date,
      namamurid,
      judulscholarship,
      nominalscholarship,
      scholarshipId,
    } = obj;

    let subject = "Payment Receipt kasihnusantara";
    let InvoiceNumber = 012334556;
    let NumberDetails = `ACC: ${12345} - ${12333}`; //nomr bisa diganti
    let Description = ["dadsasd", "dadadasd"];

    let emailReplacements = {
      PaymentReceiptNumber: id,
      PaymentReceiptDate: moment("20190208").format("DD MMMM YYYY"),
      PaymentMethod: "dadasd",
      FullName: `${username}`,
      InvoiceNumber: InvoiceNumber,
      Description: Description,
      PayTo: `Kasih Nusantara`,
      NumberDetails: NumberDetails,
      Nominal: nominalSubscription.toString().toLocaleString(),

      scholarshipId: scholarshipId,
      NamaMurid: namamurid,
      JudulScholarship: encodeURIComponent(judulscholarship),
      NominalScholarship: nominalscholarship,
    };

    let attachments = [
      {
        filename: `paymentreceipt.pdf`,
        content: PDF_STREAM,
      },
    ];

    await emailer(
      email,
      subject,
      "./emails/PaymentReceiptEmail.html",
      emailReplacements,
      attachments
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  //Register, Login, KeepLogin, Reset Password / Forgot Password, Change Password, Login Gmail, Login Facebook
  registerUser: (req, res) => {
    try {
      let path = `/users`; //file save path
      const upload = uploader(path, "KasihNusantara").fields([
        { name: "imageUser" },
      ]); //uploader(path, 'default prefix')

      upload(req, res, (err) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Upload picture failed !", error: err.message });
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
            // [Op.or]: [
            //     { isFacebook: null },
            //     { isGoogle: null }
            // ]
          },
        })
          .then((results) => {
            if (results.length === 0) {
              const { name, email, password, role } = data;

              let hashPassword = Crypto.createHmac(
                "sha256",
                "kasihnusantara_api"
              )
                .update(password)
                .digest("hex");

              const { imageUser } = req.files;

              const imagePath = imageUser
                ? path + "/" + imageUser[0].filename
                : "/defaultPhoto/defaultUser.png";

              User.create({
                nama: name,
                email,
                password: hashPassword,
                role,
                userImage: imagePath,
                phoneNumber: "0",
                lastLogin: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
              }).then((results1) => {
                // Ketika user telah input data
                User.findOne({
                  where: {
                    id: results1.dataValues.id,
                    email: results1.dataValues.email,
                  },
                })
                  .then((dataUser) => {
                    // Ketika sudah daftar kirim link verification dan create jwtToken
                    const tokenJwt = createJWTToken({
                      userId: dataUser.dataValues.id,
                      email: dataUser.dataValues.email,
                    });

                    console.log(tokenJwt);

                    let linkVerifikasi = `${UI_LINK}/verified/${tokenJwt}`;

                    let mailOptions = {
                      from:
                        "KasihNusantara Admin <operational@kasihnusantara.com>",
                      to: email,
                      subject: "Verifikasi Email for Kasih Nusantara",
                      html: `
                                            <div>
                                                <hr />
                                                <h4>Link Verification</h4>
                                                <p>This is a link verification for Email: <span style='font-weight:bold'>${dataUser.dataValues.email}</span>.</p>
                                                <p>To verification your account <a href='${linkVerifikasi}'>Click Here!</a></p>
                                                <hr />
                                            </div>`,
                    };

                    transporter.sendMail(mailOptions, (err1, res1) => {
                      if (err1) {
                        return res
                          .status(500)
                          .send({ status: "error", err: err1 });
                      }

                      return res.status(200).send({
                        dataUser: dataUser.dataValues,
                        token: tokenJwt,
                      });
                    });
                  })
                  .catch((err) => {
                    return res.status(500).json({
                      message:
                        "There's an error on the server. Please contact the administrator.",
                      error: err.message,
                    });
                  });
              });
            } else {
              return res.status(500).json({
                message: "Email has been registered",
                error: err.message,
              });
            }
          })
          .catch((err) => {
            return res.status(500).json({
              message: "Email has been registered",
              error: err.message,
            });
          });
      });
    } catch (err) {
      return res.status(500).json({
        message:
          "There's an error on the server. Please contact the administrator.",
        error: err.message,
      });
    }
  },

  emailVerification: (req, res) => {
    console.log("Masuk verification");
    User.findAll({
      where: {
        id: req.user.userId,
        verified: 0,
      },
    })
      .then((results) => {
        console.log(req.user);

        if (results.length === 0) {
          console.log("tidak dapat");
          return res
            .status(500)
            .send({ status: "error", message: "User not found" });
        } else {
          console.log("dapat");

          User.update(
            { verified: 1 },
            {
              where: {
                id: req.user.userId,
              },
            }
          )
            .then((resultUpdate) => {
              User.findOne({
                where: {
                  id: req.user.userId,
                },
              })
                .then((dataUser) => {
                  const tokenJwt = createJWTToken({
                    userId: dataUser.dataValues.id,
                    email: dataUser.dataValues.email,
                  });

                  return res.status(200).send({
                    dataUser: dataUser.dataValues,
                    token: tokenJwt,
                  });
                })
                .catch((err) => {
                  console.log("err1");
                  console.log(err);
                  return res
                    .status(500)
                    .send({ status: "error", message: "User not found" });
                });
            })
            .catch((err) => {
              console.log("err2");
              console.log(err);
              return res.status(500).json({
                message:
                  "There's an error on the server. Please contact the administrator.",
                error: err.message,
              });
            });
        }
      })
      .catch((err) => {
        console.log("err3");
        console.log(err);
        return res.status(500).json({
          message:
            "There's an error on the server. Please contact the administrator.",
          error: err.message,
        });
      });
  },

  resendEmailVerification: (req, res) => {
    User.findOne({
      where: {
        email: req.user.email,
      },
    })
      .then((dataUser) => {
        if (dataUser.dataValues) {
          const tokenJwt = createJWTToken({
            userId: dataUser.dataValues.id,
            email: dataUser.dataValues.email,
          });
          // let linkVerifikasi = `http://localhost:3000/verified/${tokenJwt}`;
          //untuk live
          let linkVerifikasi = `${UI_LINK}/verified/${tokenJwt}`;

          let mailOptions = {
            from: "KasihNusantara Admin <operational@kasihnusantara.com>",
            to: req.user.email,
            subject: "Verifikasi Email for Kasih Nusantara",
            html: `
                            <div>
                                <hr />
                                <h4>Link Verification</h4>
                                <p>This is a link verification for Email: <span style='font-weight:bold'>${dataUser.dataValues.email}</span>.</p>
                                <p>To verification your account <a href='${linkVerifikasi}'>Click Here!</a></p>
                                <hr />
                            </div>`,
          };

          transporter.sendMail(mailOptions, (err1, res1) => {
            if (err1) {
              return res.status(500).send({ status: "error", err: err1 });
            }

            return res.status(200).send({
              dataUser: dataUser.dataValues,
              token: tokenJwt,
            });
          });
        } else {
          return res
            .status(500)
            .send({ status: "error", message: "User not found" });
        }
      })
      .catch((err) => {
        return res.status(500).json({
          message:
            "There's an error on the server. Please contact the administrator.",
          error: err.message,
        });
      });
  },

  keepLogin: (req, res) => {
    User.findOne({
      where: {
        id: req.user.userId,
      },
    })
      .then((dataUser) => {
        if (dataUser) {
          const tokenJwt = createJWTToken({
            userId: dataUser.id,
            email: dataUser.email,
          });

          return res.status(200).send({
            dataUser,
            token: tokenJwt,
          });
        } else {
          return res
            .status(500)
            .send({ status: "error", err: "User Not Found!" });
        }
      })
      .catch((err) => {
        return res.status(500).json({
          message:
            "There's an error on the server. Please contact the administrator.",
          error: err.message,
        });
      });
  },

  userLogin: (req, res) => {
    let hashPassword = Crypto.createHmac("sha256", "kasihnusantara_api")
      .update(req.body.password)
      .digest("hex");

    User.findOne({
      where: {
        email: req.body.email,
        password: hashPassword,
      },
    })
      .then((results) => {
        // console.log(results)
        if (results) {
          User.update(
            {
              lastLogin: new Date(),
            },
            {
              where: {
                email: req.body.email,
                password: hashPassword,
              },
            }
          )
            .then((result1) => {
              User.findOne({
                where: {
                  email: req.body.email,
                },
              })
                .then((dataUser) => {
                  const tokenJwt = createJWTToken({
                    userId: dataUser.dataValues.id,
                    email: dataUser.dataValues.email,
                  });
                  // ada
                  return res.status(200).send({
                    dataUser: dataUser.dataValues,
                    token: tokenJwt,
                  });
                })
                .catch((err) => {
                  return res
                    .status(500)
                    .json({ message: "User Not Found", error: err.message });
                });
            })
            .catch((err) => {
              return res.status(500).json({
                message:
                  "There's an error on the server. Please contact the administrator.",
                error: err.message,
              });
            });
        } else {
          return res
            .status(500)
            .json({ message: "Email atau Password Salah." });
        }
      })
      .catch((err) => {
        return res.status(500).json({
          message:
            "There's an error on the server. Please contact the administrator.",
          error: err.message,
        });
      });
  },

  getResetPasswordToken: (req, res) => {
    User.findOne({
      where: {
        email: req.body.email,
      },
    })
      .then((dataUser) => {
        if (dataUser) {
          if (dataUser.isGoogle && dataUser.password === null) {
            return res.status(500).send({
              status: "gmailTrue",
              message: `Silahkan Login with Gmail dengan Email = ${req.body.email}`,
            });
          }

          if (dataUser.isFacebook && dataUser.password === null) {
            return res.status(500).send({
              status: "facebookTrue",
              message: `Silahkan Login with Facebook dengan Email = ${req.body.email}`,
            });
          }

          const tokenPassword = createForgotPasswordToken({
            userId: dataUser.id,
            email: dataUser.email,
          });

          // let linkVerifikasi = `http://localhost:3000/verifiedReset?token=${tokenPassword}`;
          //untuk live
          let linkVerifikasi = `${UI_LINK}/verifiedReset?token=${tokenPassword}`;

          let mailOptions = {
            from: "Kasih Nusantara Admin <operational@kasihnusantara.com>",
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
                        </div>`,
          };

          transporter.sendMail(mailOptions, (err1, res1) => {
            if (err1) {
              return res.status(500).send({ status: "error", err: err1 });
            }

            return res.status(200).send({
              token: tokenPassword,
            });
          });
        } else {
          return res.status(500).send({
            status: "notFoundEmail",
            message: "Email belum terdaftar, harap Register terlebih dahulu",
          });
        }
      })
      .catch((err) => {
        return res.status(500).json({
          message:
            "There's an error on the server. Please contact the administrator.",
          error: err.message,
        });
      });
  },

  userResetPassword: (req, res) => {
    let hashPassword = Crypto.createHmac("sha256", "kasihnusantara_api")
      .update(req.body.data.password)
      .digest("hex");

    User.update(
      {
        password: hashPassword,
      },
      {
        where: {
          email: req.body.data.email,
        },
      }
    )
      .then((results) => {
        return res.status(200).send(results);
      })
      .catch((err) => {
        return res.status(500).json({
          message:
            "There's an error on the server. Please contact the administrator.",
          error: err.message,
        });
      });
  },

  getSchool: (req, res) => {
    School.findAll({
      attributes: ["nama", "id"],
    })
      .then((result) => {
        return res
          .status(200)
          .send({ message: "getschool success", result: result });
      })
      .catch((err) => {
        return res.status(500).send(err);
      });
  },

  userChangePassword: (req, res) => {
    let oldPw = Crypto.createHmac("sha256", "kasihnusantara_api")
      .update(req.body.oldpw)
      .digest("hex");
    let newPw = Crypto.createHmac("sha256", "kasihnusantara_api")
      .update(req.body.newpw)
      .digest("hex");

    User.findOne({
      where: {
        email: req.body.email,
        password: oldPw,
      },
    })
      .then((results) => {
        if (results) {
          User.update(
            {
              password: newPw,
            },
            {
              where: {
                password: oldPw,
              },
            }
          )
            .then((lastResults) => {
              return res.status(200).send(results);
            })
            .catch((err) => {
              return res.status(500).json({
                message:
                  "There's an error on the server. Please contact the administrator.",
                error: err.message,
              });
            });
        } else {
          return res
            .status(500)
            .json({ message: "Password Lama Salah", error: err.message });
        }
      })
      .catch((err) => {
        return res
          .status(500)
          .json({ message: "Password Lama Salah", error: err.message });
      });
  },

  userCheckResetToken: (req, res) => {
    let email = req.resetToken.email;

    return res.status(200).send(email);
  },

  registerWithGoogle: (req, res) => {
    User.findOne({
      where: {
        email: req.body.data.email,
        // isGoogle: encryptGoogleId,
      },
    })
      .then((results) => {
        console.log(
          "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
        );
        console.log(results);
        if (results !== null) {
          var encryptGoogleId = Crypto.createHmac(
            "sha256",
            "kasihnusantaraGoogleId_api"
          )
            .update(req.body.data.googleId)
            .digest("hex");

          // Kalo sudah pernah mendaftar dengan email google, dan user ingin mencoba
          // login lewat gmail, maka muncul errornya
          // return res.status(500).send({ status: 'error', message: `Anda sudah pernah mendaftar dengan Email = ${req.body.data.email}`})
          User.update(
            {
              isGoogle: encryptGoogleId,
            },
            {
              where: {
                email: req.body.data.email,
              },
            }
          ).then((update) => {
            User.findOne({
              where: {
                email: req.body.data.email,
              },
            })
              .then((dataUserInsert) => {
                // console.log('CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCc')
                const tokenJwt = createJWTToken({
                  userId: dataUserInsert.id,
                  email: dataUserInsert.email,
                });

                return res.status(200).send({
                  dataUser: dataUserInsert,
                  token: tokenJwt,
                });
              })
              .catch((err) => {
                return res.status(500).json({
                  message:
                    "There's an error on the server. Please contact the administrator.",
                  error: err.message,
                });
              });
          });
        } else {
          // console.log('Testing')

          var encryptGoogleId = Crypto.createHmac(
            "sha256",
            "kasihnusantaraGoogleId_api"
          )
            .update(req.body.data.googleId)
            .digest("hex");

          User.findOne({
            where: {
              email: req.body.data.email,
              isGoogle: encryptGoogleId,
            },
          })
            .then((dataUser) => {
              console.log(
                "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB"
              );
              console.log(dataUser);
              if (dataUser !== null) {
                // Jika ada
                // console.log(dataUser.id)
                // console.log(dataUser.email)
                const tokenJwt = createJWTToken({
                  userId: dataUser.id,
                  email: dataUser.email,
                });

                // console.log(dataUser.id)

                return res.status(200).send({
                  dataUser,
                  token: tokenJwt,
                });
              } else {
                // Jika belum ada
                req.body.data.isGoogle = encryptGoogleId;
                // req.body.data.role = 'User'
                req.body.data.verified = 1;
                req.body.data.userImage = "/defaultPhoto/defaultUser.png";
                req.body.data.lastLogin = new Date();
                req.body.data.createdAt = new Date();
                req.body.data.updatedAt = new Date();
                req.body.data.phoneNumber = "0";

                delete req.body.data.googleId;

                User.create(req.body.data)
                  .then((results) => {
                    User.findOne({
                      where: {
                        isGoogle: encryptGoogleId,
                      },
                    })
                      .then((dataUserInsert) => {
                        console.log(
                          "CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCc"
                        );
                        const tokenJwt = createJWTToken({
                          userId: dataUserInsert.id,
                          email: dataUserInsert.email,
                        });

                        return res.status(200).send({
                          dataUser: dataUserInsert,
                          token: tokenJwt,
                        });
                      })
                      .catch((err) => {
                        return res.status(500).json({
                          message:
                            "There's an error on the server. Please contact the administrator.",
                          error: err.message,
                        });
                      });
                  })
                  .catch((err) => {
                    return res.status(500).json({
                      message:
                        "There's an error on the server. Please contact the administrator.",
                      error: err.message,
                    });
                  });
              }
            })
            .catch((err) => {
              return res.status(500).json({
                message:
                  "There's an error on the server. Please contact the administrator.",
                error: err.message,
              });
            });
        }
      })
      .catch((err) => {
        return res.status(500).json({
          message:
            "There's an error on the server. Please contact the administrator.",
          error: err.message,
        });
      });
  },

  registerWithFacebook: (req, res) => {
    User.findOne({
      where: {
        email: req.body.data.email,
        // isFacebook: null,
      },
    })
      .then((results) => {
        // console.log(results)
        if (results !== null) {
          var encryptFacebookId = Crypto.createHmac(
            "sha256",
            "kasihnusantaraFacebookId_api"
          )
            .update(req.body.data.facebookId)
            .digest("hex");

          // Kalo sudah pernah mendaftar dengan email google, dan user ingin mencoba
          // login lewat gmail, maka muncul errornya
          // return res.status(500).send({ status: 'error', message: `Anda sudah pernah mendaftar dengan Email = ${req.body.data.email}`})
          User.update(
            {
              isFacebook: encryptFacebookId,
            },
            {
              where: {
                email: req.body.data.email,
              },
            }
          ).then((update) => {
            User.findOne({
              where: {
                isFacebook: encryptFacebookId,
              },
            })
              .then((dataUserInsert) => {
                const tokenJwt = createJWTToken({
                  userId: dataUserInsert.id,
                  email: dataUserInsert.email,
                });

                return res.status(200).send({
                  dataUser: dataUserInsert,
                  token: tokenJwt,
                });
              })
              .catch((err) => {
                return res.status(500).json({
                  message:
                    "There's an error on the server. Please contact the administrator.",
                  error: err.message,
                });
              });
          });
        } else {
          var encryptFacebookId = Crypto.createHmac(
            "sha256",
            "kasihnusantaraFacebookId_api"
          )
            .update(req.body.data.facebookId)
            .digest("hex");

          User.findOne({
            where: {
              email: req.body.data.email,
              isFacebook: encryptFacebookId,
            },
          })
            .then((dataUser) => {
              if (dataUser) {
                // Jika ada
                const tokenJwt = createJWTToken({
                  userId: dataUser.id,
                  email: dataUser.email,
                });

                return res.status(200).send({
                  dataUser,
                  token: tokenJwt,
                });
              } else {
                // Jika belum ada
                req.body.data.isFacebook = encryptFacebookId;
                // req.body.data.role = 'User'
                req.body.data.verified = 1;
                req.body.data.userImage = "/defaultPhoto/defaultUser.png";
                req.body.data.lastLogin = new Date();
                req.body.data.createdAt = new Date();
                req.body.data.updatedAt = new Date();
                req.body.data.phoneNumber = "0";

                delete req.body.data.facebookId;

                User.create(req.body.data)
                  .then((results) => {
                    User.findOne({
                      where: {
                        isFacebook: encryptFacebookId,
                      },
                    })
                      .then((dataUserInsert) => {
                        const tokenJwt = createJWTToken({
                          userId: dataUserInsert.id,
                          email: dataUserInsert.email,
                        });

                        return res.status(200).send({
                          dataUser: dataUserInsert,
                          token: tokenJwt,
                        });
                      })
                      .catch((err) => {
                        return res.status(500).json({
                          message:
                            "There's an error on the server. Please contact the administrator.",
                          error: err.message,
                        });
                      });
                  })
                  .catch((err) => {
                    return res.status(500).json({
                      message:
                        "There's an error on the server. Please contact the administrator.",
                      error: err.message,
                    });
                  });
              }
            })
            .catch((err) => {
              return res.status(500).json({
                message:
                  "There's an error on the server. Please contact the administrator.",
                error: err.message,
              });
            });
        }
      })
      .catch((err) => {
        return res.status(500).json({
          message:
            "There's an error on the server. Please contact the administrator.",
          error: err.message,
        });
      });
  },

  loginWithGoogle: (req, res) => {
    let encryptGoogleId = Crypto.createHmac(
      "sha256",
      "kasihnusantaraGoogleId_api"
    )
      .update(req.body.data.googleId)
      .digest("hex");

    User.findOne({
      where: {
        email: req.body.data.email,
        isGoogle: encryptGoogleId,
      },
    })
      .then((results) => {
        console.log(results);
        if (results !== null) {
          // Kalo sudah pernah mendaftar dengan email google, dan user ingin mencoba
          // login lewat gmail, maka muncul errornya

          const tokenJwt = createJWTToken({
            userId: results.dataValues.id,
            email: results.dataValues.email,
          });

          // console.log(dataUser.id)

          return res.status(200).send({
            dataUser: results.dataValues,
            token: tokenJwt,
          });
        } else {
          return res.status(500).send({
            status: "error",
            message: `Anda Harus mendaftarkan email ini dengan Sign Up With Gmail= ${req.body.data.email}`,
          });
        }
      })
      .catch((err) => {
        return res.status(500).json({
          message:
            "There's an error on the server. Please contact the administrator.",
          error: err.message,
        });
      });
  },

  loginWithFacebook: (req, res) => {
    let encryptFacebookId = Crypto.createHmac(
      "sha256",
      "kasihnusantaraFacebookId_api"
    )
      .update(req.body.data.facebookId)
      .digest("hex");

    User.findOne({
      where: {
        email: req.body.data.email,
        isFacebook: encryptFacebookId,
      },
    })
      .then((results) => {
        console.log(results);
        if (results !== null) {
          // Kalo sudah pernah mendaftar dengan email google, dan user ingin mencoba
          // login lewat gmail, maka muncul errornya

          const tokenJwt = createJWTToken({
            userId: results.dataValues.id,
            email: results.dataValues.email,
          });

          // console.log(dataUser.id)

          return res.status(200).send({
            dataUser: results.dataValues,
            token: tokenJwt,
          });
        } else {
          return res.status(500).send({
            status: "error",
            message: `Anda Harus mendaftarkan email ini dengan Sign Up With Facebook  = ${req.body.data.email}`,
          });
        }
      })
      .catch((err) => {
        return res.status(500).json({
          message:
            "There's an error on the server. Please contact the administrator.",
          error: err.message,
        });
      });
  },

  // getSubscription : (req,res) => {
  //     User.findOne({
  //         where: {
  //             email: req.body.email
  //         },
  //         attributes: ['subscriptionStatus', 'subscriptionNominal']
  //     }).then((results) => {
  //         res.send(results)
  //     })
  // },

  // applySubscription : (req,res) => {
  //     var { subscriptionNominal, email, reminderDate } = req.body
  //     // console.log(req.body)
  //     User.update({
  //         subscriptionStatus: 1,
  //         subscriptionNominal,
  //         reminderDate
  //     },{
  //         where: { email }
  //     })
  //     .then(() => {
  //         console.log('masuk')
  //         res.send('success')
  //     })
  // },

  getSubscription: (req, res) => {
    // cek user ketika user udah subscribe ke scholarship atau belum.
    // berarti butuh get dari Subscription dan butuh req.user.userId dan params.id untuk get data subscriptionnya.

    // User.findOne({
    //     where: {
    //         email: req.body.email
    //     },
    //     attributes: ['subscriptionStatus', 'subscriptionNominal']
    // }).then((results) => {
    //     res.send(results)
    // })
    Subscription.findOne({
      attributes: ["nominalSubscription"],
      where: {
        userId: req.user.userId,
        scholarshipId: req.params.id,
      },
    })
      .then((result) => {
        console.log(result);
        // let status;
        // if(result) {
        //     console.log('User ini telah subscribe')
        //     status = 1
        // } else {
        //     console.log('User ini belum subscribe ke scholarship ini')
        //     status = 0
        // }
        return res.status(200).send({
          result,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },

  // applySubscription : (req,res) => {
  //     var { subscriptionNominal, email, reminderDate } = req.body
  //     // console.log(req.body)
  //     User.update({
  //         subscriptionStatus: 1,
  //         subscriptionNominal,
  //         reminderDate
  //     },{
  //         where: { email }
  //     })
  //     .then(() => {
  //         // console.log('masuk')
  //         res.send('success')
  //     })
  // },

  reminderInvoice: async (req, results) => {
    // RUN SEKALI / HARI
    // console.log('reminderINvoice')
    // console.log(req)
    try {
      var res = await Subscription.findAll({
        where: {
          [Op.and]: [
            sequelize.where(
              sequelize.fn(
                "datediff",
                sequelize.col("remainderDate"),
                sequelize.fn("NOW")
              ),
              {
                [Op.eq]: 0, // OR [Op.gt] : 5
              }
            ),
            {
              isCancelled: 0,
              monthLeft: {
                [Op.gt]: 0,
              },
            },
          ],
        },

        attributes: [
          "id",
          "scholarshipId",
          "nominalSubscription",
          "remainderDate",
          "monthLeft",
          [sequelize.col("scholarship.judul"), "judulscholarship"],
          [sequelize.col("scholarship.nominal"), "nominalscholarship"],
          [sequelize.col("scholarship->student.name"), "namamurid"],
        ],
        include: [
          {
            model: User,
            required: true,
            attributes: [["nama", "username"], "email"],
            where: {
              verified: 1,
            },
          },
          {
            model: scholarship,
            required: true,
            attributes: [],
            where: {
              isOngoing: 1,
            },
            include: [
              {
                model: Student,
                attributes: [],
                required: true,
              },
            ],
          },
        ],
      });
      console.log(res);

      // console.log(res[0].dataValues.User.dataValues)

      var listname = res.map((val) => {
        // return val.dataValues
        var results = {
          ...val.dataValues,
          ...val.dataValues.User.dataValues,
          date: new Date(),
          deadline: new Date(),
        };
        delete results.User;
        return results;
      });

      var listid = res.map((val) => {
        return val.id;
      });
      console.log(listid);
      console.log("ini list id");
      console.log(listname);

      // console.log(listname)

      // console.log(listname)

      const loop = async () => {
        console.log("start");
        for (var i = 0; i < listname.length; i++) {
          console.log(listname[i]);
          // { email , nama, id , subscriptionNominal, date} = obj
          await createPdf(listname[i], async (PDF_STREAM, obj) => {
            console.log("async");
            await mailInvoice(obj, PDF_STREAM);
          });
          console.log("finish user ", i);

          // console.log(listname[i].email)

          // testcontroller.getemail(listname[i].email)
          // testcontroller.getemail(listname[i].email)
        }
      };
      await loop();

      Subscription.update(
        {
          monthLeft: sequelize.literal("monthLeft - 1"),
          remainderDate: sequelize.fn(
            "ADDDATE",
            sequelize.col("remainderDate"),
            sequelize.literal("INTERVAL 1 MONTH")
          ),
        },
        {
          where: {
            // [Op.and] : [
            //     sequelize.where(sequelize.fn('datediff', sequelize.col('reminderDate') ,  sequelize.fn("NOW")), {
            //         [Op.eq] : 0 // today is the user reminder date
            //     }),
            //     {
            isCancelled: 0,
            id: {
              [Op.in]: listid,
            },

            //     }
            // ]
          },
        }
      )
        .then((res) => {
          console.log("------------------********************* finish success");

          // console.log(res)

          // ----------------------------------------------------------------------------------------------------------
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
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  },
  projectCheck: (req, results) => {
    // Project.update(
    //     {
    //         isGoing : 0
    //     },
    //     {
    //         include : [
    //             {
    //                 model : Payment,
    //                 require : true,
    //                 // where : {
    //                 //     [Op.or] : [
    //                 //         sequelize.where(sequelize.fn('SUM', sequelize.col('nominal')), {
    //                 //             [Op.gte] :  sequelize.col('totalTarget')
    //                 //         })
    //                 //     ]
    //                 // },
    //                 // group : ['projectId']
    //             }

    //         ],
    //         where : {
    //             // [Op.or] : [
    //             //     // TANGGAL YANG EXPIRED
    // sequelize.where(sequelize.fn('datediff', sequelize.col('projectEnded') ,  sequelize.fn("NOW")), {
    //     [Op.lte] : 0 // OR [Op.gt] : 5
    // }),
    //             //     // sequelize.where(sequelize.fn('SUM', sequelize.col('Payment.nominal')), {
    //             //     //     [Op.gte] :  sequelize.col('totalTarget')
    //             //     // })

    //             //     // TOTAL SUM PAYMENT PER (PROJECT ID ) lebih besar dari TotalTarget

    //             // ],
    //             isDeleted : 0,
    //             isCancelled : 0
    //         },
    //         having :
    // sequelize.where(sequelize.fn('SUM', sequelize.col('Payment.nominal')), {
    //     [Op.gte]: 5,
    //   })

    //     },

    //     ).then((res)=>{
    //         console.log(res)

    //         console.log('success Project Check')
    //     }).catch((err)=>{
    //         console.log('err')
    //         console.log(err)
    //     })

    // BNEER

    Project.findAll({
      attributes: [
        "id",
        [
          sequelize.fn("SUM", sequelize.col("Payments.nominal")),
          "totalPayment",
        ],
        "projectEnded",
        "totalTarget",
        [
          sequelize.fn(
            "datediff",
            sequelize.col("projectEnded"),
            sequelize.fn("NOW")
          ),
          "SisaHari",
        ],
      ],
      include: [
        {
          model: Payment,
          required: false,
        },
      ],
      where: {
        // [Op.or] : [
        //     sequelize.where(totalTarget, {
        //         [Op.gte]: sequelize.fn('SUM', sequelize.col('Payments.nominal')),
        //     })
        // ],
        isDeleted: 0,
        isCancelled: 0,
        isGoing: 1,
        // totalTarget : {
        //     [Op.lte] : sequelize.fn('SUM', sequelize.col('Payments.nominal'))
        // }
      },
      group: ["id"],
      having: {
        [Op.or]: [
          // sequelize.where(sequelize.fn('datediff', sequelize.col('projectEnded') ,  sequelize.fn("NOW")), {
          //     [Op.lte] : 0 // OR [Op.gt] : 5
          // }),
          {
            SisaHari: {
              [Op.lte]: 0,
            },
          },
          {
            totalTarget: {
              [Op.lte]: sequelize.col("totalPayment"),
              //sequelize.fn('SUM', sequelize.col('Payments.nominal'))
            },
          },
        ],
      },
    })
      .then((res) => {
        console.log(res);
        var listproject = res.map((val) => {
          console.log(val.dataValues);
          return val.dataValues.id;
        });
        console.log(listproject);

        Project.update(
          {
            isGoing: 0,
          },
          {
            where: {
              id: {
                [Op.in]: listproject,
              },
            },
          }
        )
          .then((res) => {
            console.log("success");
          })
          .catch((err) => {
            console.log("error");
          });
      })
      .catch((err) => {
        console.log("errors");
      });

    // BNEER
  },
  scholarshipCheck: (req, results) => {
    scholarship
      .findAll({
        subQuery: false,
        attributes: [
          "id",

          "nominal",
          "durasi",

          "studentId",

          "scholarshipStart",
          "scholarshipEnded",
          [
            sequelize.fn(
              "datediff",
              sequelize.col("scholarshipEnded"),
              sequelize.fn("NOW")
            ),
            "SisaHari",
          ],
          // [sequelize.fn('SUM', sequelize.col('Subscriptions.nominalSubscription')), 'currentSubs'],
          [
            sequelize.fn("SUM", sequelize.col("Payments.nominal")),
            "totalPayment",
          ],
          [
            sequelize.fn("COUNT", sequelize.col("Payments.id")),
            "jumlahdonation",
          ],
        ],

        include: [
          // {
          //     model : Subscription,
          //     attributes :   ['nominalSubscription',[sequelize.fn('SUM', sequelize.col('nominalSubscription')), 'currentSubs']],

          //     separate : true,
          //     group : ['scholarshipId']
          //     // include : [
          //     //     {
          //     //         model : scholarship,
          //     //         attributes : [],
          //     //         where : {
          //     //             isOngoing : 1
          //     //         }
          //     //     }
          //     // ],

          // },
          {
            model: Payment,
            required: false,
            attributes: [],
          },
        ],
        where: {
          isOngoing: 1,
          // isDeleted : 0,
          // isGoing : 1
        },
        group: ["id"],
        having: {
          [Op.or]: [
            {
              SisaHari: {
                [Op.lte]: 0,
              },
            },
            // sequelize.where(sequelize.fn('datediff', sequelize.col('scholarshipEnded') ,  sequelize.fn("NOW")), {
            //     [Op.lte] : 0 // OR [Op.gt] : 5
            // }),
            {
              nominal: {
                [Op.lte]: sequelize.col("totalPayment"),
                //sequelize.fn('SUM', sequelize.col('Payments.nominal'))
              },
            },
          ],
        },
      })
      .then((res) => {
        console.log(res);

        var listscholarship = res.map((val) => {
          console.log(val.dataValues);
          return val.dataValues.id;
        });
        console.log(listscholarship);

        scholarship
          .update(
            {
              isOngoing: 0,
            },
            {
              where: {
                id: {
                  [Op.in]: listscholarship,
                },
              },
            }
          )
          .then((res) => {
            console.log("success");
          })
          .catch((err) => {
            console.log("error");
          });

        // var listscholarship = res.map((val)=>{

        //         if(val.dataValues.Subscriptions.length !== 0){
        //             var hasil = {...val.dataValues, ...val.dataValues.Subscriptions[0].dataValues}
        //             hasil.grandtotal = parseInt(hasil.totalpayment) + parseInt(hasil.currentSubs)
        //         }else{
        //             var hasil = {...val.dataValues }
        //             hasil.grandtotal = parseInt(hasil.totalpayment)
        //         }

        //         // if(parseInt(hasil.totalpayment) + parseInt(hasil.currentSubs) >= hasil.nominal || hasil.SisaHari === 0){
        //         //     return hasil.id
        //         // }
        //         delete hasil.Subscriptions
        //         return hasil

        // })

        // console.log(listscholarship)

        // listscholarship = listscholarship.filter(function(e){
        //     return e.grandtotal >= e.nominal || e.SisaHari === 0
        // })

        // var scholarshipStop = listscholarship.map((e)=> e.id)
        // console.log(scholarshipStop)

        // scholarship.update({
        //     isOngoing : 0
        // }, {
        //     where : {
        //         id : {
        //             [Op.in] : scholarshipStop
        //         }
        //     }
        // }).then((res)=>{
        //     console.log('success')
        // }).catch((err)=>{
        //     console.log('error')
        // })
      })
      .catch((err) => {
        console.log(err);
        console.log("errors");
      });
  },

  getDataUser: (req, res) => {
    User.findOne({
      where: {
        id: req.user.userId,
      },
    })
      .then((result) => {
        return res.status(200).send(result);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  updateProfilePic: (req, res) => {
    try {
      let path = `/users`; //file save path
      const upload = uploader(path, "KasihNusantara").fields([
        { name: "imageUser" },
      ]); //uploader(path, 'default prefix')

      upload(req, res, (err) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Upload picture failed !", error: err.message });
        }

        // Setelah upload berhasil
        // proses parse data JSON karena kita ngirim file gambar
        // const data = JSON.parse(req.body.data);
        /* 
                 `createdAt` default value ?, 
                `updatedAt` default value */

        const { imageUser } = req.files;

        const imagePath = imageUser
          ? path + "/" + imageUser[0].filename
          : "/defaultPhoto/defaultUser.png";

        User.update(
          {
            userImage: imagePath,
          },
          {
            where: {
              id: req.user.userId,
            },
          }
        )
          .then((result) => {
            User.findOne({
              where: {
                id: req.user.userId,
              },
            })
              .then((resultAkhir) => {
                return res.status(200).send(resultAkhir);
              })
              .catch((err) => {
                return res.status(500).send(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  editPhoneNumber: (req, res) => {
    console.log(req.body.phoneNumber);
    User.update(
      {
        phoneNumber: req.body.phoneNumber,
      },
      {
        where: {
          id: req.user.userId,
        },
      }
    )
      .then((results) => {
        User.findOne({
          where: {
            id: req.user.userId,
          },
        })
          .then((resultAkhir) => {
            return res.status(200).send(resultAkhir);
          })
          .catch((err) => {
            return res.status(500).send(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  },

  getDonationUser: (req, res) => {
    Payment.findAndCountAll({
      //   limit:parseInt(limit),
      //   // limit : 10,
      //   offset:offset,
      // subQuery: false,
      attributes: [
        "nominal",
        [sequelize.col("scholarship.judul"), "judulScholarship"],
        [sequelize.col("scholarship.id"), "scholarshipId"],
        //   [sequelize.col('scholarship->student.name'), 'namaMurid'],
        //   [sequelize.col('scholarship->student.studentImage'), 'fotoMurid'],
        [sequelize.col("user.nama"), "donators"],
        //   'order_id',
        "komentar",
        "createdAt",
        "id",
      ],
      where: {
        isRefund: 0,
        isDeleted: 0,
        // scholarshipId : req.body.id
        // statusPayment : 'settlement'
      },
      include: [
        {
          model: User,
          required: false,
          attributes: [],
          where: {
            id: req.user.req.user.userId,
          },
        },
        {
          model: scholarship,
          required: true,
          attributes: [],
        },
      ],
      order: [["createdAt", "DESC"]],
    })
      .then((result) => {
        console.log("erresult");
        console.log(result);
        console.log(result.count);

        //   return res.status(200).send({result : result.rows, count : result.count})
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).send({ message: err });
      });
  },

  getScholarshipByUserId: (req, res) => {
    console.log(
      "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
    );
    scholarship
      .findAll({
        subQuery: false,
        attributes: [
          "id",
          "judul",
          "studentId",
          "currentValue",
          // [sequelize.col('Student.id'), 'siswaId'],
          // [sequelize.col('Student.name'), 'namaSiswa'],
          // [sequelize.col('Student.status'), 'status'],
          // [sequelize.col('Student.alamat'), 'alamat'],
          // [sequelize.col('Student.gender'), 'gender'],
          // [sequelize.col('Student.tanggalLahir'), 'tanggalLahir'],
          // [sequelize.col('Student.pendidikanTerakhir'), 'pendidikanTerakhir'],
          // [sequelize.col('Student.studentImage'), 'studentImage'],
          // [sequelize.col('Student.provinsi'), 'provinsi'],
          // [sequelize.col('Student.story'), 'story'],
          // [sequelize.col('Student.alamatSekolah'), 'alamatSekolah'],
          // [sequelize.col('Student.biayaSekolah'), 'biayaSekolah'],
          // [sequelize.col('Student.namaSekolah'), 'namaSekolah'],
          // [sequelize.col('Student.teleponSekolah'), 'teleponSekolah'],
          // [sequelize.col('Student.kelas'), 'kelas'],

          // [sequelize.col('Student.shareDescription'), 'shareDescription'],
          // [sequelize.col('Student.kartuSiswa'), 'kartuSiswa'],
          // [sequelize.col('Student.raportTerakhir'), 'raportTerakhir'],
          // [sequelize.col('Student.kartuKeluarga'), 'kartuKeluarga'],
          // [sequelize.col('Student.createdAt'), 'studentCreated'],

          // [sequelize.col('Student->school.nama'), 'namaSekolah'],

          // [sequelize.fn('SUM', sequelize.col('Payments.nominal')), 'totaldonation'],
          [
            sequelize.fn("COUNT", sequelize.col("Payments.id")),
            "jumlahdonation",
          ],
        ],

        include: [
          {
            model: Student,
            attributes: [
              ["id", "idSiswa"],
              ["name", "namaSiswa"],
              "status",
              "alamat",
              "gender",
              "tanggalLahir",
              "pendidikanTerakhir",
              "studentImage",
              "provinsi",
              "story",
              "biayaSekolah",
              "kelas",
              "shareDescription",
              "nisn",
              "kegiatanSosial",
              ["createdAt", "studentCreated"],
            ],
            include: [
              {
                model: school,
                attributes: [
                  ["nama", "namaSekolah"],
                  ["alamat", "alamatSekolah"],
                  "cabangBank",
                  "bank",
                  "email",
                  ["telepon", "teleponSekolah"],
                  "namaPemilikRekening",
                  "nomorRekening",
                ],
              },
            ],
          },

          {
            model: Payment,
            required: false,
            attributes: [],
          },
        ],
        where: {
          userId: req.user.userId,
          isOngoing: 1,
        },
        group: ["id"],
      })
      .then((results) => {
        return res.status(200).send(results);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  uploadVideoByAdmin: (req, res) => {
    // console.log(" Masuk ke dalam upload video ")

    //    try {
    //         let storage = multer.memoryStorage();
    //         let upload = multer({ storage }).fields([
    //                     {name: 'courses_video'},
    //                 ]);

    //         upload(req, res, (err) => {
    //             const { courses_video } = req.files;

    //             let formData = new FormData();

    //             const { title } = JSON.parse(req.body.data);

    //             console.log(req.files)

    //             formData.append('title', title)
    //             formData.append('source_video', fs.createReadStream(courses_video[0].buffer));

    //             let options = {
    //                 headers: {
    //                     "Accept" : '*/*',
    //                     "SproutVideo-Api-Key" : "b68c99f476953bf21b46bc034226b20f",
    //                     "Content-Type" : "multipart/form-data; boundary=" + formData.getBoundary(),
    //                     "Content-Length": formData.getLengthSync(),
    //                 }
    //             }

    //             axios.post(`https://api.sproutvideo.com/v1/videos`, formData, options, )
    //             .then((res) => {
    //                 console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
    //                 console.log(res)
    //                 // console.log(res.response.data);
    //                 // console.log(res.response.headers);
    //             })
    //             .catch((err) => {
    //                 console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
    //                 console.log(err)
    //                 // console.log(err.response.data);
    //                 // console.log(err.response.headers);
    //             })

    //         })
    //    }
    //    catch (error) {
    //         console.log(error)
    //         return res.status(500).json({ message: "There's an error on the server. Please contact the administrator.", error: error.message });
    //    }

    try {
      const path = "/student/video";
      const upload = uploader(path, "courses_video").fields([
        { name: "courses_video" },
        { name: "image_video" },
      ]);

      upload(req, res, (err) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Upload picture failed !", error: err.message });
        }

        const { courses_video, image_video } = req.files;
        console.log(req.files);

        const videoPath = courses_video
          ? path + "/" + courses_video[0].filename
          : "/defaultPhoto/defaultUser.png";
        const imagePath = image_video
          ? path + "/" + image_video[0].filename
          : "/defaultPhoto/defaultUser.png";

        const { title, slug } = JSON.parse(req.body.data);

        // // Simpan database

        let formData = new FormData();

        formData.append("title", courses_video[0].filename);
        formData.append("source_video_url", `${URL_API}${videoPath}`);

        let options = {
          headers: {
            "SproutVideo-Api-Key": "2e6f3e845d50d6a94c25a407280bb687",
            "Content-Type":
              "multipart/form-data; boundary=" + formData.getBoundary(),
            "Content-Length": formData.getLengthSync(),
          },
        };

        // let options = {
        //     headers: {
        //         "SproutVideo-Api-Key" : "b68c99f476953bf21b46bc034226b20f",
        //         "Content-Type" : "multipart/form-data",
        //     }
        // }

        axios
          .post(`https://api.sproutvideo.com/v1/videos`, formData, options)
          .then((resultVideo) => {
            console.log(resultVideo);
            console.log(videoPath);

            console.log(resultVideo.data);
            // let videoLinkDB = `<div style="position:relative;height:0;padding-bottom:56.25%"><iframe class='sproutvideo-player' src='https://videos.sproutvideo.com/embed/${resultVideo.data.id}/${resultVideo.data.security_token}' style='position:absolute;width:100%;height:100%;left:0;top:0' frameborder='0' allowfullscreen></iframe></div>`

            coursesvideo
              .create({
                title,
                slug,
                // locationPath: videoLinkDB,
                thumbnail_video: imagePath,
                videoSproutId: resultVideo.data.id,
                securityTokenSprout: resultVideo.data.security_token,
                durationVideo: resultVideo.data.duration,
              })
              .then((results) => {
                // fs.unlinkSync('./public', videoPath);
                return res.status(200).send({ message: "Success" });
              })
              .catch((err) => {
                return res.status(500).send({ message: "Failed" });
              });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message:
          "There's an error on the server. Please contact the administrator.",
        error: error.message,
      });
    }

    //         // var config = {
    //         //     method: 'post',
    //         //     url: 'https://api.sproutvideo.com/v1/videos',
    //         //     headers: {
    //         //       'SproutVideo-Api-Key': 'b68c99f476953bf21b46bc034226b20f',
    //         //       ...formData.getHeaders()
    //         //     },
    //         //     data : formData
    //         //   };

    //         //   axios(config)
    //         //   .then(function (response) {
    //         //     console.log(JSON.stringify(response.data));
    //         //   })
    //         //   .catch(function (error) {
    //         //     console.log(error);
    //         //   });

    //         // axios.get(`https://api.sproutvideo.com/v1/videos`, options)
    //         // .then((res) => {
    //         //     console.log(res.data.videos)
    //         // })
    //         // .catch((err) => {
    //         //     console.log(err)
    //         // })

    //         // coursesvideo.create({
    //         //     title,
    //         //     thumbnail_video: image_videoPath,
    //         //     slug,
    //         //     locationPath
    //         // })
    //         // .then((results) => {
    //         //     res.status(200).send({ message: 'Success' })
    //         // })
    //         // .catch((err) => {
    //         //     res.status(500).send({ message: 'Failed' })
    //         // })

    // console.log(req.body)
    // const { title, slug, locationPath } = req.body;
    // // Simpan database
    // coursesvideo.create({
    //     title,
    //     // locationPath: courses_videoPath,
    //     slug,
    //     locationPath
    // })
    // .then((results) => {
    //     res.status(200).send({ message: 'Success' })
    // })
    // .catch((err) => {
    //     res.status(500).send({ message: 'Failed' })
    // })
  },

  getAllVideo: (req, res) => {
    coursesvideo
      .findAll({
        attributes: [
          [Sequelize.fn("DISTINCT", Sequelize.col("title")), "title"],
          "thumbnail_video",
          "slug",
        ],
      })
      .then((results) => {
        res.status(200).send({ message: "Success", results });
      })
      .catch((err) => {
        res.status(500).send({ message: "Failed" });
      });
  },

  checkAvailabilityVideo: (req, res) => {
    coursesvideo
      .findAll({
        where: {
          slug: req.body.slug,
        },
      })
      .then((result) => {
        res.status(200).send({ message: "Success", result });
      })
      .catch((err) => {
        res.status(500).send({ message: "Failed" });
      });
  },

  getSelectedVideos: (req, res) => {
    // console.log(req.params)
    // console.log(req.params.title)
    // let videoFile =  `${__dirname}/../public/student/video/${req.params.title}`;

    // // let filename = path.basename(file);
    // // // console.log(filename)
    // // let mimetype = mime.lookup(file);
    // // // console.log(mimetype)

    // // res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    // // res.setHeader('Content-type', mimetype);

    // // let filestream = fs.createReadStream(file);
    // // filestream.pipe(res);

    // var stat = fs.statSync(videoFile);
    // var total = stat.size;

    // console.log('_________________________+++++ASASS')
    // console.log(req.headers.range)

    // if (req.headers.range) {
    //     // meaning client (browser) has moved the forward/back slider
    //     // which has sent this request back to this server logic ... cool

    //     console.log('Ada req headers range')
    //     var range = req.headers.range;
    //     var parts = range.replace(/bytes=/, "").split("-");
    //     var partialstart = parts[0];
    //     var partialend = parts[1];
    //     var maxChunk = 1024 * 1024;

    //     var start = parseInt(partialstart, 10);
    //     var end = partialend ? parseInt(partialend, 10) : total-1;
    //     var chunksize = (end-maxChunk)+1;
    //     console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);

    //     var file = fs.createReadStream(videoFile, {start: start, end: end});
    //     res.writeHead(206, { 'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': 'video/mp4' });
    //     file.pipe(res);

    // }
    // else {
    //     console.log('Ga ada req.header')
    //     console.log('ALL: ' + total);
    //     res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'video/mp4' });
    //     fs.createReadStream(videoFile).pipe(res);
    // }

    const { slug, topic_name } = req.body;

    coursesvideo
      .findOne({
        where: {
          slug,
          topic_name,
        },
      })
      .then((result) => {
        res.status(200).send({ message: "Success", result });
      })
      .catch((err) => {
        res.status(500).send({ message: "Failed" });
      });
  },

  checkSubscriptionVideo: (req, res) => {
    const { videoProgram } = req.body;

    console.log(req.body);
    console.log(req.user.userId);
    userVideoSubscription
      .findAll({
        where: {
          programName: videoProgram,
          userId: req.user.userId,
        },
      })
      .then((checkSubscriptionLength) => {
        console.log(checkSubscriptionLength);
        coursesvideo
          .findAll({
            where: {
              title: videoProgram,
            },
          })
          .then((result) => {
            if (checkSubscriptionLength.length !== 0) {
              res.status(200).send({ message: "Subscribe", result });
            } else {
              res.status(200).send({ message: "Not Subscribe", result });
            }
          })
          .catch((err) => {
            res.status(500).send({ message: "Failed" });
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ message: "Failed" });
      });
  },

  subcriptionVideo: (req, res) => {
    const { videoId, programName } = req.body;
    console.log(videoId);
    userVideoSubscription
      .create({
        userId: req.user.userId,
        programName,
      })
      .then((result) => {
        console.log(result);
        return res.status(200).send({ message: "Success" });
      })
      .catch((result) => {
        return res.status(500).send({ message: "Failed" });
      });
  },

  getQuizWithCode: (req, res) => {
    const { code } = req.body;
    quiz
      .findOne({
        include: [
          {
            model: question,
            required: false,
            // attributes: [],
          },
        ],
        where: {
          code,
        },
      })
      .then((results) => {
        return res.status(200).send({
          quiz: results.dataValues,
          question: results.dataValues.questions,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },

  webHooksVideo: (req, res) => {
    // console.log(req.body);

    // data yang didapat dari sproutvideo yang dikirim dari backend dia ke backend kita.

    console.log(req.body.title);

    if (req.body.state === "deployed") {
      coursesvideo
        .update(
          {
            durationVideo: req.body.state,
          },
          {
            where: {
              videoSproutId: req.body.id,
            },
          }
        )
        .then((results) => {
          const path = "/student/video"; // path video
          // kita gunakan nama video yang di server menjadi title di video pada hostingan.

          fs.unlinkSync(`./public/${path}`, req.body.title);
          return res
            .status(200)
            .send({ message: "Success Update and Delete Video" });
        })
        .catch((err) => {
          return res.status(500).send({ message: "Failed" });
        });
    }

    console.log(res.body);
    // console.log(res.body.title);
    // console.log(req.body.data);
  },
};
