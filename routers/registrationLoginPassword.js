const express = require("express");
const router = express.Router();
const api = require("../apis/registrationLogin");
const multer = require("multer");
const sendgrid = require('@sendgrid/mail');
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

router.post("/registration",multer().none(), async (req, res) => {
    try {
      let user = await api.findByEmail(req.body.email);
      console.log(req.body.email);
      if (user) {
        console.log("user exists...");
        console.log("user : ", user);
        res.send(true);
      } else {
        console.log("new user created : ", req.body);
        const data = await api.createDb(req.body);
        console.log("what's has come out of registration", data);
        const obj = {_id:data._id, status:true}
        const emailText=`<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body><a href="http://localhost:3000/verifyuser/${data._id}">Click Here to reset the password</a></body></html>`
        const msg = {
        to: req.body.email,
        from: 'aksha.ali@daffodilsw.com',
        subject: 'Reset password of PetSocial account',
        text: 'You can reset your password',
        html: emailText,
    };
    sendgrid.send(msg);
    res.send(false);
      }
    } catch (err) {
      console.log("error", err);
    }
  });

  router.post('/verifyuser', async (req, res) => {
    await api.verifyUser(req.body._id);
  });

  router.post("/login",multer().none(), async (req, res) => {
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

  router.post('/forgetpassword',multer().none(), async (req, res) => {
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
  });

  module.exports = router;