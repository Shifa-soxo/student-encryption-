 const Student = require("../models/studentModel");

// ADD student
exports.addStudent = async (req, res) => {
  try {
    await Student.create(req.body);
    res.send("Student Added");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// GET all students
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.findAll();
    res.json(students);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
exports.deleteStudent = async (req, res) => {
  try {
    await Student.destroy({
      where: { id: req.params.id }
    });
    res.send("Student Deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
};




// UPDATE student
exports.updateStudent = async (req, res) => {
  try {
    await Student.update(req.body, {
      where: { id: req.params.id }
    });
    res.send("Student Updated");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.json(student);
  } catch (err) {
    res.status(500).send(err.message);
  }
};