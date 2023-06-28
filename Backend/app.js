const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth')
const bookRoutes = require('./routes/books')

const path = require('path');

mongoose.connect('mongodb+srv://lucascapart80:KWwuTzdgRbmIVQnP@cluster0.cuuwr1l.mongodb.net/?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(express.json());
app.use(cors());

console.log('test')

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

module.exports = app;