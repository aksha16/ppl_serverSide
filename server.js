const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const routerForUser = require('./routers/userouter');
const routerForPost = require('./routers/postRouter');
const routerForCategory = require('./routers/categoryRouter');

// passport and cookie-session has been installed !

const port = 3002;
app.use(bodyParser.urlencoded({ extended: false }));
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

app.use('/user', routerForUser);
app.use('/post', routerForPost);
app.use('/category', routerForCategory);

app.listen(port, (req, res) => {
    console.log("connected to server !!");
})