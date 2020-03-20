const mongoose = require('mongoose');

const userUpload = mongoose.Schema({
    email : String,
    image : String,
    caption : String,
    category : String,
    date : String,
    time : String,
    likedBy:Array,
    comments:Array

},
{version : false}
);

module.exports = mongoose.model('userUpload', userUpload);