//passport
//store login user sessions into browser cookies
// const setupPassport = require("./Passport/passport");
// const router = require("./router")(express);

const LocalStrategy = require("passport-local").Strategy;
// const passport = require("passport");
//compare user password and hashed password
const bcrypt = require("bcrypt");
const { authenticate } = require("passport");

// module.exports = (app) => {
// app.use(passport.initialize());
// app.use(passport.session());

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

function initialize (passport) {
const authenticateUser = (email, password, done) => {
    client.query(`SELECT * FROM users WHERE email = $1`, [email], (err, results) => {
        if(err){
            throw err
        } 
        console.log(results.rows);
        if(results.rows.length > 0) {
            const user = results.rows[0];

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) {
                    throw err
                } if(isMatch) {
                    return done(null, user); //null error and return user with session cookie
                } else {
                    return done(null, false, {message: "Password is incorrect!"});
                }
            });
        } else {  //if no user found in DB
            return done(null, false, {message: "This email is not registered."});
        }
    });
};
    
    passport.use(new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, 
    authenticateUser));

    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser((id, done) => {
        client.query(`SELECT * FROM users WHERE id = $1`, [id], (err, results) => {
            // if(err) {
            //     throw err
            // } 
            return done(null, results.rows[0]);
            // return done(null);
        });
    });
};

// require("./strategies/facebook-strategy")(passport);

// require("./passport/google-strategy");

module.exports = initialize;

// };