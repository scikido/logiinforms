const express = require('express')
const app = express()
const path = require('path')
const bcrypt = require('bcryptjs')
const port = process.env.PORT || 80
// const mongoose = require('mongoose')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')

const DB = process.env.DATABASE

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => { console.log("success") }).catch((err) => console.log("fail"))

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true

    },
    work: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: true
    }

})

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12)
        this.cpassword = await bcrypt.hash(this.cpassword, 12)
    }
    next();
})
const User = mongoose.model('USER', userSchema)


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