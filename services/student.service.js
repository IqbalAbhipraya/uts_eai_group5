const { Student } = require('../models');

exports.createStudent = async (studentData) => {
    const { nama, email, password, tanggalLahir, jurusan, enrollmentYear } = studentData;

    if (!nama || !email || !password) {
        return res.status(400).json({
            message: "Nama, email, dan password harus diisi",
        });
    }

    const existing = await Student.findOne({ where: { email } });

    if (existing) {
        throw new Error('student already exists');
    }

    const newStudent = await Student.create({
        nama,
        email,
        password,
        tanggalLahir: tanggalLahir || null,
        jurusan: jurusan || null,
        enrollmentYear: enrollmentYear || null
    });


    return newStudent;
};

exports.findAllStudents = async () => {
    const student = await Student.findAll();
    return student;
};

exports.findStudentById = async (id) => {
    const student = await Student.findByPk(id);
    return student;
};

exports.updateStudent = async (id, updateData) => {
    const [num] = await Student.update(updateData, {
        where: {id: id}
    });

    if (num == 1) {
        const updateStudent = await Student.findByPk(id);
        return updateStudent;
    } else {
        throw new Error(`Tidak dapat memperbarui mahasiswa dengan id=${id}.`);
    }
};

exports.deleteStudent = async (id) => {
    const num = await Student.destroy({
        where: {id: id}
    });

    if (num != 1) {
        throw new Error(`Tidak dapat menghapus buku dengan id=${id}.`);
    }
};

