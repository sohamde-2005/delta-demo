
require("dotenv").config();

// console.log(process.env.SECRET);


const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./Utils/wrapAsync.js");
const ExpressError = require("./Utils/ExpressError.js");
// const { listingSchema, reviewSchema } = require("./schema.js");
// const Review = require("./models/review.js");
const session = require("express-session");
// const MongoStore = require('connect-mongo');
const MongoStore = require("connect-mongo").default || require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


// Get MongoDB Atlas connection URL from .env
const dbUrl = process.env.ATLASDB_URL;


app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));



//  const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// const dbUrl = process.env.ATLASDB_URL;

// main().then(()=>{
//     console.log("Connected to DB");
// })
// .catch((err)=>{
//     console.log(err);
// })


// async function main(params) {
//     // await mongoose.connect(MONGO_URL);
//     await mongoose.connect(dbUrl);

// }


const store =  MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600, // passed in seconds 
}
);


store.on("error", (err) => {
    console.log("ERROR in MONGO SESSION STORE", err);
});


const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //Date in miliseconds 7 days * no of hours in each day * no of mintues in each hour * seconds* no of milisecond in each minute
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};





// app.get("/",(req,res)=>{
//     res.send("Hi, I am root");
// });



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




// To convert the joi server side validator into middleware we will convert it into an function


// app.get("/testListing", async (req,res)=>{

//     let sampleListing = new Listing({
//         title:"My New Villa",
//         description:"The City",
//         price:1200,
//         location:"time square, New York",
//         country:"USA",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("Successful  testing");
// });

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    // console.log(res.locals.success); // basically res.locals is an array but it will be an empty array if we dont store anything into it 
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser", async(req,res)=>{

//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);

// });

app.use("/listings", listingRouter);

app.use("/listings/:id/reviews", reviewRouter);

app.use("/", userRouter);


// app.use((err,req,res,next)=>{
//     res.send("Something went wrong!");
// })


// If the request does not matches with the above all routes then 
app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    // res.send("something went wrong!");
    // res.status(statusCode).send(message);
    res.render("error.ejs", { message });
});




// Connect to MongoDB Atlas first
async function main() {
    try {

        if (!dbUrl) {
            throw new Error("ATLASDB_URL is missing. Check your .env file.");
        }

        await mongoose.connect(dbUrl, {
            serverSelectionTimeoutMS: 20000
        });

        console.log("Connected to MongoDB Atlas!");

        // Start Express server only after successful DB connection
        app.listen(8080, () => {
            console.log("Server is working on port 8080");
        });

    } catch (err) {
        console.error("MongoDB connection failed:");
        console.error(err);
        process.exit(1);
    }
}

main();



// app.listen(8080, ()=>{
//     console.log("Server is working to port 8080");
// });
