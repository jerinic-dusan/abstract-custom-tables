const express = require('express');
const userController = require('../controller/users');
const router = express.Router();
const auth = require("../middleware/auth");

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/reload', auth, userController.reload);

module.exports = router;