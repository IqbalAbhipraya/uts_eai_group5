const { Course, Student, Enrollment } = require('../models');

exports.createCourse = async (courseData) => {
    const { title, description, instructor } = courseData;

    if (!title || !instructor) {
        return res.status(400).json({
            message: "Title dan instructor harus diisi",
        });
    }

    const newCourse = await Course.create({
        title,
        description: description || null,
        instructor
    });


    return newCourse;
};

exports.findAllCourses = async () => {
    const course = await Course.findAll();
    return course;
};

exports.findCourseById = async (id) => {
    const course = await Course.findByPk(id);
    return course;
};

exports.updateCourse = async (id, updateData) => {
    const [num] = await Course.update(updateData, {
        where: {id: id}
    });

    if (num == 1) {
        const updateCourse = await Course.findByPk(id);
        return updateCourse;
    } else {
        throw new Error(`Tidak dapat memperbarui course dengan id=${id}.`);
    }
};

exports.deleteCourse = async (id) => {
    const num = await Course.destroy({
        where: {id: id}
    });

    if (num != 1) {
        throw new Error(`Tidak dapat menghapus course dengan id=${id}.`);
    }
};

exports.enrollStudent = async (courseId, studentId) => {
    const student = await Student.findByPk(studentId);
    const course = await Course.findByPk(courseId);

    if (!student) {
        throw new Error(`Masukkan id mahasiswa yang valid`); 
    }

    if (!course) {
        throw new Error(`Masukkan id course yang valid`); 
    }

    const enrollment = await Enrollment.create({
        courseId,
        studentId,
        status: "Enrolled"
    })

    return enrollment;
}

exports.getEnrolledStudent = async (courseId) => {
  const course = await Course.findByPk(courseId);
  if (!course) {
    throw new Error("Masukkan id course yang valid");
  }

  const enrolled = await Enrollment.findAll({
    where: { courseId },
    include: [
      {
        model: Student,
        attributes: ['nama']
      },
    ],
  });

  return enrolled;
};

