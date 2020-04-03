const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    image : String,
    description : String,
    name : String
},
{version:false}
);

module.exports = mongoose.model('categorySchema', categorySchema);