const User = require("./models/User")
const Role = require("./models/Role")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const { validationResult } = require("express-validator")
const { secret } = require("./config")

const generateAccessToken = (id, roles) => {
    const payload = {
        id, roles
    }

    const options = {
        expiresIn: "24h"
    }

    return jwt.sign(payload, secret, options)
}

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Registration error", errors})
            }

            const { username, password } = req.body

            const candidate = await User.findOne({ username })
            if (candidate) {
                return res.status(400).json("This username is already exists")
            }

            const hashPassword = bcrypt.hashSync(password, 7)

            const userRole = await Role.findOne({value: "USER"})
            const user = new User({
                username,
                password: hashPassword,
                roles: [userRole.value]
            })

            await user.save()
            return res.json({message: "User has been registered successfully"})
        } catch (err) {
            res.status(400).json({messsage: "Registration error"})
            throw new Error(err)
        }
    }

    async login(req, res) {
            try {
                const { username, password } = req.body
                const user = await User.findOne({ username })
                if (!user) {
                    return res.status(400).json({message: `User ${username} has not found`})
                }
                const validPassword = bcrypt.compareSync(password, user.password)
                if (!validPassword) {
                    return res.status(400).json({message: "Password is uncorrent"})
                }
                const token = generateAccessToken(user._id, user.roles)
                return res.json({token})
            } catch (err) {
                res.status(400).json({messsage: "Login error"})
                throw new Error(err)
        
            }
        }

    async getUsers(req, res) {
        try {
            const users = await User.find()
            res.json(users)
            } catch (err) {
                throw new Error(err)
            }
        }
}

module.exports = new authController