const { getDB } = require('../config/db');

const getAllClassrooms = async (req, res) => {
  const db = getDB();
  const result = await db.collection('classroom').find().toArray();
  res.send(result);
};

const getClassroomByCode = async (req, res) => {
  const db = getDB();
  const result = await db.collection('classroom').findOne({ class_code: req.params.code });
  res.send(result);
};

const checkClassCode = async (req, res) => {
  const db = getDB();
  const code = req.params.code.trim().toLowerCase();
  const existing = await db.collection('classroom').findOne({ class_code: code });
  res.send({ exists: !!existing });
};

const createClassroom = async (req, res) => {
  const db = getDB();
  const resource = req.body;
  try {
    const result = await db.collection('classroom').insertOne(resource);
    res.send(result);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).send({ message: "Class code already exists" });
    } else {
      res.status(500).send({ message: "Server error" });
    }
  }
};

const deleteClassroomWithResources = async (req, res) => {
  const db = getDB();
  const classCode = req.params.code;

  try {
    const classResult = await db.collection('classroom').deleteOne({ class_code: classCode });
    const resourceResult = await db.collection('classResources').deleteMany({ class_code: classCode });

    res.send({
      message: 'Class and associated resources deleted successfully',
      classDeleted: classResult.deletedCount,
      resourcesDeleted: resourceResult.deletedCount,
    });
  } catch (error) {
    console.error('Deletion failed:', error);
    res.status(500).send({ message: 'Server error during deletion' });
  }
};

module.exports = {
  getAllClassrooms,
  getClassroomByCode,
  checkClassCode,
  createClassroom,
  deleteClassroomWithResources
};