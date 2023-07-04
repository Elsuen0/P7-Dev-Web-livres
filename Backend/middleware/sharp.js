const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const convertToAvif = async (req, res, next) => {
    if (!req.file) return next();

    const inputFile = req.file.path;
    const tempOutputFile = path.join(
        path.dirname(inputFile),
        `${path.basename(inputFile, path.extname(inputFile))}.avif`
    );

    try {
        await sharp(inputFile)
            .toFormat("avif")
            .avif({ quality: 60 })
            .toFile(tempOutputFile);

        fs.unlinkSync(inputFile); // Supprimer le fichier d'entrée

        req.file.path = tempOutputFile;
        req.file.mimetype = "image/avif";
        req.file.filename = `${path.basename(inputFile, path.extname(inputFile))}.avif`;
    } catch (err) {
        console.error("Error while converting image:", err);
    }
    next();
};

module.exports = convertToAvif;
