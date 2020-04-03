const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username : String,
    password : String,
    email : String,
    firstname : String,
    lastname : String,
    isVerified : {type: Boolean, default:false}
},
{version : false}
);

module.exports = mongoose.model('userSchema', userSchema);

