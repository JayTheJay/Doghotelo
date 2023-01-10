

// env.NODE_ENV = environment variable - if in development mode, require dotenv package, so use vars in node app
if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
// NODE_ENV=production node app.js   

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require ('method-override');
const  ExpressError = require("./utils/ExpressError");
const passport = require('passport');
const LocalStrategy = require ('passport-local');
const User = require ('./models/user');

const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const userRoutes  = require('./routes/users');
const doghotelRoutes = require('./routes/doghotels');
const reviewRoutes = require('./routes/reviews');
const { secureHeapUsed } = require('crypto');





mongoose.connect('mongodb://localhost:27017/doghotels', {
useNewUrlParser: true, 
useUnifiedTopology: true,
//useCreateIndex: true,
// useFindAndModify: false
//useCreateIndex: true not needed anymore
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


// app.use(json()) parse every request body as json- will be called for every single request 

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
// against mongo injection:
app.use(mongoSanitize())


const sessionConfig = {
    name: 'session',
    secret: "thiswillbeabettersecret",
    resave: false, 
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000* 60 * 60,
        maxAge:  1000* 60 * 60,
        httpOnly: true,
        // only login via https - for deployment
       // secure: true

    }
}
//app.use((req, res, next) => {
  //  req.reqestTime = Date.now();
    //console.log(req.method.toUpperCase(), req.path);
    //console.log(`request date: ${req.reqestTime}`)
    //next();
//})

app.use(session(sessionConfig));
app.use(flash());
//enabling all 11 middlewares from helmet
// app.use(helmet(
//     {contentSecurityPolicy: false}
// ));



// const scriptSrcUrls = [
//     "https://stackpath.bootstrapcdn.com/",
//     "https://api.tiles.mapbox.com/",
//     "https://api.mapbox.com/",
//     "https://kit.fontawesome.com/",
//     "https://cdnjs.cloudflare.com/",
//     "https://cdn.jsdelivr.net",
// ];
// const styleSrcUrls = [
//     "https://kit-free.fontawesome.com/",
//     "https://stackpath.bootstrapcdn.com/",
//     "https://api.mapbox.com/",
//     "https://api.tiles.mapbox.com/",
//     "https://fonts.googleapis.com/",
//     "https://use.fontawesome.com/",
// ];
// const connectSrcUrls = [
//     "https://api.mapbox.com/",
//     "https://a.tiles.mapbox.com/",
//     "https://b.tiles.mapbox.com/",
//     "https://events.mapbox.com/",
// ];
// const fontSrcUrls = [];
// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             defaultSrc: [],
//             connectSrc: ["'self'", ...connectSrcUrls],
//             scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
//             styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//             workerSrc: ["'self'", "blob:"],
//             objectSrc: [],
//             imgSrc: [
//                 "'self'",
//                 "blob:",
//                 "data:",
//                 "https://res.cloudinary.com/ddrhjppie/",
//                 "https://images.unsplash.com/",
//             ],
//             fontSrc: ["'self'", ...fontSrcUrls],
//         },
//     })
// );




app.use(passport.initialize());
// for persistent login sessions
app.use(passport.session());    
passport.use(new LocalStrategy(User.authenticate()));  


// serialize: how do we store a user in the session- add serializeuser and deserializeuser as methods
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//next()-- passing next non-error handling middleware

app.use((req, res, next) => {
    console.log(req.query);
    console.log(req.session);
    // we have automatically access to it in every tempalte 
    res.locals.currentUser = req.user;
    // for flash: session needs to be configured
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/', userRoutes);
app.use('/doghotels', doghotelRoutes);
app.use('/doghotels/:id/reviews', reviewRoutes);

//app.get()



app.get('/', (req,res) => {
    res.render('home')
});

app.get('/apfel', (req,res) => {
    res.render('apfel')
});


// app.use((req, res) => {
//     res.status(404).send("Not Found!");
// })

//4 params = error handling middleware
// custom error handler
// app.use((err, req, res, next) => {
//     //destructure status from error, default value
//     const {status = 500, message= 'Sth went wrong'} =err;
//     // send status instrad of standard response thorugh js
//     res.status(status).send(message);
// })

//for every path
app.all('*', (req, res, next) => {
    //res.send("404!!!")
    next(new ExpressError('Page Not Found', 404))
})

// next will hit this error handler, err will be expresserrror above/ or another error if coming from somewhere else

app.use((err, req, res, next) => {  
    const {status= 500} = err;
    if (!err.message) err.message ="Oh No Sth went wrong"
    res.status(status).render("error", { err });
      })

app.listen(3000, () => {
    console.log('Serving on port 3000')
})