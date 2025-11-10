const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');

router.post('/add-student', studentController.add);
router.put('/update-student/:id', studentController.update);
router.get('/', studentController.findAll);
router.get('/:id', studentController.findOne);
router.delete('/:id', studentController.delete);

module.exports = router;