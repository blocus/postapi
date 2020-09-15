const express = require("express")
const router = express.Router()
const User = require('../Schemas/user')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const secret = process.env.JWT_SECRET

const { authentcateToken, cleanUser } = require("../helper")

router.get("/userInfo", authentcateToken, async(req, res) => {
    res.status(200).json(cleanUser(req.user))
})

router.post("/login", async (req, res) => {
    let username = req.body.username
    let password = req.body.password

    let user = await User.findOne({
        username: username
    })

    if (!user) res.status(403).json({
        error: "Athentification failed"
    })

    bcrypt.compare(password, user.password).then(test => {
        if (test) {
            let token = jwt.sign({id: user.id}, secret,  { expiresIn: 3600 })
            res.status(200).json({
                message: "Login success",
                jwt: token
            })
        } else {
            res.status(403).json({
                error: "Athentification failed"
            })
        }
    })
})


router.post("/register", async (req, res) => {
    let username = req.body.username
    let password = req.body.password
    let verifPassword = req.body.verifPassword
    let errors = []

    if (!username) errors.push("username")
    if (!password) errors.push("password")
    if (!verifPassword) errors.push("verifPassword")
    if (password !== verifPassword) errors.push("Password and verifPassword don't match")

    if (errors.length !== 0){
        return res.status(422).json(errors)
    }

    let newUser = new User({
        username: username ,
        password:  bcrypt.hashSync(password, 12),
    })

    newUser.save().then(data => {
        let token = jwt.sign({id: newUser.id}, secret)
        res.status(200).json({
            message: "Registration success",
            jwt: token
        })
    }).catch(err => {
        res.status(401).send()
    })
})

module.exports = router
