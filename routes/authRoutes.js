const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authControllers');

const router = express.Router();

router.post(
    '/register',
    [
        body('username').notEmpty().withMessage('Username are required'),
        body('email').notEmpty().withMessage('Email is required'),
        body('password').isLength({ min: 6}).withMessage('Password must least 6 character')
    ],
    authController.register
);

router.post('/login', authController.login);
router.post('/logout', authController.logout);

module.exports = router;