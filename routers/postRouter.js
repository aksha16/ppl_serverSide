const express = require("express");
const router = express.Router();
const api = require("../apis/postApi");
const multer = require("multer");

const upload = multer({
  dest: "/home/com122/Desktop/ppl/backend" + "/public/uploadPics"
});

router.post("/upload", upload.array("image", 3), async (req, res) => {
  let obj = req.body;
  console.log("image of react native", obj, req.files);
  obj.image = req.files[0].filename;
  obj.category = req.body.category.toLowerCase();
  console.log("obj", obj);
  const data = await api.createUpload(obj);
  console.log("upload dbase has been created ...",data);
  res.status(200).send("data");
});

router.post("/showpost", async (req, res) => {
  let data = await api.showPost();
  res.send(data);
});

router.post("/likes", async (req, res) => {
  console.log("likes response : ", req.body);
  const data = await api.addLikes(req.body._id, req.body.email);
  console.log("likes are added !!");
  res.send(data);
});

router.post("/singlePost", async (req, res) => {
  console.log("let's check single post data ", req.body);
  let data = await api.showSinglePost(req.body.id);
  console.log("what data", data);
  res.send(data);
});

router.post("/singlePost/addComments", async (req, res) => {
  try {
    let obj = req.body;
    console.log("comment came :", obj);
    let data = await api.addComments(obj._id, obj.comment, obj.commentedBy);
    console.log(
      "whats has commented returned",
      data,
      "============================"
    );
    const sendData = {
      commentedBy: data.comments.slice(-1)[0].commentedBy,
      comment: obj.comment
    };
    res.send(sendData);
  } catch (err) {
    console.log("errrrrr", err);
  }
});

router.post("/sort", async(req, res) => {
  try {
    console.log(req.body, "sort request");
    let text = req.body.text;
    if (text == 'latestFirst') {
      data = await api.latestFirst(req.body.limit);
    } else if (text == 'oldestFirst') {
      data = await api.oldestFirst(req.body.limit);
    } else if (text == 'mostLiked') {
      data = await api.mostLiked(req.body.limit);
    } else if (text == 'mostCommented') {
      data = await api.mostCommented(req.body.limit);
    }
    res.send(data);
  } catch(err) {
    console.log("errrrr", err);
    res.send(false);
  }
})

router.post("/myupload", async(req, res) => {
  try{
    const data = await api.myUploads(req.body);
    res.send(data);
  } catch(err) {
    console.log("errrr", err);
    res.send(false);
  }
})




module.exports = router;
