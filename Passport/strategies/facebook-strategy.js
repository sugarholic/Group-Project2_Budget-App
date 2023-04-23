// const FacebookStrategy = require("passport-facebook").Strategy;

// require("dotenv").config();

// const knex = require("knex")({
//     client: "postgresql",
//     connection: {
//         database: process.env.database,
//         user: process.env.user,
//         password: process.env.password,
//     },
// });

// module.exports = (passport) => {
//     passport.use(
//         "facebook",
//         new FacebookStrategy(
//             {
//                 clientID: process.env.AppID,
//                 clientSecret: process.env.AppSecret,
//                 callbackURL: `/auth/facebook/callback`,
//                 profileFields: [
//                     "id",
//                     "email",
//                     "name",
//                     "gender",
//                     "displayName",
//                     "profileUrl",
//                 ],
//             },
//             async (accessToken, refreshToken, profile, done) => {
//                 console.log(profile);

//                 let userResult = await knex("users").where({facebookID: profile.id});   //facebookID is a column in the table users (referenced to profile.id)
//                 if(userResult == 0) {
//                     let user = {
//                         facebookID: profile.id,
//                         email: profile.displayName,
//                         accessToken: accessToken,
//                     };
//                     let query = await knex ("users").insert(user).returning("id");
//                     user.id = query[0];
//                     done(null, user);
//                 } else {
//                     done (null, userResult[0]);
//                 }
//             }
//         )
//     )
// };