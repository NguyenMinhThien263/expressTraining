require('dotenv').config();
// import nodemailer from 'nodemailer';
const nodemailer = require("nodemailer");
let sendSimpleEmail = async (dataSend) => {


    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Express Training" <nguyenminhthien.tdc2019@gmail.com>', // sender address
        to: dataSend.reciverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        html: getBodyHTMLEmail(dataSend), // html body
    });
}
let sendAttachment = (dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.EMAIL_APP, // generated ethereal user
                    pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
                },
            });

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: '"Express Training" <nguyenminhthien.tdc2019@gmail.com>', // sender address
                to: dataSend.email, // list of receivers
                subject: "Kết quả đặt lịch khám bệnh", // Subject line
                html: getBodyHTMLEmailRemedy(dataSend), // html body
                attachments: [
                    {
                        filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
                        content: dataSend.imgBase64.split("base64,")[1],
                        encoding: 'base64'
                    }
                ], //
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    })

}
let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên ExpressTraining</p>
        <p>Thông tin dơn thuốc/ hoá đơn được gửi trong file đính kèm</p>
        <div className="">Xin Chân thành cảm ơn</div>
`
    }
    if (dataSend.language === 'en') {
        result = `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>You received this email because you booked an online medical appointment on ExpressTraining</p>
        <p>Information to book a medical appointment</p>
        <div className="">Sincerely thank</div>
        `
    }
    return result;
}
let getBodyHTMLEmail = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên ExpressTraining</p>
        <p>Thông tin đặt lịch khám bệnh</p>
<div className=""><b>Thời gian ${dataSend.time}</b></div>
<div className=""><b>Bác sĩ ${dataSend.doctorName}</b></div>
<p>Nếu các thông tin trên là đúng sự thật, vui lòng click vào đường link bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh.</p>
<div className=""><a href=${dataSend.redirectLink} target="_blank">Click here</a></div>
<div className="">Xin Chân thành cảm ơn</div>
`
    }
    if (dataSend.language === 'en') {
        result = `
        <h3>Dear ${dataSend.patientName}!</h3>
        <p>You received this email because you booked an online medical appointment on ExpressTraining</p>
        <p>Information to book a medical appointment</p>
        <div className=""><b>Time: ${dataSend.time}</b></div>
        <div className=""><b>Doctor: ${dataSend.doctorName}</b></div>
        <p>If the above information is correct, please click on the link below to confirm and complete the medical appointment booking procedure.</p>
        <div className=""><a href=${dataSend.redirectLink} target="_blank">Click here</a></div>
        <div className="">Sincerely thank</div>
        `
    }
    return result;
}
module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAttachment: sendAttachment,
}