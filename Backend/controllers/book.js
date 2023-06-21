const Book = require("../models/Book");

exports.addBook = (req, res, next) => {
    delete req.body._id;
    console.log('ceci est un test')

    console.log(res)

    const book = new Book({
        ...req.body
    });
    book.save()
        .then(() => res.status(201).json({ message: 'Livre ajouté !' }))
        .catch(error => res.status(400).json({ error }));
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