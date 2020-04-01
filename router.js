const express = require("express");
const router = express.Router();
const api = require("./api");
const multer = require("multer");
const sendgrid = require('@sendgrid/mail');
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const upload = multer({
  dest: "/home/com122/Desktop/ppl/clientSide" + "/public/uploadPics"
});
const uploadCategory = multer({
  dest: "/home/com122/Desktop/ppl/clientSide" + "/public/categoryPics"
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

router.post("/login",upload.none(), async (req, res) => {
  try {
    const obj = req.body;
    let user = await api.logIn(req.body.email, req.body.password);
    console.log(req.body.email, req.body.password);
    if (user) {
      obj.status = true;
      console.log(user,"user can log in");
      res.send(obj);
    } else {
      obj.status = false;
      console.log(obj, "user can't log-in");

      res.send(obj);
    }
  } catch (err) {
    console.log("errror : ", err);
  }
});

router.post("/login/upload", upload.single("image"), async (req, res) => {
  let obj = req.body;
  //console.log("req.dataaaaa", req.file);
  obj.image = req.file.filename;
  obj.category = req.body.category.toLowerCase();
  console.log("obj", obj);
  res.send(obj);
  await api.createUpload(obj);
  console.log("upload dbase has been created ...", __dirname);
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
  let data = await api.addComments(obj._id, obj.comment, obj.email);
  console.log("whats has commented returned", data);
  const sendData = {commentedBy:obj.email, comment:obj.comment};
  res.send(sendData);

});

router.post('/forgetpassword',upload.none(), async (req, res) => {
  const data = await api.forgetPassword(req.body.email);
  console.log("forget pass", req.body, data);
  if(data){
    const obj = {_id:data._id, status:true}
    const emailText=`<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body><a href="http://localhost:3000/resetpassword/${data._id}">Click Here to reset the password</a></body></html>`
  const msg = {
    to: req.body.email,
    from: 'aksha.ali@daffodilsw.com',
    subject: 'Reset password of PetSocial account',
    text: 'You can reset your password',
    html: emailText,
  };
  sendgrid.send(msg);
  res.send(obj);
  }
  else {
    const obj = {status:false};
    res.send(obj);
  }
});

router.post('/resetpassword', async(req, res) => {
  console.log("backend data", req.body);
  const data = await api.resetPassword(req.body._id, req.body.password);
  res.send(data);
})

module.exports = router;
