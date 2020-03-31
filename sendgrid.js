const express = require('express');
const router = express.Router();
const sendgrid = require('@sendgrid/mail');

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

// router.get('/sendgrid', (req, res) => {

// });

const msg = {
    to: 'aksha.ali@daffodilsw.com',
    from: 'aksha.ali@daffodilsw.com',
    subject: 'Sending with Twilio SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };
  sendgrid.send(msg);
