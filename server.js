const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = require('./router');

const routerSignUp = require('./routers/registrationLoginPassword');
const routerForPost = require('./routers/post');
const routerforCtaegory = require('./routers/category');

// passport and cookie-session has been installed !

const port = 3002;
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/ppldata', {
    useUnifiedTopology: true,
    useNewUrlParser: true
}, (err) => {
    if (err) {
        console.log("dbase error")
    }
    else console.log("dbase Connected ! ")
});

app.use('/user', router);

app.use('/sign', routerSignUp);
app.use('/posting', routerForPost);
app.use('categoring', routerforCtaegory);

app.listen(port, (req, res) => {
    console.log("connected to server !!");
})