const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

const getAllCourses = async (req, res) => {
  const db = getDB();
  const result = await db.collection('courses').find().toArray();
  res.send(result);
};

const getCourseByCode = async (req, res) => {
  const db = getDB();
  const code = req.params.code.toUpperCase();
  try {
    const course = await db.collection('courses').findOne({ course_code: code });
    if (!course) return res.status(404).send({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};no

const createCourse = async (req, res) => {
  const db = getDB();
  const course = req.body;
  const result = await db.collection('courses').insertOne(course);
  res.send(result);
};

const updateCourse = async (req, res) => {
  const db = getDB();
  const code = req.params.code.toUpperCase();
  const data = req.body;
  const updatedCourse = {
    $set: {
      course_title: data.course_title,
      pre_requisite: data.pre_requisite,
      soft_pre_requisite: data.soft_pre_requisite,
      lab: data.lab,
      credit: data.credit,
      course_description: data.course_description
    }
  };
  try {
    const result = await db.collection('courses').updateOne(
      { course_code: code },
      updatedCourse
    );
    if (!result.matchedCount) return res.status(404).send({ message: 'Course not found' });
    res.json(result);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const deleteCourse = async (req, res) => {
  const db = getDB();
  const code = req.params.code;
  const result = await db.collection('courses').deleteOne({ course_code: code });
  res.send(result);
};

module.exports = {
  getAllCourses,
  getCourseByCode,
  createCourse,
  updateCourse,
  deleteCourse
};