const express = require("express");
const router = express.Router();
const api = require("./api");
const multer = require("multer");
const upload = multer({
  dest: __dirname.split("backend")[0] + "/public/uploadPics"
});
const uploadCategory = multer({
  dest: __dirname.split("backend")[0] + "/public/categoryPics"
});

router.get("/", (req, res) => {
  res.send("done!");
});

router.post("/registration",upload.none(), async (req, res) => {
  try {
    let user = await api.findByEmail(req.body.email);
    console.log(req.body.email);
    if (user) {
      console.log("user exists...");
      console.log("user : ", user);
      res.send(true);
    } else {
      console.log("new user created : ", req.body);
      await api.createDb(req.body);
      res.send(false);
    }
  } catch (err) {
    console.log("error", err);
  }
});

router.post("/login", async (req, res) => {
  try {
    let user = await api.logIn(req.body.email, req.body.password);
    console.log(req.body.email, req.body.password);
    if (user) {
      console.log("user can log in");
      res.send(true);
    } else {
      console.log("user can't log-in");
      res.send(false);
    }
  } catch (err) {
    console.log("errror : ", err);
  }
});

router.post("/login/upload", upload.single("image"), async (req, res) => {
  let obj = req.body;
  console.log("req.dataaaaa", req.file);
  obj.image = req.file.filename;
  obj.category = req.body.category.toLowerCase();
  console.log("obj", obj);
  res.send(obj);
  await api.createUpload(obj);
  console.log("upload dbase has been created ...");
});

router.post("/login/post", async (req, res) => {
  let data = await api.showPost();
  //console.log("upload has been done ", data);
  res.send(data);
});

var cate = {};
router.post("/login/category7", (req, res) => {
  res.send(req.body);
  console.log("req.data", req.body);
  if (req.body != {}) {
    cate = req.body;
  }
});

router.post("/login/showCategory7", (req, res) => {
  res.send(cate);
});

router.post("/login/likes", async (req, res) => {
  console.log("likes response : ", req.body);
  const data = await api.addLikes(req.body._id, req.body.email);
  console.log("likes are added !!");
  res.send(data);
});

router.post("/login/profile", async (req, res) => {
  console.log("achha ", req.body);
  let data = await api.addProfile(req.body.email);
  console.log("profile is been sent", req.body.email);
  res.send(data);
});

router.post(
  "/login/categoryUpload",
  uploadCategory.single("image"),
  async (req, res) => {
      try {
      console.log("is this running ..?");
    let obj = req.body;
    obj.image = req.file.filename;
    obj.category = obj.category.toLowerCase();
    let yes = await api.findByCategory(req.body.category);
    if(yes) {
      obj.status = true
        console.log("category present ");
        res.send(obj)
    }
    else {
      obj.status = false
    await api.uploadCategory(obj);
    console.log(obj, "category");
    res.send(obj);
    }
      }


      catch(err) {
          console.log("error", err);
      }
  }
);

router.post("/login/category", async (req, res) => {
  console.log("is this been called !?");
  let data = await api.showCategory();
  //console.log("category has been sent", data);
  res.send(data);
});

router.post('/login/singlePost', async (req, res) => {
  console.log("let's check single post data ", req.body)
  let data = await api.showSinglePost(req.body.id);
  res.send(data);
});

router.post('/login/singlePost/addComments', async (req, res) => {
  let obj = req.body;
  console.log("comment came :", obj);
  let data = await api.addComments(obj._id, obj.comment);
  res.send(obj.comment);

})

module.exports = router;
