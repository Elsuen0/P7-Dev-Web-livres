const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
});

const bookSchema = mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: { type: String, required: true },
    year: { type: Number, required: true },
});

module.exports = mongoose.model('User', userSchema);
module.exports = mongoose.model('Book', bookSchema);
