const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/book');

router.post('/', bookCtrl.addBook);
router.get('/', bookCtrl.displayBooks);

module.exports = router;