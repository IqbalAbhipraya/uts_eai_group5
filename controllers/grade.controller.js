const gradeService = require('../services/grade.service');

exports.gradeStudent = async (req, res) => {
    try {
        const courseId = req.params.id;          
        const studentId = req.query.studentId;   
        const grade = req.body.grade;            

        if (!studentId || !grade) {
            return res.status(400).json({
                message: "Harap isi studentId (query) dan grade (body)",
            });
        }

        const graded = await gradeService.gradeStudent(courseId, studentId, grade);
        res.status(201).json(graded);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getGrades = async (req, res) => {
    try {
        const courseId = req.params.id; 
        const grades = await gradeService.getGradesByCourse(courseId);
        res.status(200).json(grades);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
