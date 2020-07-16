const {
  Sequelize,
  sequelize,
  Payment,
  User,
  Project,
  scholarship,
  school,
  Student,
  Payout,
  donation,
} = require("../models");
const midtransClient = require("midtrans-client");
const moment = require("moment");
const Axios = require("axios");

// Development
// const snap = new midtransClient.Snap({
//     isProduction    : false,
//     serverKey       : 'SB-Mid-server-gX4FwJuHKjMqZaQvd2pwT2GX',
//     clientKey       : 'SB-Mid-client-lM5IFUJ3Ozq3_ABW'
// })

// Production
const snap = new midtransClient.Snap({
  isProduction: true,
  serverKey: "Mid-server-6xImsUTrxyWWRCZXeolqSrFI",
  clientKey: "Mid-client-o2dbxrIvWMsvu5sG",
});

const core = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: "SB-Mid-server-Dr8HK_lJ4cuEZi4rUgNcsDUR",
  clientKey: "SB-Mid-client-Ttge99xVU4AOz44T",
});

module.exports = {
  //====================// midtrans //====================
  getSnapMd: (req, res) => {
    // let { projectId, userId, komentar, anonim, scholarshipId, paymentSource} = req.body.userData
    let { gross_amount, order_id } = req.body.parameter.transaction_details;
    let { parameter } = req.body;
    console.log("masuk get token midtrans");
    console.log(req.body);
    console.log(order_id);
    var Date = moment().format("YYMMDD");
    var randInt = Math.floor(Math.random() * (999 - 100 + 1) + 100);
    // Halo jjhjhjhjkhhjhjj
    // kol md 6
    snap.createTransaction(parameter).then((transaction) => {
      transactionToken = transaction.token;
      // console.log('transactionToken: ', transactionToken)

      //######## INSERT DATABASE
      // Payment.create({
      //     paymentType: 'pending',
      //     nominal: gross_amount,
      //     statusPayment: 'pending',
      //     paymentSource,
      //     projectId: projectId ? projectId : null,
      //     scholarshipId: scholarshipId ? scholarshipId : null,
      //     userId: userId,
      //     isRefund: '0',
      //     isDeleted: '0',
      //     order_id: order_id,
      //     komentar: komentar,
      //     isAnonim: anonim
      // }).then(()=>{
      //     // if paymentSource === Subscription, subscription update remainderDate + 1 month from column (or now), (if settlement)
      //     Payment.findAll()
      //     .then((result)=>{
      //         // console.log(result)
      //         res.send(result)

      //     })
      // }).catch((err)=>{
      //     console.log(err)
      // })
      return res.status(200).send({
        transactionToken,
        order_id: parameter.transaction_details.order_id,
      });
    });
  },

  getlastid: (req, res) => {
    Payment.findOne({
      attributes: ["id"],
      order: [["id", "DESC"]],
    }).then((result) => {
      console.log(result);
      return res.status(200).send(result);
    });
  },

  getlastdonationid: (req, res) => {
    console.log("masuk");
    donation
      .findOne({
        attributes: ["id"],
        order: [["id", "DESC"]],
      })
      .then((result) => {
        console.log(result);
        return res.status(200).send(result);
      });
  },

  addPayment: (req, res) => {
    //######## INSERT DATABASE
    console.log("------------------------------> Masuk Add payment");
    const {
      userId,
      paymentType,
      gross_amount,
      statusPayment,
      projectId,
      scholarshipId,
      komentar,
      anonim,
      order_id,
      paymentSource,
      noPembayaran,
    } = req.body;

    return sequelize
      .transaction(function (t) {
        return Payment.findOne(
          {
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
            where: {
              order_id,
            },
          },
          { transaction: t }
        )
          .then((result) => {
            // console.log(result)
            if (!result) {
              console.log("insert--------");
              Payment.create({
                paymentType,
                nominal: gross_amount,
                statusPayment,
                paymentSource,
                projectId: projectId ? projectId : null,
                scholarshipId: scholarshipId ? scholarshipId : null,
                userId: userId,
                isRefund: "0",
                isDeleted: "0",
                order_id: order_id,
                komentar: komentar,
                isAnonim: anonim,
                noPembayaran,
              })
                .then(() => {
                  // Payment.findAll()
                  // .then((result)=>{
                  //     console.log(result)
                  //     return res.status(200).send({message: 'create Payment Success ', result})
                  // })
                  // scholarship.update(
                  //     {
                  //         currentValue : sequelize.literal(`currentValue + ${gross_amount}`)
                  //     },
                  //     {
                  //         where :
                  //             {
                  //                 id : scholarshipId
                  //             }
                  //     }
                  // )
                  // .then((res)=>{
                  //      console.log('success')
                  //      console.log(res)
                  // })
                  // .catch((err)=>{
                  //     console.log(err)
                  // })
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          })
          .catch((err) => {
            console.log("tidak ada");
            console.log(err);
          });
      })
      .then((results) => {
        return res.status(200).send({ message: "message success", results });
      })
      .catch((error) => {
        return res.status(500).send({ message: "theres an error", error });
      });
  },

  addDonationToYayasan: (req, res) => {
    //######## INSERT DATABASE
    console.log("------------------------------> Masuk Add payment");
    const {
      userId,
      paymentType,
      gross_amount,
      statusPayment,
      projectId,
      scholarshipId,
      komentar,
      anonim,
      order_id,
      paymentSource,
      noPembayaran,
    } = req.body;

    return sequelize
      .transaction(function (t) {
        return donation
          .findOne(
            {
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
              where: {
                order_id,
              },
            },
            { transaction: t }
          )
          .then((result) => {
            // console.log(result)
            if (!result) {
              console.log("insert--------");
              donation
                .create({
                  paymentType,
                  nominal: gross_amount,
                  statusPayment,
                  paymentSource,
                  projectId: projectId ? projectId : null,
                  scholarshipId: scholarshipId ? scholarshipId : null,
                  userId: userId,
                  isRefund: "0",
                  isDeleted: "0",
                  order_id: order_id,
                  komentar: komentar,
                  isAnonim: anonim,
                  noPembayaran,
                })
                .then(() => {
                  // Payment.findAll()
                  // .then((result)=>{
                  //     console.log(result)
                  //     return res.status(200).send({message: 'create Payment Success ', result})
                  // })
                  // scholarship.update(
                  //     {
                  //         currentValue : sequelize.literal(`currentValue + ${gross_amount}`)
                  //     },
                  //     {
                  //         where :
                  //             {
                  //                 id : scholarshipId
                  //             }
                  //     }
                  // )
                  // .then((res)=>{
                  //      console.log('success')
                  //      console.log(res)
                  // })
                  // .catch((err)=>{
                  //     console.log(err)
                  // })
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          })
          .catch((err) => {
            console.log("tidak ada");
            console.log(err);
          });
      })
      .then((results) => {
        return res.status(200).send({ message: "message success", results });
      })
      .catch((error) => {
        return res.status(500).send({ message: "theres an error", error });
      });
  },

  getStatus: (req, res) => {
    const { order_id } = req.body;
    console.log("========masuk getStatus =============");

    if (req.body.order_id) {
      console.log(req.body);
      //######## INSERT DATABASE
    }

    snap.transaction.status(order_id).then((Response) => {
      console.log("=======masuk status=========");
      console.log(Response);
      let bank = "";
      let noPembayaran = "";
      if (Response.va_numbers) {
        bank = `${Response.va_numbers[0].bank}`;
        noPembayaran = Response.va_numbers[0].va_number;
        console.log("1");
      } else if (Response.biller_code) {
        bank = "mandiri";
        noPembayaran = `
                Kode bank : ${Response.biller_code} 
                Kode Pembayaran : ${Response.bill_key}`;
        console.log("2");
      } else if (Response.permata_va_number) {
        bank = "permata";
        noPembayaran = Response.permata_va_number;
        console.log("3");
      } else if (Response.bank) {
        bank = Response.bank;
        noPembayaran = "";
        console.log("4");
      } else if (Response.payment_type === "gopay") {
        noPembayaran = `https://api.veritrans.co.id/v2/gopay/${Response.transaction_id}/qr-code`;
      } else {
        bank = "";
      }
      let status = {
        order_id: Response.order_id,
        transaction_status: Response.transaction_status,
        payment_type: Response.payment_type,
        bank,
        noPembayaran,
        gross_amount: Response.gross_amount,
      };
      console.log(status);

      console.log("status_transaction" + order_id);
      //kirim respond status payment ke ui payment page dari push notification midtrans lewat socket io
      req.app.io.emit(`status_transaction` + order_id, status);

      // update payment status on database
      Payment.findOne({
        attributes: ["scholarshipId"],
        where: {
          order_id: Response.order_id,
        },
      }).then((result) => {
        if (Response.transaction_status === "settlement") {
          scholarship
            .update(
              {
                currentValue: sequelize.literal(
                  `currentValue + ${Response.gross_amount}`
                ),
              },
              {
                where: {
                  id: result.dataValues.scholarshipId,
                },
              }
            )
            .then((result1) => {
              console.log(
                "------------------------------------------------success--------------------------------------------"
              );
              //  console.log(result1.dataValues)
            })
            .catch((err) => {
              console.log(err);
            });
        }
        Payment.update(
          {
            statusPayment: Response.transaction_status,
          },
          {
            where: {
              order_id: Response.order_id,
            },
          }
        );
      });

      // mockNotificationJson = Response
      // snap.transaction.notification(Response)
      //     .then((statusResponse)=>{
      //         // console.log('=======masuk notification=========')
      //         // console.log(statusResponse)

      //         let orderId = statusResponse.order_id
      //         let transactionStatus = statusResponse.transaction_status
      //         let fraudStatus = statusResponse.fraud_status

      //         let msg = `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`

      //         if(transactionStatus == 'settlement'){

      //             if(fraudStatus == 'challenge'){

      //                 return res.status(200).send(msg)
      //             }else if(fraudStatus == 'accept'){

      //                 return res.status(200).send(msg)
      //             }
      //         }else if(transactionStatus == 'cancel' || transactionStatus == 'failure'){

      //             return res.status(200).send(msg)
      //         }else if(transactionStatus == 'pending'){

      //             return res.status(200).send(msg)
      //         }
      //     })
      return res.status(200).send(status);
    });
  },

  getStatusDonationToYayasan: (req, res) => {
    const { order_id } = req.body;
    console.log("========masuk getStatus Donation =============");

    if (req.body.order_id) {
      console.log("Donation");
      console.log(req.body);
      //######## INSERT DATABASE
    }

    snap.transaction.status(order_id).then((Response) => {
      console.log("=======masuk status=========");
      console.log(Response);
      let bank = "";
      let noPembayaran = "";
      if (Response.va_numbers) {
        bank = `${Response.va_numbers[0].bank}`;
        noPembayaran = Response.va_numbers[0].va_number;
        console.log("1");
      } else if (Response.biller_code) {
        bank = "mandiri";
        noPembayaran = `
                Kode bank : ${Response.biller_code} 
                Kode Pembayaran : ${Response.bill_key}`;
        console.log("2");
      } else if (Response.permata_va_number) {
        bank = "permata";
        noPembayaran = Response.permata_va_number;
        console.log("3");
      } else if (Response.bank) {
        bank = Response.bank;
        noPembayaran = "";
        console.log("4");
      } else if (Response.payment_type === "gopay") {
        noPembayaran = `https://api.veritrans.co.id/v2/gopay/${Response.transaction_id}/qr-code`;
      } else {
        bank = "";
      }
      let status = {
        order_id: Response.order_id,
        transaction_status: Response.transaction_status,
        payment_type: Response.payment_type,
        bank,
        noPembayaran,
        gross_amount: Response.gross_amount,
      };
      console.log(status);

      console.log("status_transaction" + order_id);
      //kirim respond status payment ke ui payment page dari push notification midtrans lewat socket io
      req.app.io.emit(`status_transaction` + order_id, status);

      // update payment status on database
      donation
        .findOne({
          attributes: ["projectId"],
          where: {
            order_id: Response.order_id,
          },
        })
        .then((result) => {
          if (Response.transaction_status === "settlement") {
            //   scholarship
            //     .update(
            //       {
            //         currentValue: sequelize.literal(
            //           `currentValue + ${Response.gross_amount}`
            //         ),
            //       },
            //       {
            //         where: {
            //           id: result.dataValues.scholarshipId,
            //         },
            //       }
            //     )
            //     .then((result1) => {
            //       console.log(
            //         "------------------------------------------------success--------------------------------------------"
            //       );
            //       //  console.log(result1.dataValues)
            //     })
            //     .catch((err) => {
            //       console.log(err);
            //     });
          }
          donation.update(
            {
              statusPayment: Response.transaction_status,
            },
            {
              where: {
                order_id: Response.order_id,
              },
            }
          );
        });

      // mockNotificationJson = Response
      // snap.transaction.notification(Response)
      //     .then((statusResponse)=>{
      //         // console.log('=======masuk notification=========')
      //         // console.log(statusResponse)

      //         let orderId = statusResponse.order_id
      //         let transactionStatus = statusResponse.transaction_status
      //         let fraudStatus = statusResponse.fraud_status

      //         let msg = `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`

      //         if(transactionStatus == 'settlement'){

      //             if(fraudStatus == 'challenge'){

      //                 return res.status(200).send(msg)
      //             }else if(fraudStatus == 'accept'){

      //                 return res.status(200).send(msg)
      //             }
      //         }else if(transactionStatus == 'cancel' || transactionStatus == 'failure'){

      //             return res.status(200).send(msg)
      //         }else if(transactionStatus == 'pending'){

      //             return res.status(200).send(msg)
      //         }
      //     })
      return res.status(200).send(status);
    });
  },

  onFailureGetInfo: (req, res) => {
    const order_id = req.body.order_id;
    console.log(order_id);
    Payment.findOne({
      attributes: [
        "id",
        "projectId",
        "scholarshipId",
        "paymentSource",
        [sequelize.col("scholarship.judul"), "judulScholarship"],
        [sequelize.col("project.name"), "judulProject"],
      ],
      include: [
        {
          model: scholarship,
          attributes: [],
          required: false,
        },
        {
          model: Project,
          attributes: [],
          required: false,
        },
      ],

      where: {
        order_id: order_id,
      },
    })
      .then((result) => {
        console.log("ONFAILURE______");
        console.log(result);
        return res
          .status(200)
          .send({ message: "success", result: result.dataValues });
      })
      .catch((err) => {
        return res.status(500).send({ message: "admin error", err });
      });
  },

  //====================// end of midtrans //====================

  // getPayment : (req, res)=>{
  //     console.log('payment')
  //     res.send('payment')
  //     Payment.findAll()
  //     .then((result)=>{
  //         console.log(Payment)
  //         console.log(result)
  //         res.status(200).send(result)
  //     })
  //     .catch((err)=>{
  //         console.log(err)
  //     })
  // },
  updatePayment: (req, res) => {
    console.log("masuk update payment ===> ");
    console.log(req.body);
    console.log("masuk update payment ===> ");
    let {
      payment_type,
      transaction_status,
      transaction_time,
      order_id,
      gross_amount,
      scholarshipId,
    } = req.body;
    Payment.update(
      {
        paymentType: payment_type,
        statusPayment: transaction_status,
        updateAt: transaction_time,
      },
      {
        where: {
          order_id,
        },
      }
    )

      .then(() => {
        // if(transaction_status === 'settlement'){
        //     scholarship.update(
        //         {
        //             currentValue : sequelize.literal(`currentValue + ${gross_amount}`)
        //         },
        //         {
        //             where :
        //                 {
        //                     id : scholarshipId
        //                 }
        //         }
        //     )
        //     .then((res)=>{
        //          console.log('success')
        //          console.log(res)
        //     })
        //     .catch((err)=>{
        //         console.log(err)
        //     })
        // }
        Payment.findAll({ where: { order_id } }).then((result) => {
          console.log(result);
          return res.status(200).send(result);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },

  updateDonationToYayasan: (req, res) => {
    console.log("masuk update payment Donation ===> ");
    console.log(req.body);
    console.log("masuk update payment Donation ===> ");
    let {
      payment_type,
      transaction_status,
      transaction_time,
      order_id,
      gross_amount,
      scholarshipId,
    } = req.body;
    donation
      .update(
        {
          paymentType: payment_type,
          statusPayment: transaction_status,
          updateAt: transaction_time,
        },
        {
          where: {
            order_id,
          },
        }
      )

      .then(() => {
        // if(transaction_status === 'settlement'){
        //     scholarship.update(
        //         {
        //             currentValue : sequelize.literal(`currentValue + ${gross_amount}`)
        //         },
        //         {
        //             where :
        //                 {
        //                     id : scholarshipId
        //                 }
        //         }
        //     )
        //     .then((res)=>{
        //          console.log('success')
        //          console.log(res)
        //     })
        //     .catch((err)=>{
        //         console.log(err)
        //     })
        // }
        donation.findAll({ where: { order_id } }).then((result) => {
          console.log(result);
          return res.status(200).send(result);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  getHistory: (req, res) => {
    console.log(req.body);
    const userId = req.body.userId;
    const offset = req.body.offset;
    const limit = req.body.limit;

    Payment.findAndCountAll({
      limit: parseInt(limit),
      // limit : 10,
      offset: offset,
      // subQuery: false,
      attributes: [
        "paymentType",
        "paymentSource",
        "nominal",
        "statusPayment",
        [sequelize.col("scholarship.judul"), "judulScholarship"],
        // [sequelize.col('Project.name'), 'namaProject'],
        // [sequelize.col('Project.id'), 'projectId'],
        // [sequelize.col('Project.projectImage'), 'gambarProject'],
        [sequelize.col("scholarship.id"), "scholarshipId"],
        [sequelize.col("scholarship->Student.name"), "namaMurid"],
        [sequelize.col("scholarship->Student.studentImage"), "fotoMurid"],
        [sequelize.col("scholarship->Student.provinsi"), "provinsi"],
        [sequelize.col("scholarship->Student.kelas"), "kelas"],
        [sequelize.col("scholarship->Student->school.nama"), "namaSekolah"],
        "order_id",
        "komentar",
        "noPembayaran",
        "createdAt",
        "updatedAt",
        "id",
      ],
      where: {
        isRefund: 0,
        userId,
      },
      include: [
        {
          model: Project,
          required: false,
          attributes: [],
        },
        {
          model: scholarship,
          required: false,
          attributes: [],
          include: [
            {
              model: Student,
              attributes: [],
              required: true,
              include: [
                {
                  model: school,
                  attributes: [],
                  required: true,
                },
              ],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    })
      .then((result) => {
        // console.log('erresult')
        // console.log(result)
        console.log(result.count);

        return res
          .status(200)
          .send({ result: result.rows, count: result.count });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).send({ message: err });
      });
  },
  getHistoryAdmin: (req, res) => {
    // console.log(req.body)
    // const userId = req.body.userId
    // const offset = req.body.offset
    // const limit = req.body.limit

    Payment.findAndCountAll({
      //   limit:parseInt(limit),
      //   // limit : 10,
      //   offset:offset,
      // subQuery: false,
      attributes: [
        "paymentType",
        "paymentSource",
        "nominal",
        "statusPayment",
        [sequelize.col("scholarship.judul"), "judulScholarship"],
        [sequelize.col("project.name"), "namaProject"],
        [sequelize.col("project.id"), "projectId"],
        [sequelize.col("project.projectImage"), "gambarProject"],
        [sequelize.col("scholarship.id"), "scholarshipId"],
        [sequelize.col("scholarship->student.name"), "namaMurid"],
        [sequelize.col("scholarship->student.studentImage"), "fotoMurid"],
        [sequelize.col("user.nama"), "username"],
        "order_id",
        "komentar",
        "createdAt",
        "updatedAt",
        "id",
      ],
      where: {
        isRefund: 0,
        isDeleted: 0,
      },
      include: [
        {
          model: Project,
          required: false,
          attributes: [],
        },
        {
          model: User,
          required: true,
          attributes: [],
        },
        {
          model: scholarship,
          required: false,
          attributes: [],
          include: [
            {
              model: Student,
              attributes: [],
              required: true,
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    })
      .then((result) => {
        console.log("erresult");
        // console.log(result)
        //   console.log(result.count)

        return res
          .status(200)
          .send({ result: result.rows, count: result.count });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).send({ message: err });
      });
  },
  getDonasiProject: (req, res) => {
    // console.log('masuk getDonasiProject')
    let { projectId, scholarshipId } = req.body;
    console.log(req.body);
    Payment.findAll({
      attributes: ["nominal", "updatedAt", "komentar", "isAnonim"],
      where: {
        projectId: projectId ? projectId : null,
        scholarshipId: scholarshipId ? scholarshipId : null,

        statusPayment: "settlement",
      },
      include: [
        {
          model: User,
          attributes: ["nama"],
        },
      ],
    })
      .then((result) => {
        // console.log('===========>>>>>>>')
        // console.log(result)
        return res.status(200).send(result);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).send({ message: "there is an error ", err });
      });
  },
  getSubscription: (req, res) => {
    User.findOne({
      where: {
        email: req.body.email,
      },
      attributes: ["subscriptionStatus", "subscriptionNominal"],
    })
      .then((results) => {
        return res.status(200).send(results);
      })
      .catch((error) => {
        return res.status(500).send(error);
      });
  },
  applySubscription: (req, res) => {
    var { subscriptionNominal, email, reminderDate } = req.body;
    console.log(
      "--------------------------------------------------------------------"
    );
    console.log(req.body);
    if (!email) {
      return null;
    }
    // console.log(req.body)
    User.update(
      {
        subscriptionStatus: 1,
        subscriptionNominal,
        reminderDate,
      },
      {
        where: { email },
      }
    )
      .then((result) => {
        console.log("masuk");
        res.status(200).send(result);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  payout: (req, res) => {
    console.log(
      "--------------------------> masuk payout -----------------------------------------"
    );
    console.log(req.body);
    console.log(req.query);
    // console.log(req.body.name.name)
    let { id, name } = req.query;
    Axios({
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "post",
      url: "https://app.sandbox.midtrans.com/iris/api/v1/payouts",
      auth: {
        username: "IRIS-83f135ed-3513-47bf-81bb-a071822ee68f",
      },
      data: req.body,
    })
      .then((ress) => {
        let { reference_no } = ress.data.payouts[0];
        console.log("------- masuk sini 1 --------");
        console.log(reference_no);
        Axios({
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          method: "get",
          url: `https://app.sandbox.midtrans.com/iris/api/v1/payouts/${reference_no}`,
          auth: {
            // username: 'IRIS-83f135ed-3513-47bf-81bb-a071822ee68f'
            username: "IRIS-83f135ed-3513-47bf-81bb-a071822ee68f",
          },
          data: req.body,
        })
          .then((resPayout) => {
            console.log("====== dari payout midtrans =================");
            console.log(resPayout.data);
            let {
              amount,
              beneficiary_name,
              beneficiary_account,
              bank,
              reference_no,
              notes,
              status,
              beneficiary_email,
              created_by,
            } = resPayout.data;

            Payout.create({
              scholarshipId: id,
              amount,
              beneficiary_name,
              beneficiary_account,
              bank,
              reference_no,
              notes,
              beneficiary_email,
              status,
              created_by: name,
            })
              .then((resPayoutDb) => {
                scholarship
                  .update(
                    {
                      totalPayout: sequelize.literal(`totalPayout+${amount}`),
                    },
                    {
                      where: {
                        id,
                      },
                    }
                  )
                  .then((resputsch) => {
                    console.log("---");
                  })
                  .catch((err) => {
                    console.log(err);
                  });
                return res.status(200).send(resPayout.data);
              })
              .catch((err) => {
                console.log(err, "--------------------------> err 1");
              });
            // return res.status(200).send(resPayout.data)
          })
          .catch((err) => {
            console.log(err, "--------------------------> err 2");
            return res.status(400).send(err);
          });

        // return res.status(200).send(ress.data)
      })
      .catch((err) => {
        console.log(err, "--------------------------> err 3");
        return res.status(400).send(err);
      });
  },
  payoutnotif: (req, res) => {
    console.log("-----------------------------------> masuk payout notif");
    console.log(req.body);
  },
  getstatusiris: (req, res) => {
    console.log("didalam body---------------------");
    console.log(req.body);
    console.log("didalam body---------------------");

    const { no } = req.body;
    const statusBody = req.body.status;
    const reference_noBody = req.body.reference_no;
    if (statusBody) {
      console.log(statusBody);
      Payout.update(
        {
          status: statusBody,
        },
        {
          where: {
            reference_no: reference_noBody,
          },
        }
      )
        .then((resupdate) => {
          return res.status(200).send(resupdate);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    Axios({
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "get",
      url: `https://app.sandbox.midtrans.com/iris/api/v1/payouts/${no}`,
      auth: {
        username: "IRIS-83f135ed-3513-47bf-81bb-a071822ee68f",
      },
      data: req.body,
    }).then((results) => {
      // console.log('didalam result---------------------')
      // console.log(results)
      // console.log('didalam result---------------------')
      // req.body.status ? console.log('-------> ', statusbody) : console.log('ga dapet')
      const { status, reference_no } = results.data;
      Payout.update(
        {
          status: status,
        },
        {
          where: {
            reference_no,
          },
        }
      )
        .then((resupdate) => {})
        .catch((err) => {
          console.log(err);
        });

      return res.status(200).send(results.data);
    });
  },
  payouthistory: (req, res) => {
    console.log("------------------------------------> payout history");
    console.log(req.body);
    const { id, limit, offset } = req.body;
    Payout.findAndCountAll({
      limit: parseInt(limit),
      offset,
      include: [
        {
          model: scholarship,
          // required : false,
          attributes: ["id"],
          include: [
            {
              required: true,
            },
          ],
        },
      ],
      where: {
        scholarshipId: req.body.id,
      },
      order: [["createdAt", "DESC"]],
    })
      .then((result) => {
        // console.log('====success=====================')
        console.log(result);
        res.status(200).send({
          message: "success",
          results: result.rows,
          count: result.count,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  checkpayout: (req, res) => {
    console.log("=============================> cek payout");
    console.log(req.body);
    const { id, bln } = req.body;
    Payout.findAll({
      where: {
        scholarshipId: id,
      },
    }).then((result1) => {
      let checked = false;
      result1.map((val, i) => {
        let check =
          val.dataValues.notes.split(" ").slice(2, 4).join(" ") == bln;
        // let bulan = val.dataValues.notes.slpit(' ')
        console.log(check);
        if (check) {
          checked = true;
        }
      });

      return res.status(200).send(checked);
    });
  },

  createBeneficiaries: (req, res) => {
    console.log("--------------------------> masuk Beneficiaries");
    console.log(req.body);
    Axios({
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "post",
      url: "https://app.sandbox.midtrans.com/iris/api/v1/beneficiaries",
      auth: {
        username: "IRIS-83f135ed-3513-47bf-81bb-a071822ee68f",
      },
      data: req.body,
    })
      .then((ress) => {
        console.log(ress.data);
        return res.status(200).send(ress.data);
      })
      .catch((err) => {
        // console.log('----error cuy')
        console.log(err);
        // console.log(err.response.data)
        return res.status(400).send({ message: err.response.data });
      });
  },
  getListBank: (req, res) => {
    console.log("-------------- > list bank");
    Axios({
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "get",
      url: "https://app.sandbox.midtrans.com/iris/api/v1/beneficiary_banks",
      auth: {
        username: "IRIS-83f135ed-3513-47bf-81bb-a071822ee68f",
      },
    })
      .then((ress) => {
        // console.log(ress.data)
        return res.status(200).send(ress.data);
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).send(err);
      });
  },
  validateBankAccount: (req, res) => {
    console.log("------------------------ validate bank account");
    const { code, account } = req.body;
    console.log(req.body);
    Axios({
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
      method: "get",
      url: `https://app.sandbox.midtrans.com/iris/api/v1/account_validation?bank=${code}&account=${account}`,
      auth: {
        username: "IRIS-83f135ed-3513-47bf-81bb-a071822ee68f",
      },
    })
      .then((ress) => {
        // currentValueconsole.log(ress.data)
        return res.status(200).send(ress.data);
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).send({ message: err.response.data });
      });
  },

  paymentcheck: (req, res) => {
    console.log("=============================checkpayment");
    Payment.findOne({
      attributes: ["order_id"],
      where: {
        order_id: req.body.order_id,
      },
    }).then((result) => {
      return res.status(200).send(result);
    });
  },

  donationcheck: (req, res) => {
    console.log("=============================checkpaymentdonation");
    donation
      .findOne({
        attributes: ["order_id"],
        where: {
          order_id: req.body.order_id,
        },
      })
      .then((result) => {
        return res.status(200).send(result);
      });
  },

  // ============ core api ===============
};
