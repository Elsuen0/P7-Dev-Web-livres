const jwt = require('jsonwebtoken');
const Book = require('../models/book');
const book = require('../models/book');

exports.addBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const thing = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    thing.save()
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

exports.getBooksByBestRating = (req, res, next) => {
    Book.find()
        .sort({ 'ratings.averageRating': -1 })
        .limit(3)
        .then((books) => {
            res.json(books);
        })
        .catch((error) => {
            next(error);
        });
};


exports.deleteBooks = (req, res, next) => {
    const bookId = req.params.id;

    Book.findByIdAndRemove(bookId)
        .then((book) => {
            if (!book) {
                return res.status(404).json({ message: 'Livre non trouvé.' });
            }

            // Supprimer l'image associée
            if (book.imageUrl) {
                const imagePath = path.join(__dirname, '..', 'images', book.imagesUrl);
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error('Erreur lors de la suppression de l\'image :', err);
                    }
                });
            }
            res.json({ message: 'Livre supprimé.' });
        })
        .catch((error) => {
            next(error);
        });
}