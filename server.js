const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");

//facebook strategy
const facebookStrategy = require("passport-facebook").Strategy
//google strategy
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

//get passport.js
const initializePassport = require("./passport");
initializePassport(passport);

const bodyParser = require("body-parser")
const path = require("path");   //for css folder and views (used in sign up, in and out)

//knexfile and knex
const knexfile = require("./knexfile").development
const knex = require("knex")(knexfile);

//config
var pg = require('pg');
var config = {
    user: "catherinelee",
    database: "catherinelee",
    password: "catherine",
    host: "localhost",
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000,
}

var client = new pg.Client(config);
client.connect();

//port
const port = 8080;


//middlewares for the ejs, routes
app.set('view engine', 'ejs');

app.use(bodyParser.json());
//middlewares
app.use(bodyParser.urlencoded({extended: false|true})); //send details from front-end 
app.use(session({
    secret: "superSecret",
    resave: false,   
    saveUninitialized: true
}));

app.use(flash());
//passport middleware
app.use(passport.initialize());
app.use(passport.session());
// app.use(session({
//     secret: "superSecret",
//     resave: true,
//     saveUninitialized: true}));

// //social logins
// app.use(cookieParser());

//app configuration
app.use(express.static(path.join(__dirname, 'public')));


//get requests
//get request for home
app.get("/home", (req, res) => {
    res.render ("home");
});

//get sign up
app.get("/user/signUp", checkAuthenticated, (req, res) => {
    res.render("signUp");
});

//get sign in
app.get("/user/signIn", checkAuthenticated, (req, res) => {
    res.render("signIn");
});

//get sign out
app.get("/user/signOut", checkNotAuthenticated, (req, res) => {
    res.render("signOut")
});
//End get request

//get index
app.get("/budget", (req, res) => {
    res.render("index");
})

//post
//post sign up
app.post("/user/signUp", async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const password2 = req.body.password2;

    console.log({
        name,
        email,
        password,
        password2
    });

    //form validation (1.if all fields are not filled in, 2. if password and password2 does not match)
    let errors = [];

    if (!name || !email || !password ||!password2) {
        errors.push({message: "Please fill in all the fields"});
    }
    if (password !== password2) {
        errors.push({message: "Passwords must match"});
    }
    if(errors.length > 0) {
        res.render("signUp", {errors});
    } else {
        //if user signup successfully
        let hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        //query databse, check if user exists in the DB while signing up
        client.query(`SELECT * from users WHERE email = $1`, [email], (err, results) => {
            if (err) {
                throw err
            } 
            console.log(results.rows);
            //if user is alreadu in the DB
            if(results.rows.length > 0) {
                errors.push({message: "This email is already registered."});
                res.render("signUp", {errors});
            } else {
                //register user 
                client.query(`INSERT INTO users (name, password, email) VALUES ($1, $2, $3) RETURNING id, password`, [name, hashedPassword, email], (err, results) => {
                    if(err) {
                        throw err
                    } 
                    console.log(results.rows);
                    req.flash("success_msg", "Email registered successfuly, please log in.");
                    res.render("signIn");
                })
            }
        })
    }
});

//passport (post)
app.post("/user/signIn", passport.authenticate("local", {
    successRedirect: "/budget",
    failureRedirect: "/user/signIn",
    failureFlash: true    //show messages we set earlier
}));

function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect("/budget");
    } next();
}

function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    res.redirect("user/signIn");
}

//social signIns
//google
passport.use("google", new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/google/callback",    
},
    async(accessToken, refreshToken, profile, done) => {
        const google_id = profile.id;
        const email = profile.emails[0].value;
        console.log("id", google_id);
        console.log("email", email);
        const user = await knex("users").where({google_id}).first();
        if(!user) {
            const newUser = {
                google_id,
                email,
            };
            const id = await knex("users").insert(newUser).returning("id");
            newUser.id = id[0].id;
            return done(null, newUser);
        } else {
            return done(null, user);
        }
    }
));

//get request for google
app.get("/auth/google", passport.authenticate("google", {scope: ["email", "profile"]}));

//define callback url
app.get("/auth/google/callback", passport.authenticate("google", { 
    successRedirect: "/budget",
    failureRedirect: "/user/signIn",
}));


//facebook
passport.use(new facebookStrategy({
    clientID: process.env.AppID,
    clientSecret: process.env.AppSecret,
    callbackURL: `/auth/facebook/callback`,
    profileFields: [          
    "id",
    "email",
    "name",
    "gender",
    "displayName",
    "profileUrl",
    ],
}, async (accessToken, refreshToken, profile, done) => {
    console.log(profile);

    let userResult = await knex("users").where({facebookID: profile.id});
    if(userResult == 0) {
        let user = {
         facebookID: profile.id,
         email: profile.displayName,
        // let accessToken = accessToken;            
        };  
        let query = await knex("users") .insert(user).returning("id");
        user.id = query[0];
        done(null,user);
    } else {
        done(null, userResult[0]);
    }
})
);

//get request for facebook
app.get("/auth/facebook", passport.authenticate("facebook", {scope: "email"}));

//define callback url
app.get('/auth/facebook/callback', passport.authenticate("facebook", { 
    successRedirect: '/budget',
    failureRedirect: '/user/signIn',
}));


app.listen(port, () => {
    console.log("application is listening to port 8080");
});