// const express = require("express");
// const app = express();
// const passport = require("passport");
// const path = require("path"); 

// //middlewares for the ejs, routes
// app.set('view engine', 'ejs');

// //app configuration
// app.use(express.static(path.join(__dirname, 'public')));


// //use this router.js instead of server.js
// module.exports = (express) => {
//     const router = express.Router();

//     function isLoggedIn(req, res, next) {
//         if(req.isAuthenticated()) {
//             return next();
//         }
//         res.redirect("/signUp")
//     }

//     router.get("/home", (req, res) => {
//         res.render("home");
//     });

//     router.get(
//         "auth/facebook",
//         passport.authenticate("facebook", {
//             scope: ["email", "user_gender", "user_link"],
//         })
//     );
// }



