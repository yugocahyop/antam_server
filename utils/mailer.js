var _ = require('lodash');	
var nodemailer = require('nodemailer');

const dotenv = require('dotenv');
// const { JSONParser } = require('formidable/parsers/index.js');

 dotenv.config();

 const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS} = process.env;


var config = {
    host: MAIL_HOST,
    port: MAIL_PORT,
    secure: true,
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
    }, tls: {
        rejectUnauthorized: false
      }
};
    
var transporter = nodemailer.createTransport(config);

var defaultMail = {
    from: `antam <${MAIL_USER}>`,
    text: 'test text',
};

module.exports = function(mail){
    // use default setting
    mail = _.merge({}, defaultMail, mail);
    
    // send email
    transporter.sendMail(mail, function(error, info){
        if(error) return console.log(error);
        console.log('mail sent:', info.response);
    });
};