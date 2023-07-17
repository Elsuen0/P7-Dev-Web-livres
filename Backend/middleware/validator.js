const validator = require('validator');

const checkRegistrationData = (req, res, next) => {
    const { email, password } = req.body;

    //On vérifie si l'adresse e-mail renseignée et valide
    if (!email || !validator.isEmail(email)) {
        return res.status(400).json({ error: 'Veuillez fournir une adresse email valide !' })
    }

    // On vérifie si le mot de passe renseginé et suffisamment fort
    if (!password || !validator.isStrongPassword(password, { minLenght: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1 })) {
        return res.status(400).json({ error: 'Veuillez fournir un mot de passe plus fort !' })
    }

    next();
};

module.exports = checkRegistrationData;