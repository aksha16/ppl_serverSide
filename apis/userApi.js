const mongoose = require("mongoose");
const userSchema = require("../schemas/userSchema");

const functions = {
  findByEmail: userEmail =>
    new Promise((resolve, reject) => {
      userSchema.findOne({ email: userEmail }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          console.log("result of email checking : ", result);
          resolve(result);
        }
      });
    }),

  createDb: dataBody => userSchema.create(dataBody),

  logIn: (userEmail, userPassword) =>
    new Promise((resolve, reject) => {
      userSchema.findOne(
        {
          $and: [
            { email: userEmail },
            { password: userPassword },
            { isVerified: true }
          ]
        },
        (err, result) => {
          if (err) reject(err);
          else {
            console.log("result of login checking :", result);
            resolve(result);
          }
        }
      );
    }),

  forgetPassword: userEmail =>
    new Promise((resolve, reject) => {
      userSchema.findOne({ email: userEmail }, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    }),

  resetPassword: (userId, userNewPassword) =>
    new Promise((resolve, reject) => {
      userSchema.updateOne(
        { _id: userId },
        { $set: { password: userNewPassword } },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    }),

  verifyUser: userId =>
    new Promise((resolve, reject) => {
      userSchema.updateOne(
        { _id: userId },
        { $set: { isVerified: true } },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    })
};

module.exports = functions;
