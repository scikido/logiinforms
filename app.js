const express = require('express')
const app = express()
const path = require('path')
const port = 80
// const mongoose = require('mongoose')
const bodyparser = require('body-parser')

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/users', { useNewUrlParser: true, useUnifiedTopology: true });


const userSchema = new mongoose.Schema({
    name: String,
    password: String

});

const User = mongoose.model('User', userSchema);

app.use('/static', express.static('static'))
app.use(express.urlencoded())

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, "views"))

app.get('/', (req, res) => {
    res.render('login')
})
app.get('/signup', (req, res) => {
    res.render('signup')
})
app.post('/', (req, res) => {
    var userdata = new User(req.body)
    userdata.save().then(() => {
        res.send("UserData data has been saved")
    }).catch(() => {
        res.status(400).send("Data couldn't be saved")
    })
})
app.listen(port, () => {
    console.log("app start")
})