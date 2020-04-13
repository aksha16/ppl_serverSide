const express = require("express");
const router = express.Router();
const api = require("../apis/post");
const multer = require("multer");

const upload = multer({
  dest: "/home/com122/Desktop/ppl/clientSide" + "/public/uploadPics"
});

// /login/upload
router.post("/upload", upload.single("image"), async (req, res) => {
  let obj = req.body;
  //console.log("req.dataaaaa", req.file);
  obj.image = req.file.filename;
  obj.category = req.body.category.toLowerCase();
  console.log("obj", obj);
  res.send(obj);
  await api.createUpload(obj);
  console.log("upload dbase has been created ...", __dirname);
});

// /login/post
router.post("/showpost", async (req, res) => {
  let data = await api.showPost();
  //console.log("upload has been done ", data);
  res.send(data);
});

// login/likes
router.post("/likes", async (req, res) => {
  console.log("likes response : ", req.body);
  const data = await api.addLikes(req.body._id, req.body.email);
  console.log("likes are added !!");
  res.send(data);
});

//login/singlepost
router.post("/singlePost", async (req, res) => {
  console.log("let's check single post data ", req.body);
  let data = await api.showSinglePost(req.body.id);
  res.send(data);
});

//login/signlePost/addComments
router.post("/singlePost/addComments", async (req, res) => {
  try {
    let obj = req.body;
    console.log("comment came :", obj);
    let data = await api.addComments(obj._id, obj.comment, obj.commentedBy);
    console.log("whats has commented returned", data.comments[0].commentedBy, "============================");
    const sendData = { commentedBy: obj.commentedBy, comment: obj.comment };
    res.send(data.comments.slice(-1));
  } catch (err) {
    console.log("errrrrr", err);
  }
});

module.exports = router;
