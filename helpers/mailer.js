const nodemailer = require("nodemailer");
const fs = require("fs");
const handlebars = require("handlebars");
const { google } = require("googleapis");

// Tergantung dari email yang ingin digunakan

module.exports = {
  emailer: async (mailOptions) => {
    try {
      // let password = "operationalkasihnusantara2020";

      const oAuth2Client = new google.auth.OAuth2(
        `495258173995-j0rv5gluarg01vd9qdl6govqtiuus9r3.apps.googleusercontent.com`,
        `n7r0T1CjRV4nv9ODgF_-ydME`,
        `https://developers.google.com/oauthplayground`
      );

      oAuth2Client.setCredentials({
        refresh_token:
          "1//04iPaUK9a_ptnCgYIARAAGAQSNwF-L9IrVN-zj3s-uYq3BpC_NJZIuhpU4FZJI56rQ2timiTM7zpiTvUv2pnealk25QXZy7t3oSo",
      });

      const accessToken = await oAuth2Client.getAccessToken();

      // setup email data with unicode symbols

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: "operationalkasihnusantara@gmail.com",
          clientId: `495258173995-j0rv5gluarg01vd9qdl6govqtiuus9r3.apps.googleusercontent.com`,
          clientSecret: `n7r0T1CjRV4nv9ODgF_-ydME`,
          refreshToken: `1//04iPaUK9a_ptnCgYIARAAGAQSNwF-L9IrVN-zj3s-uYq3BpC_NJZIuhpU4FZJI56rQ2timiTM7zpiTvUv2pnealk25QXZy7t3oSo`,
          accessToken,
        },
        tls: {
          rejectUnauthorized: false,
        },
        logger: true,
      });

      // send mail with defined transport object
      return transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("emailer error", error.message);
          return false;
        }
        console.log("email sent", info);
        return true;
      });
    } catch (err) {
      console.log(err);
      return false;
    }
  },
};
