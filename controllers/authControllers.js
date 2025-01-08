const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { validationResult } = require('express-validator');
const { connection } =  require('../config/database');

const SECRET_KEY = 'testing';

exports.register = (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()});
    }

    const { username, email, password } = req.body;

    bcrypt.hash(password, 10, (err,hash) => {
        if (err) return res.status(500).json({error : 'Error hashing password'});

        const sql = 'INSERT INTO users (username,email,password) VALUES (?,?,?)';
        connection.query(sql, [username,email,hash], (err, result) => {
            if (err) {
                if (err.code == 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error : 'Username already exists'});
                }
                return res.status(500).json({ error : 'Database Error'});
            }
            res.status(201).json({ message : 'User register succesfully'});
        });
    });
};

exports.login = (req,res) => {
    const {username, password} = req.body;

    const sql = `SELECT * FROM users WHERE username = ?`;
    connection.query(sql, [username], (err,results) => {
        if (err) return res.status(500).json({ error : 'Database error'});

        if (results.length === 0) {
            return res.status(404).json({ error : 'User not found'});
        }

        const user = results[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ error: 'Error handling password'});

            if (!isMatch) {
                return res.status(401).json({ error : 'Invalid credentials'});
            }

            const token = jwt.sign({id : user.id, username: user.username}, SECRET_KEY, {expiresIn: '1h'});
            res.json({ message: 'Login Successful', token})
        })
    });
}

exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Error logging out' });
        }
        res.json({ message: 'Logout Successful' });
    });
};


exports.googleAuth = (req, res) => {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res);
};

exports.googleAuthCallBack = (req,res) => {
    passport.authenticate('google', {failureRedirect:'/'})(req,res, () => {
        const token = jwt.sign({ id: req.user.id, username:  req.user.username}, SECRET_KEY, {expiresIn: '1h'});
        res.json({ message: 'Login successful with google', token});
    })
}

