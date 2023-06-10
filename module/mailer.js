const nodemailer = require('nodemailer');
const config = require('../config/email.json')

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: config.host,
  port: config.port,
  secure: false,
  auth: {
    user: config.email,
    pass: config.password
  },
  tls: {
    ciphers: 'TLSv1.2'
  }
});

module.exports = {
    sendMail: async function(to, subject, content){
        // Define the email options
        var mailOptions = {
            from: config.email,
            to: to,
            subject: subject
        };
        if(content.includes("<html>")){
            mailOptions.html = content
        }else{
            mailOptions.text = content
        }
        
        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error occurred:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        return {
            status:"SUCCESS",
            message:"queued",
        }
    }
}