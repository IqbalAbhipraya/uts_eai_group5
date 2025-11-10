const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');

router.post('/add-course', courseController.add);
router.put('/update-course/:id', courseController.update);
router.get('/', courseController.findAll);
router.get('/:id', courseController.findOne);
router.delete('/:id', courseController.delete);

//enrollement
router.post('/:id/enroll-student', courseController.addStudent);
router.get('/:id/students', courseController.getEnrolled);

module.exports = router;