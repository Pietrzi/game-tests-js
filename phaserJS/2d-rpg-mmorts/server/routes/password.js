const express = require('express');
const hbs = require('nodemailer-express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');
const crypto = require('crypto');

const UserModel = require('../models/UserModel');

const email = process.env.EMAIL;
const password = process.env.PASSWORD;


const smtpTransport = nodemailer.createTransport({
    service: process.env.EMAIL_PROVIDER,
    auth: {
      user: email,
      pass: password,
    },
});

const handlebarsOptions = {
    viewEngine: {
      extName: '.hbs',
      defaultLayout: null,
      partialsDir: './templates/',
      layoutsDir: './templates/',
    },
    viewPath: path.resolve('./templates/'),
    extName: '.html',
};

smtpTransport.use('compile', hbs(handlebarsOptions));

const router = express.Router();

router.post('/forgot-password', async (req, res) => {
    const userEmail = req.body.email;
    const user = await UserModel.findOne({ email: userEmail });
    if (!user) {
      res.status(400).json({ message: 'invalid email', status: 400 });
      return;
    }

    // create user token
    const buffer = crypto.randomBytes(20);
    const token = buffer.toString('hex');

    // update user reset password token and exp
    await UserModel.findByIdAndUpdate(
        { _id: user._id }, { resetToken: token, resetTokenExp: Date.now() + 600000 },
    );

    const emailOptions = {
        to: userEmail,
        from: email,
        template: 'forgot-password',
        subject: 'MMORPG Password Reset',
        context: {
        name: 'joe',
        url: `http://localhost:${process.env.PORT || 3000}/?token=${token}&scene=resetPassword`,
        },
    };
    await smtpTransport.sendMail(emailOptions);

    res.status(200).json({ message: 'Email sent to your email. Pass link valid only for 10 minutes.', statu: 200 });
})

router.post('/reset-password', async (req, res) => {
    const userEmail = req.body.email;
    const user = await UserModel.findOne({
        resetToken: req.body.token,
        resetTokenExp: { $gt: Date.now() },
        email: userEmail,
    });

    if (!user) {
        res.status(400).json({ message: 'invalid token', status: 400 });
        return;
    }

    // ensure password was provided, and that the password matches the verified password
    if (!req.body.password || !req.body.verifiedPassword
        || req.body.password !== req.body.verifiedPassword) {
        res.status(400).json({ message: 'passwords do not match', status: 400 });
        return;
    }

    // update user model
    user.password = req.body.password;
    user.resetToken = undefined;
    user.resetTokenExp = undefined;
    await user.save();

    // send user password update email
    const emailOptions = {
        to: userEmail,
        from: email,
        template: 'reset-password',
        subject: 'MMORPG Password Reset Confirmation',
        context: {
        name: user.username,
        },
    };
    await smtpTransport.sendMail(emailOptions);

    res.status(200).json({ message: 'password updated', status: 200 });
})

module.exports = router;