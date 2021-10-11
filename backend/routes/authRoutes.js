const {register,login,signOut} = require('../controllers/authController')

const router = require("express").Router();

router.get('/register', register)
router.get('/login', login)
router.get('/signOut', signOut)

module.exports = router
