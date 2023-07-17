const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth');
const checkRegistrationData = require('../middleware/validator');

router.post('/signup', checkRegistrationData, authCtrl.signupUser);
router.post('/login', authCtrl.loginUser);

module.exports = router;