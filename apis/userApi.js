const mongoose = require("mongoose");
const userSchema = require("../schemas/userSchema");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const functions = {
  findByEmail: (userEmail) =>
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

  createDb: (dataBody) =>
    new Promise((resolve, reject) => {
      bcrypt.hash(dataBody.password, saltRounds, (err, hash) => {
        if (err) reject(err);
        else {
          dataBody.password = hash;
          userSchema.create(dataBody, (err, result) => {
            if (err) reject(err);
            else {
              console.log("result=======", result, "========");
              resolve(result);
            }
          });
        }
      });
    }),

  logIn: (userEmail) =>
    new Promise((resolve, reject) => {
      userSchema.findOne(
        {
          $and: [{ email: userEmail }, { isVerified: true }],
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

  forgetPassword: (userEmail) =>
    new Promise((resolve, reject) => {
      userSchema.findOne({ email: userEmail }, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    }),

  resetPassword: (userId, userNewPassword) =>
    new Promise((resolve, reject) => {
      bcrypt.hash(userNewPassword, saltRounds, (err, hash) => {
        userNewPassword = hash;
        userSchema.updateOne(
          { _id: userId },
          { $set: { password: userNewPassword } },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });
    }),

  verifyUser: (userId) =>
    new Promise((resolve, reject) => {
      userSchema.updateOne(
        { _id: userId },
        { $set: { isVerified: true } },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    }),
};

module.exports = functions;
