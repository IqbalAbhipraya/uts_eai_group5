const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/grade.controller');

router.post('/:id', gradeController.gradeStudent);

module.exports = router;