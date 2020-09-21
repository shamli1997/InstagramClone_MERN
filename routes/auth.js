const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/keys')
const requireLogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const { userInfo } = require('os')
//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

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: "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"
    }
}))

router.get('/', (req, res) => {
    res.send("hello")
})

router.post('/signup', (req, res) => {
    const { name, email, password, pic } = req.body
    if (!email || !password || !name) {
        return res.status(422).json({ error: "please add all the fields" })
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "user already exists with that email" })
            }
            bcrypt.hash(password, 12)
                .then(hashedpassword => {
                    const user = new User({
                        email,
                        password: hashedpassword,
                        name,
                        pic

                    })

                    user.save()
                        .then(user => {
                            transporter.sendMail({
                                to: user.email,
                                from: "ingolesv1@gmail.com",
                                subject: "signup success",
                                html: "<h1>welcome to instagram</h1>"
                            })
                            res.json({ message: "saved successfully" })
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })

        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/signin', (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(422).json({ error: "Please add email or password" })

    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({ error: "Invalid Email or password" })
            }
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        //res.json({ message: "Successfully signed in!" })
                        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
                        const { _id, name, email, followers, following, pic } = savedUser
                        res.json({ token, user: { _id, name, email, followers, following, pic } })
                    }
                    else {
                        return res.status(422).json({ error: "Invalid Email or password" })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        })
})

router.post('/reset-password', (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    return res.status(422).json({ error: "User don't exist with this email!" })

                }
                user.resetToken = token
                user.expireToken = Date.now() + 3600000
                user.save().then((result) => {
                    transporter.sendMail({
                        to: user.email,
                        from: "ingolesv1@gmail.com",
                        subject: "Password Reset",
                        html:
                            `<p>You requested for password Reset</p>
                    <h5>Click on this <a href="http://localhost:3000/reset/${token}">link</a> to reset password</h5>`
                    })
                    res.json({ message: "Check Your Email" })
                })
            })
    })
})
/* router.get('/protected', requireLogin, (req, res) => {
    res.send("hello user")
}) */

router.post('/new-password', (req, res) => {
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                return res.status(422).json({ error: "Try again session expired!" })
            }
            bcrypt.hash(newPassword, 12).then(hashedPassword => {
                user.password = hashedPassword
                user.resetToken = undefined
                userInfo.expireToken = undefined
                user.save().then((savedUser) => {
                    res.json({ message: "Password updated successfully!!!" })
                })
            })
        }).catch(err => {
            console.log(err)
        })
})
module.exports = router 