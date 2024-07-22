const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    // passport-local-mongoose username aur password automatically define kr dega isiliye hm sirf email ko define krege
    email: {
        type: String,
        require: true,
    }
})

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);



