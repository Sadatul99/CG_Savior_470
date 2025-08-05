const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmarkController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, bookmarkController.getBookmarks);
router.post('/', verifyToken, bookmarkController.createBookmark);
router.delete('/:id', verifyToken, bookmarkController.deleteBookmark);

module.exports = router;