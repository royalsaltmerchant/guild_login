const express = require('express')
const {
  getUserByToken,
  getAllUsers,
  getUserById,
  getUserByUsername,
  registerUser,
  loginUser,
  verifyJwt,
  editUser,
  resetPassword,
  requestResetEmail
} = require('../controllers/users')

var router = express.Router()

router.get('/users', getAllUsers)
router.get('/get_user', getUserByToken)
router.post('/get_user_by_id', getUserById)
router.post('/get_user_by_username', getUserByUsername)
router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/verify_jwt', verifyJwt)
router.post('/edit_user', editUser)
router.post('/reset_password', resetPassword)
router.post('/request_reset_email', requestResetEmail)

module.exports = router