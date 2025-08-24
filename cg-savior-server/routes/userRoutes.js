const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

router.get('/', userController.getAllUsers);
// router.get('/admin/:email', verifyToken, userController.checkAdmin);
// router.get('/faculty/:email', verifyToken, userController.checkFaculty);
router.post('/', userController.createUser);
// router.delete('/:id', verifyToken, verifyAdmin, userController.deleteUser);
router.patch('/role/:id', userController.updateUserRole);

module.exports = router;