const express = require("express");
const app = express();

//port
const port = 8080;

//middlewares for the ejs, routes
app.set('view engine', 'ejs');

//get request for home
app.get("/", (req, res) => {
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
    res.render("signOut");
});

app.listen(port, () => {
    console.log("application is listening to port 8080");
});