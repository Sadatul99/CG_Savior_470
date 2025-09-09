const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  updateUserRole
} = require('../controllers/userController');

// CRUD Routes
router.route('/')
  .get(getAllUsers)
  .post(createUser);

router.route('/email/:email')
  .get(getUserByEmail);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

router.route('/role/:id')
  .patch(updateUserRole);

module.exports = router;