const mongoose = require('mongoose');

//const now = new Date();
const postSchema = mongoose.Schema({
    postedBy : String,
    image : String,
    caption : String,
    category : String,
    date : {type:Date, default:Date.now},
    time : {types:Date, default:Date.now},
    likedBy:Array,
    comments:[{commentedBy:String, comment:String}]

},
{version : false}
);

module.exports = mongoose.model('postSchema', postSchema);