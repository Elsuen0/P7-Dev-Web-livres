const multer = require('multer');

// Définition des types MIME acceptés avec les extensions correspondantes
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// configuration du stockage des fichiers 
const storage = multer.diskStorage({
    destination: (req, file, callback) => {

        // Répertoire de destination 
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        // Génération d'un nom de fichier unique 
        const name = file.originalname.split(' ').join('_'); // Remplacement des espaces par des underscore
        const extension = MIME_TYPES[file.mimetype]; // Récupération de l'extension correspondante
        callback(null, name + Date.now() + '.' + extension); // Création du nom + date + .extension 
    }
});

module.exports = multer({ storage: storage }).single('image');