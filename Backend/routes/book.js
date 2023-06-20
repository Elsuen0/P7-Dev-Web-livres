const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/book')

router.post('/books', bookCtrl.addBook);

module.exports = router;