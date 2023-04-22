const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const path = require("path");   //for css folder and views (used in sign up, in and out)

//knexfile and knex
const knexfile = require("./knexfile").development
const knex = require("knex")(knexfile);

//port
const port = 8080;

//middlewares for the ejs, routes
app.set('view engine', 'ejs');
//middlewares
app.use(bodyParser.urlencoded({extended: false})); //send details from front-end 
app.use(bodyParser.json());

//app configuration
app.use(express.static(path.join(__dirname, 'public')));

//get request for home
app.get("/home", (req, res) => {
    res.render ("home");
});

//get sign up
app.get("/user/signUp", (req, res) => {
    res.render("signUp");
});

//get sign in
app.get("/user/signIn", (req, res) => {
    res.render("signIn");
});

//get sign out
app.get("/user/signOut", (req, res) => {
    res.render("signOut")
});

//get index
app.get("/budget", (req, res) => {
    res.render("index");
})

//post
//post sign up
app.post("/user/signUp", bodyParser.json(), (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const password2 = req.body.password2;

    console.log(name, email, password, password2);

    //form validation (1.if all fields are not filled in, 2. if password and password2 does not match)
    let errors = [];

    if (!name || !email || !password ||!passwrod2) {
        errors.push({message: "Please fill in all the fields"});
    }
    if (password !== password2) {
        errors.push({message: "Passwords must match"});
    }
    if(errors.length > 0) {
        res.render("signUp", (errors));
    } 
});

app.listen(port, () => {
    console.log("application is listening to port 8080");
});