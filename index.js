const express = require("express")
const mongoose = require("mongoose")
const authRouter = require("./authRouter")
const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use("/auth", authRouter)

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION || 'mongodb+srv://qwerty:123123d.@cluster0.enqyf.mongodb.net/auth_roles?retryWrites=true&w=majority')
        app.listen(PORT, () => {
            console.log(`Server has been started on port ${PORT}...`)
        })
    }
    catch (err) {
        throw new Error(err)
    }
}

start()