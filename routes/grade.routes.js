const express = require('express');
const router = express.Router();
const courseController = require('../controllers/grade.controller');

router.post('/:id', gradeController.gradeStudent);