const Router = require('express')
const router = new Router()
const controller = require("./authController")
const { check } = require("express-validator")
const authMiddleware = require("./middleware/authMiddleware")
const roleMiddleware = require("./middleware/roleMiddleware")


router.post("/registration", [
    check("username", "Username field cannot be empty").notEmpty(),
    check("password", "Password has to exist from 4 till 10 symbols").isLength({min: 4, max: 10})
], controller.registration)
router.post("/login", controller.login)
router.get("/users", roleMiddleware(["ADMIN"]), controller.getUsers)

module.exports = router