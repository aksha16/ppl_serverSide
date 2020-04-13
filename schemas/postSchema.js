const mongoose = require("mongoose");
const userSchema = require("./userSchema");

const postSchema = mongoose.Schema(
  {
    postedBy: String,
    image: String,
    caption: String,
    category: String,
    date: { type: Date, default: Date.now },
    likedBy: Array,
    comments: [
      {
        comment: String,
        commentedBy: { type: mongoose.Schema.Types.ObjectId, ref: userSchema }
      }
    ]
  },
  { version: false }
);



module.exports = mongoose.model("postSchema", postSchema);
