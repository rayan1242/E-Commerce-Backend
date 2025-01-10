const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');
const User = require('../model/userModel');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const sendEmail = asyncHandler(async (data,req, res) => {
    let trasporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    requireTLS:true,
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASSWORD,
    },
    });
    let info = await trasporter.sendMail({
        from:process.env.EMAIL,
        to:data.email,
        subject:data.subject,
        text:data.message,
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.status(200).send("Email sent successfully");


}

module.exports = { sendEmail };