var _ = require('lodash');	
var nodemailer = require('nodemailer');

var config = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'xooeyxdp@gmail.com',
        pass: 'ijybriopzgjfteuh',
    }, tls: {
        rejectUnauthorized: false
      }
};
    
var transporter = nodemailer.createTransport(config);

var defaultMail = {
    from: 'xooey <xooeyxdp@gmaiil.com>',
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