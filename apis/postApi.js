const postSchema = require("../schemas/postSchema");
const userSchema = require("../schemas/userSchema");

const functions = {
  createUpload: (dataBody) => postSchema.create(dataBody),

  showPost: () =>
    new Promise((resolve, reject) => {
      postSchema
        .find({})
        .sort({ _id: -1 })
        .populate("comments.commentedBy")
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

  showSinglePost: (userId) =>
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
            $push: { comments: { comment: userComment, commentedBy: userId } },
          },
          { new: true }
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
    }),

  latestFirst: () =>
    new Promise((resolve, reject) => {
      postSchema
        .find()
        .sort({ $natural: -1 })
        .limit(1)
        .populate("comments.commentedBy")
        .populate("postedBy")
        .exec((err, result) => {
          if (err) reject(err);
          else {
            console.log("result ===>>>", result);
            resolve(result);
          }
        });
    }),
  oldestFirst: () =>
    new Promise((resolve, reject) => {
      postSchema
        .find()
        .sort({ $natural: 1 })
        .limit(1)
        .populate("comments.commentedBy")
        .populate("postedBy")
        .exec((err, result) => {
          if (err) reject(err);
          else {
            console.log("result ===>>>", result);
            resolve(result);
          }
        });
    }),
  mostLiked: () =>
    new Promise((resolve, reject) => {
      postSchema
        .aggregate([
          {
            $project: {
              _id: 1,
              likedBy: 1,
              caption: 1,
              postedBy: 1,
              image: 1,
              date: 1,
              comments: 1,
              category: 1,
              length: {
                $cond: {
                  if: { $isArray: "$likedBy" },
                  then: { $size: "$likedBy" },
                  else: "NA",
                },
              },
            },
          },
          { $sort: { length: -1 } },
          { $limit: 1 },
        ])
        .exec((err, result) => {
          if (err) reject(err);
          else {
            postSchema.populate(
              result,
              { path: "comments.commentedBy" },
              (err, res) => {
                if (err) reject(err);
                else {
                  postSchema.populate(
                    res,
                    { path: "postedBy" },
                    (err, reslt) => {
                      if (err) reject(err);
                      else {
                        console.log("result ===>>>", reslt);
                        resolve(reslt);
                      }
                    }
                  );
                }
              }
            );
          }
        });
    }),

  mostCommented: () =>
    new Promise((resolve, reject) => {
      postSchema
        .aggregate([
          {
            $project: {
              _id: 1,
              likedBy: 1,
              caption: 1,
              postedBy: 1,
              image: 1,
              date: 1,
              comments: 1,
              category: 1,
              length: {
                $cond: {
                  if: { $isArray: "$comments" },
                  then: { $size: "$comments" },
                  else: "NA",
                },
              },
            },
          },
          { $sort: { length: -1 } },
          { $limit: 1 },
        ])
        .exec((err, result) => {
          if (err) reject(err);
          else {
            postSchema.populate(
              result,
              { path: "comments.commentedBy" },
              (err, res) => {
                if (err) reject(err);
                else {
                  postSchema.populate(
                    res,
                    { path: "postedBy" },
                    (err, reslt) => {
                      if (err) reject(err);
                      else {
                        console.log("result ===>>>", reslt);
                        resolve(reslt);
                      }
                    }
                  );
                }
              }
            );
          }
        });
    }),

    myUploads: (id) => new Promise((resolve, reject) => {
      postSchema
        .find({postedBy:id})
        .sort({ _id: -1 })
        .populate("comments.commentedBy")
        .populate("postedBy")
        .exec((err, result) => {
          if (err) {
            reject(err);
          } else {
            console.log("result of my uploads",  result);
            resolve(result);
          }
        });
    })
};

module.exports = functions;
