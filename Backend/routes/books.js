const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/book');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const book = require('../models/book');

router.post('/', auth, multer, bookCtrl.addBook);
router.get('/', bookCtrl.displayBooks);
router.get('/bestrating', bookCtrl.getBooksByBestRating);
router.get('/:id', bookCtrl.getBookById);
router.delete('/:id', auth, bookCtrl.deleteBooks);


module.exports = router;