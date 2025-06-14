if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

console.log(process.env.SECRET)

const express = require('express')
const app = express()
const path = require('path')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const session = require('express-session')
const MongoStore = require('connect-mongo');
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const dbUrl = 'mongodb://127.0.0.1:27017/yelp-camp'

const ExpressError = require('./utilities/ExpressError')
const Joi = require('joi')

const userRoutes = require('./routes/users.js')
const campgroundRoutes = require('./routes/campground.js')
const reviewRoutes = require('./routes/reviews.js')

const mongoose = require('mongoose')
const campground = require('./models/campground')
mongoose.connect(dbUrl)


const db = mongoose.connection
db.on('error' , console.error.bind(console , 'connection error :'))
db.once('open' , () =>{
    console.log('Database Connected')
})

app.engine('ejs' , ejsMate)
app.set('view engine' , 'ejs')
app.set('views' , path.join(__dirname , 'views'))

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
// app.use(express.static('public'))
app.use(express.static(path.join(__dirname, "public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e);
});


const sessionConfig = {
    secret: 'thisshouldbebetterasecret!',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7 ,
        maxAge: 1000 * 60 * 60 * 24 * 7 
    }
}

app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())



app.use((req , res , next) =>{
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})



app.use('/' , userRoutes)
app.use('/campgrounds' , campgroundRoutes)
app.use('/campgrounds/:id/reviews' , reviewRoutes)

app.get('/' , (req , res) =>{
    res.render('home')
})


app.all('*' , (req , res , next) =>{
    next(new ExpressError('Page Not Found' , 404))
})

app.use((err , req , res , next) =>{
    const {statusCode = 500 } = err
    if(!err.message) err.message = 'Oh No , Something Went Wrong!'
    res.status(statusCode).render('error' , {err})
})



app.listen(3000 , () =>{
    console.log('Serving on port 3000')
})