const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/book');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/', bookCtrl.displayBooks);
router.post('/', auth, multer, bookCtrl.addBook);
router.get('/bestrating', bookCtrl.getBestRatedBooks);
router.get('/:id', bookCtrl.getBookById);
router.put('/:id', auth, bookCtrl.updateOne)
router.delete('/:id', auth, bookCtrl.deleteBooks);




module.exports = router;