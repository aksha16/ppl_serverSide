const mongoose = require('mongoose');
const categorySchema = require('../schemas/categorySchema');

// no changes now... 

const functions = {
    uploadCategory : (dataBody) => new Promise((resolve, reject) => {
        categorySchema.create(dataBody, (err, result) => {
            if(err) reject(err);
            else resolve(result);
        });
    }),

    showCategory : () => new Promise((resolve, reject) => {
        categorySchema.find({}, (err, result) => {
            if(err) reject(err);
            else resolve(result);
        })
    }),

    findByCategory : (userCategory) => new Promise((resolve, reject) => {
        categorySchema.findOne({name:userCategory}, (err, result) => {
            if(err) reject(err);
            else resolve(result);
        })
    }),
};

module.exports = functions;