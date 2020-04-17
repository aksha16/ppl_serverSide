const mongoose = require("mongoose");
const postSchema = require("../schemas/postSchema");

const functions = {
  createUpload: dataBody => postSchema.create(dataBody),

  showPost: () =>
    new Promise((resolve, reject) => {
      postSchema
        .find({})
        .sort({ _id: -1 })
        .populate("postedBy")
        .exec((err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
    }),

  addLikes: (id, email) =>
    new Promise((resolve, reject) => {
      postSchema.updateOne(
        { _id: id },
        { $addToSet: { likedBy: email } },
        (err, result) => {
          console.log("what ae the modifers", result.nModified);

          if (err) {
            reject(err);
          } else {
            if (result.nModified === 1) {
              console.log("what are the modifers", result.nModified);
              resolve(result);
            } else {
              console.log("what arse the modifers", result.nModified);

              postSchema.updateOne(
                { _id: id },
                { $pull: { likedBy: email } },
                (err, results) => {
                  if (err) reject(err);
                  else resolve(result);
                }
              );
            }
          }
        }
      );
    }),

  showSinglePost: userId =>
    new Promise((resolve, reject) => {
      console.log("single post working ????");
      postSchema
        .findOne({ _id: userId })
        .populate("comments.commentedBy")
        .populate("postedBy")
        .exec((err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
    }),

  addComments: (postId, userComment, userId) =>
    new Promise((resolve, reject) => {
      postSchema
        .findOneAndUpdate(
          { _id: postId },
          {
            $push: { comments: { comment: userComment, commentedBy: userId } }
          },
          {new :true}
        )
        .populate("comments.commentedBy")
        .populate("postedBy")
        .exec((err, result) => {
          if (err) reject(err);
          else {
            console.log("resullll++++", result);
            resolve(result);
          }
        });
    })
};

module.exports = functions;
