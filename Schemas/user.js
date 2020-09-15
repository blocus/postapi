const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    name : {type: String},
    last : {type: String},
})

module.exports = mongoose.model("user", userSchema)