const mongoose = require('mongoose');

const categoryUpload = mongoose.Schema({
    image : String,
    uploads : Array,
    description : String,
    category : String
},
{version:false}
);

module.exports = mongoose.model('categoryUpload', categoryUpload);