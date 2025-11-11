const courseService = require('../services/course.service');

exports.add = async (req, res) => {
    try {
        const courseData = req.body;
        const newCourse = await courseService.createCourse(courseData);
        res.status(201).json(newCourse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.findAll = async (req, res) => {
    try {
        const courses = await courseService.findAllCourses();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.findOne = async (req, res) => {
    try {
        const courseId = req.params.id;
        const course = await courseService.findCourseById(courseId);

        if (course) {
            res.status(200).json(course);
        } else {
            res.status(404).json({ message: `Course dengan id=${courseId} tidak ditemukan`});
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const courseId = req.params.id;
        const updateData = req.body;
        const updateCourseData = await courseService.updateCourse(courseId, updateData);

        res.status(200).json(updateCourseData);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const courseId = req.params.id;
        await courseService.deleteCourse(courseId);

        res.status(200).json({ message: "Successful"});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

exports.addStudent = async (req, res) => {
    try {
        const courseId = req.params.id;
        const studentId = req.body.studentId;

        const addedEnrollment = await courseService.enrollStudent(courseId, studentId);
        res.status(201).json(addedEnrollment);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

exports.getEnrolled = async (req, res) => {
    try {
        const courseId = req.params.id;
        const enrolled = await courseService.getEnrolledStudent(courseId);
        res.status(200).json(enrolled);
    } catch (error) {
        res.status(400).json({ message: error.message });       
    }
}