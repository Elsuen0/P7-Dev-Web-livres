const jwt = require('jsonwebtoken');
const Book = require('../models/book');
const fs = require('fs');

exports.addBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    book.save()
        .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
        .catch(error => { res.status(400).json({ error }) })
};



exports.displayBooks = (req, res, next) => {
    Book.find()
        .then((books) => {
            res.json(books);
        })
        .catch((error) => {
            next(error);
        });

};

exports.getBookById = (req, res, next) => {
    const bookId = req.params.id;
    console.log(bookId, 'test')
    Book.findById(bookId)
        .then((book) => {
            if (!book) {
                return res.status(404).json({ message: 'Livre non trouvé.' });
            }
            res.json(book);
        })
        .catch((error) => {
            next(error);
        });
};


exports.updateOne = (req, res, next) => {
    Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};


exports.deleteBooks = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(Book => {
            if (Book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                const filename = Book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

exports.getBestRatedBooks = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .sort({ averageRating: -1 })
        .limit(3)
        .exec()
        .then((books) => {
            res.status(200).json({ books });
        })
        .catch((error) => {
            res.status(400).json({ error: error.message });
        });
};


