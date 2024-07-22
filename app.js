if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}


// console.log(process.env.SECRET) // remove this after you've confirmed it is working

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const ejsMate = require('ejs-mate');
app.engine('ejs', ejsMate);
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
const methodOverride = require('method-override');
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require('passport');
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const user = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const { error } = require('console');

// const mongoUrl = 'mongodb://127.0.0.1:27017/wanderlust';
const dbUrl = process.env.ATLASDB_URL;

main().then(() => {
    console.log("successful");
}).catch(err => {
    console.log(err);
})
async function main() {
    await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto: {
        secret: process.env.SECRET, 
    },
    touchAfter:24*3600,
})

store.on("error", ()=>{
    console.log("Error in mongo session store" , err);
});

app.use(session({
    store,
    secret: process.env.SECRET, 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    httpOnly: true,
}));

// app.get("/", (req, res) => {
//     res.send("Hey, I'm root");
// }); 

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




// Middleware to make flash messages available to all views
app.use((req, res, next) => {
    res.locals.success = req.flash('success'); //  Pass flash messages to views
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser", async (req , res)=>{
//     let fakeUser = new user({
//         email: "student@gmail.com",
//         username: "delta-student",
//     });
//     let registerdUser = await User.register(fakeUser , "helloword");
//     res.send(registerdUser);
// });

app.use("/listing", listingsRouter);
app.use("/listing/:id/reviews", reviewsRouter);
app.use("/" , userRouter);

app.get("/testListing", wrapAsync(async (req, res) => {
    let sampleListing = new Listing({
        title: "My new Villa",
        description: "By the beach",
        price: 2000,
        location: "Calangute , Goa",
        country: "India"
    });
    await sampleListing.save();
    console.log(sampleListing);
    console.log("sample was saved");
    res.send("Testing successful");
}));


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.render("./listings/error.ejs", { message });
    // res.status(statusCode).send(message);   
});

app.listen(8080, () => {
    console.log("app is listening on port 8080");
});

