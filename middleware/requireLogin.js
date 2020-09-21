const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/keys')
const mongoose = require('mongoose')
const User = mongoose.model("User")

module.exports = (req, res, next) => {
    //1.get the token sent by the client
    //2.This token will come from the headers
    const { authorization } = req.headers
    //3.We'll have the token ====>authorization == Bearer ertgfdcbb
    if (!authorization) {
        return res.status(401).json({ error: "You must be logged in!" })
    }
    //4.Get only the token part hence we are replacing here the bearer with empty string
    const token = authorization.replace("Bearer ", "")
    //5.verify the token
    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) {
            return res.status(401).json({ error: "You must be logged in!" })
        }

        const { _id } = payload
        User.findById(_id).then(userdata => {
            req.user = userdata
            next()
        })

    })
}