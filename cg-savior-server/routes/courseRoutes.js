const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

router.get('/', courseController.getAllCourses);
router.get('/:code', courseController.getCourseByCode);
router.post('/', courseController.createCourse);
router.patch('/:code', courseController.updateCourse);
router.delete('/:code', courseController.deleteCourse);

module.exports = router;