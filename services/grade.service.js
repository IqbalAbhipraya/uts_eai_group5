const { Grade, Course, Student } = require('../models');

exports.gradeStudent = async (courseId, studentId, gradeValue) => {
    const course = await Course.findByPk(courseId);
    const student = await Student.findByPk(studentId);

    if (!course) {
        throw new Error(`Masukkan id course yang valid`);
    }

    if (!student) {
        throw new Error(`Masukkan id mahasiswa yang valid`);
    }

    // Check if grade record already exists
    const existing = await Grade.findOne({
        where: { courseId, studentId }
    });

    if (existing) {
        existing.grade = gradeValue;
        await existing.save();
        return existing;
    } else {
        const newGrade = await Grade.create({
            courseId,
            studentId,
            grade: gradeValue
        });
        return newGrade;
    }
};

exports.getGradesByCourse = async (courseId) => {
    const grades = await Grade.findAll({
        where: { courseId },
        include: [{ model: Student, attributes: ['nama', 'email'] }]
    });
    return grades;
}
