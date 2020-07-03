const express = require("express");
const router = express.Router();
const api = require("../apis/userApi");
const multer = require("multer");
const sendgrid = require("@sendgrid/mail");
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

router.post("/registration", multer().none(), async (req, res) => {
  try {
    let user = await api.findByEmail(req.body.email, req.body.username);
    if (user) {
      console.log("user exists...");
      res.send(true);
    } else {
      try {
        const data = await api.createDb(req.body);
        console.log("what's has come out of registration", data);
        const emailText = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body><a href="http://localhost:3000/verifyuser/${data._id}">Click Here to verify user</a></body></html>`;
        const msg = {
          to: req.body.email,
          from: "aksha.ali@daffodilsw.com",
          subject: "Verify for PetSocial account",
          text: "You can verify your user email",
          html: emailText
        };
        sendgrid.send(msg);
        res.send(false);
      } catch (err) {
        console.log("errrooorr", err);
      }
    }
  } catch (err) {
    console.log("error", err);
  }
});

router.post("/verifyuser", async (req, res) => {
  await api.verifyUser(req.body._id);
});

router.post("/login", multer().none(), async (req, res) => {
  try {
    const obj = {};
    let user = await api.logIn(req.body.email);
    if (user) {
      try {
        const passCheck = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if (passCheck) {
          const userObj = { ...user }._doc;
          userObj.status = true;
          delete userObj.password;
          console.log(userObj, "user can log in");
          //jwt here
          const payload = { userData: userObj };
          jwt.sign({ payload }, "secret_key", (err, token) => {
            if (err) console.log("jwt err", err);
            else {
              console.log("token lets see ", token, "^^", userObj);
              res.send({ token });
            }
          });
        } else {
          obj.status = false;
          console.log(obj, "user can't log-in");

          res.send(obj);
        }
      } catch (err) {
        console.log("err==", err);
      }
    } else {
      obj.status = false;
      console.log(obj, "user can't log-in");

      res.send(obj);
    }
  } catch (err) {
    console.log("errror : ", err);
  }
});

router.post("/jwtverify", multer().none(), (req, res) => {
  console.log("res.body jwt verifaction", req.body);
  jwt.verify(req.body.token, "secret_key", (err, authData) => {
    if (err) {
      console.log("err", err);
    } else {
      console.log("authdata", authData);
      res.json(authData);
    }
  });
});

router.post("/forgetpassword", multer().none(), async (req, res) => {
  const data = await api.forgetPassword(req.body.email);
  console.log("forget pass", req.body, data);
  if (data) {
    const obj = { _id: data._id, status: true };
    const emailText = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body><a href="http://localhost:3000/resetpassword/${data._id}">Click Here to reset the password</a></body></html>`;
    const msg = {
      to: req.body.email,
      from: "aksha.ali@daffodilsw.com",
      subject: "Reset password of PetSocial account",
      text: "You can reset your password",
      html: emailText
    };
    sendgrid.send(msg);
    res.send(obj);
  } else {
    const obj = { status: false };
    res.send(obj);
  }
});

router.post("/resetpassword", async (req, res) => {
  console.log("backend data", req.body);
  const data = await api.resetPassword(req.body._id, req.body.password);
  res.send(data);
});

// router.post("/usernames", async(req, res)  => {
//   const  data =  await api.allUsernames();
// })


router.post("/usernames", async(req,  res) => {
  const data = await api.allUsernames();
  console.log("data of username",  data);
  res.send(data);

})

module.exports = router;
