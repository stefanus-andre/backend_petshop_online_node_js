const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { connection  } =  require('../config/database');
require('dotenv').config();

passport.serializeUser(function(user,done) {
    done(null,user);
});

passport.deserializeUser(function (user, done) {
    done(null,user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => {
    const {id, displayName, emails } =  profile;

    const sql = `SELECT * FROM users WHERE google_id = ?`
    connection.query(sql, [id], (err, results) => {
        if (err) return done(err);

        if (results.length > 0) {
            return done(null, results[0]);
        } else {
            const newUser = {
                google_id: id,
                username: displayName,
                emails: emails[0].value,
            };

            const insertSql = 'INSERT INTO users (google_id, username, email) VALUES (?,?,?)';
            connection.query(insertSql, [id, displayName, emails[0].value], (err,result) => {
                if(err) return done(err);
                newUser.id = result.insertId;
                return done(null, newUser);
            });
        }
    });
}));

module.exports = passport;

