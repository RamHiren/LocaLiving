if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
const listings = require('./routes/listing.js');
const reviews = require('./routes/review.js');
const user = require('./routes/user.js');

const app = express();
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;
console.log(dbUrl);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,'/public')));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600 // time period in seconds after which session will be updated
});

store.on("error",()=>{
    console.log('Errror in MONGO SESSION STORE',err);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days cookie expiry
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },  
};


app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

main()
   .then(() => {
        console.log('Connected to MongoDB!')
    })
    .catch((err)=>{
        console.log(err);
    });
async function main() {
    await mongoose.connect(dbUrl);
}

/* app.get('/',(req,res)=>{
    res.send('Hello Wanderlust!');
}) */

app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
})

// app.get('/demouser',async (req,res)=>{
//     let fakeuser = new User({
//         email:'student@gmail.com',
//         username: "student",
//     });

//     let registeredUser = await User.register(fakeuser,"helloworld") // helloworld = password
//     res.send(registeredUser);
// })

app.use('/listings',listings);
app.use('/listings/:id/reviews',reviews)
app.use('/',user)


// 404 Error
app.all('*',(req,res,next)=>{
    next(new ExpressError(404,'Page Not Found'));
})

// Error Handling middleware
app.use((err,req,res,next)=>{
    let { statusCode =500 ,message="something want wrong"} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render('listings/error', {err })
})
app.listen(7000,()=>{
    console.log('Server is running on port 7000');
})