const studentService = require('../services/student.service');

exports.add = async (req, res) => {
    try {
        const studentData = req.body;
        const newStudent = await studentService.createStudent(studentData);
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.findAll = async (req, res) => {
    try {
        const students = await studentService.findAllStudents();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.findOne = async (req, res) => {
    try {
        const studentId = req.params.id;
        const student = await studentService.findStudentById(studentId);

        if (student) {
            res.status(200).json(student);
        } else {
            res.status(404).json({ message: `Buku dengan id=${studentId} tidak ditemukan`});
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const studentId = req.params.id;
        const updateData = req.body;
        const updateStudentData = await studentService.updateStudent(studentId, updateData);

        res.status(200).json(updateStudentData);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const studentId = req.params.id;
        await studentService.deleteStudent(studentId);

        res.status(200).json({ message: "Successful"});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};