const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/book');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const convertToAvif = require('../middleware/sharp');


router.get('/', bookCtrl.displayBooks);
router.post('/', auth, multer, convertToAvif, bookCtrl.addBook);
router.get('/bestrating', bookCtrl.getBestRatedBooks);
router.get('/:id', bookCtrl.getBookById);
router.put('/:id', auth, multer, convertToAvif, bookCtrl.updateOne)
router.delete('/:id', auth, bookCtrl.deleteBooks);
router.post('/:id/rating', auth, bookCtrl.ratingBook);




module.exports = router;