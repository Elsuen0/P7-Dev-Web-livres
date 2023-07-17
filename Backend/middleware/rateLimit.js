const rateLimit = require('express-rate-limit');

// Définition des options de la limite de fréquence
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Période de temtps en millisecondes (15 minutes)
    max: 300, // Nombre max de requêtes autorisées par fenêtre 
    message: 'Trop de requête depuis cette adresse IP, veuillez réessayer dans quelques minutes'
});

module.exports = limiter;