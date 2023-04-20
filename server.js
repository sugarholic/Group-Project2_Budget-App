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
app.use(bodyParser.urlencoded({extended: true})); //send details from front-end 
app.use(bodyParser.json());

//app configuration
app.use(express.static(path.join(__dirname, 'public')));

//get request for home
app.get("/home", (req, res) => {
    res.render ("index");
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

//post
//post sign up
app.post("/user/signUp", bodyParser.json(), (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const password2 = req.body.password2;

    console.log(name, email, password, password2);

    //form validation
    // let errors = [];
    // //if some fields are not filled in in registration --> error
    // if (!name || !email || !password || !password2) {
    //     errors.push({message: "Please enter all fields!"});
    // }
    // //if password are not the same as confirmed password --> error
    // if (password != password2) {
    //     errors.push({message: "Password and confirmed password should be the same"});
    // }

    // if(errors.length > 0) {
    //     res.render("singUp", {errors});
    // }
});

app.listen(port, () => {
    console.log("application is listening to port 8080");
});