const mongoose = require('mongoose');
const userSchema = require('./schemas/userSchema');
const userUpload = require('./schemas/userUpload');
const categoryUpload = require('./schemas/categoryUpload');

const functions = {
    findByEmail : (userEmail) => new Promise((resolve, reject) => {
        userSchema.findOne({email : userEmail}, (err, result) => {
            if(err){
                reject(err);
            }
            else{
                console.log("result of email checking : ", result);
                resolve(result);
            }
        })
    }),

    createDb : (dataBody) => userSchema.create(dataBody),

    logIn : (userEmail, userPassword) => new Promise((resolve, reject) => {
        userSchema.findOne({$and: [{email:userEmail}, {password:userPassword}]}, (err, result) => {
            if(err) reject(err)
            else {
                console.log("result of login checking :", result);
                resolve(result);
            }
        })
    }),

    createUpload : (dataBody) => userUpload.create(dataBody),

    showPost : () => new Promise((resolve, reject) => {
        userUpload.find({}, (err, result) => {
            if(err) {
                reject(err);
            }else 
            {
                resolve(result);
            }
        }).sort({_id:-1})
    }),

    addLikes : (id, email) => new Promise((resolve, reject) => {
        userUpload.updateOne({_id:id}, {$addToSet : {likedBy:email}}, (err, result) => {
            console.log("what ae the modifers", result.nModified)

            if(err) {
                reject(err)
            }else {
                if (result.nModified===1){
                    console.log("what are the modifers", result.nModified)
                resolve(result);}
                else {
                    console.log("what arse the modifers", result.nModified)

                    userUpload.updateOne({_id:id}, {$pull:{likedBy:email}}, (err, results) => {
                        if(err) reject(err);
                        else resolve(result);
                    })
                }
            }
        })
    }),

    addProfile : (userEmail) => new Promise((resolve, reject) => {
        userSchema.find({email:userEmail}, (err, result) => {
            if(err){
                reject(err)
            }
            else {
                resolve(result)
            }
        })
    }),

    uploadCategory : (dataBody) => new Promise((resolve, reject) => {
        categoryUpload.create(dataBody, (err, result) => {
            if(err) reject(err);
            else resolve(result);
        });
    }),

    showCategory : () => new Promise((resolve, reject) => {
        categoryUpload.find({}, (err, result) => {
            if(err) reject(err);
            else resolve(result);
        })
    }),

    findByCategory : (userCategory) => new Promise((resolve, reject) => {
        categoryUpload.findOne({category:userCategory}, (err, result) => {
            if(err) reject(err);
            else resolve(result);
        })
    }),
    showSinglePost : (userId) => new Promise((resolve, reject) => {
        console.log("single post working ????")
        userUpload.findOne({_id:userId}, (err, result) => {
            if(err) reject(err);
            else resolve(result);
        } )
    } ),

    addComments : (userId, userComment) => new Promise((resolve, reject) => {
        userUpload.updateOne({_id:userId}, {$push:{comments:userComment}}, (err, result)=> {
            if(err) reject(err);
            else resolve(result);
        })
    })
};



module.exports = functions ;