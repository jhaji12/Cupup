const express = require("express");
const router = express.Router();
const authcontroller = require('../Controller/authcontroller');
const { requireAuth, currentUser, currentOrder } = require("../Middleware/authmiddleware");



router.get('/signup',authcontroller.signup_get);
router.post('/signup',authcontroller.signup_post);
router.get('/login',authcontroller.login_get);
router.post('/login',authcontroller.login_post);
router.get('/logout', authcontroller.logout_get);






module.exports = router;
