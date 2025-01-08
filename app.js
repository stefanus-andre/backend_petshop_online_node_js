const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const session = require('express-session');
const itemRoutes = require('./routes/itemRoutes');
const authRoutes = require('./routes/authRoutes');
require('./controllers/googleControllers');  // This imports the Google OAuth strategy

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Session setup
app.use(session({
    secret: 'your-session-secret',
    resave: false,
    saveUninitialized: true
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/items', itemRoutes);
app.use('/api/auth', authRoutes);

app.use(cors({
    origin: 'http://localhost:3001', // Replace with the allowed origin(s)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true // Allow cookies or authentication headers
}));


app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
