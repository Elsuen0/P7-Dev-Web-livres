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
    Book.find()
        .sort({ averageRating: -1 })
        .limit(3)
        .exec()
        .then((books) => {
            res.status(200).json(books);
        })
        .catch((error) => {
            res.status(400).json({ error: error.message });
        });
};


exports.ratingBook = (req, res, next) => {
    const userId = req.body.userId; // Récupère l'ID de l'utilisateur depuis le corps de la requête
    const rating = parseInt(req.body.rating); // Récupère la note depuis le corps de la requête et la convertit en entier

    if (isNaN(rating) || rating < 0 || rating > 5) {
        // Vérifie si la note est invalide
        return res
            .status(400)
            .json({ message: "La note doit être comprise entre 0 et 5." });
    }

    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (!book) {
                // Vérifie si le livre n'existe pas
                return res.status(404).json({ message: "Livre non trouvé." });
            }

            const existingRating = book.ratings.find(
                (rating) => rating.userId === userId
            ); // Vérifie s'il existe déjà une note de cet utilisateur pour ce livre

            if (existingRating) {
                // Si une note existe déjà, renvoie une erreur
                return res
                    .status(400)
                    .json({ message: "L'utilisateur a déjà noté ce livre." });
            }

            book.ratings.push({ userId, grade: rating }); // Ajoute la nouvelle note au tableau "ratings" du livre

            const sumOfRates = book.ratings.reduce(
                (sum, rating) => sum + rating.grade,
                0
            ); // Calcule la somme des notes existantes

            const averageRating = sumOfRates / book.ratings.length; // Calcule la note moyenne en divisant la somme par le nombre de notes
            book.averageRating = Math.round(averageRating); // Arrondit la note moyenne à l'entier le plus proche

            book
                .save() // Enregistre le livre mis à jour dans la base de données
                .then(() => res.status(200).json(book)) // Renvoie une réponse avec le livre mis à jour en cas de succès
                .catch((error) => res.status(500).json({ error })); // Renvoie une réponse avec une erreur en cas d'échec de la sauvegarde
        })
        .catch((error) => res.status(500).json({ error })); // Renvoie une réponse avec une erreur en cas d'erreur lors de la recherche du livre
};



