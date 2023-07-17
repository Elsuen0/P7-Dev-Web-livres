const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Charger les variables d'environnement

exports.signupUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const newUser = new User({
                email: req.body.email,
                password: hash,
            });

            newUser.save()
                .then(() => {
                    res.status(201).json({ message: 'Utilisateur créé avec succès' });
                })
                .catch((error) => {
                    res.status(400).json({ error: 'Une erreur est survenue lors de la création de l\'utilisateur' })
                });
        })
        .catch((error) => {
            res.status(500).json({ error: 'Une erreur est survenue lors du hachage du mot de passe' });
        });
};

exports.loginUser = (req, res, next) => {
    const { email, password } = req.body;

    // Rechercher l'utilisateur dans la base de données par email
    User.findOne({ email })
        .then((user) => {
            if (!user) {
                return res.status(401).json({ message: 'Identifiants invalides' });
            }
            // Vérifier le mot de passe
            bcrypt.compare(password, user.password)
                .then((isValidPassword) => {
                    if (!isValidPassword) {
                        return res.status(401).json({ error: 'Identifiants invalides' });
                    }

                    // Générer un token JWT signé contenant l'_id de l'utilisateur
                    const secretToken = process.env.SECRET_TOKEN; // Utiliser la variable d'environnement
                    const token = jwt.sign({ userId: user._id }, secretToken);

                    // Renvoyer l'_id de l'utilisateur et le token en réponse
                    res.json({ userId: user._id, token });
                })
                .catch((error) => {
                    res.status(400).json({ error: 'Une erreur est survenue lors de la tentative de connexion' });
                });
        })
        .catch((error) => {
            res.status(500).json({ error: 'Une erreur est survenue lors de la recherche de l\'utilisateur' });
        });
};
