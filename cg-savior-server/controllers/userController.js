const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

const getAllUsers = async (req, res) => {
  const db = getDB();
  const result = await db.collection('users').find().toArray();
  res.send(result);
};

const checkAdmin = async (req, res) => {
  const db = getDB();
  const email = req.params.email;
  if (email !== req.decoded.email) {
    return res.status(403).send({ message: 'forbidden access' });
  }
  const user = await db.collection('users').findOne({ email });
  let admin = false;
  if (user) {
    admin = user?.role === 'admin';
  }
  res.send({ admin });
};

const checkFaculty = async (req, res) => {
  const db = getDB();
  const email = req.params.email;
  if (email !== req.decoded.email) {
    return res.status(403).send({ message: 'forbidden access' });
  }
  const user = await db.collection('users').findOne({ email });
  let faculty = false;
  if (user) {
    faculty = user?.role === 'faculty';
  }
  res.send({ faculty });
};

const createUser = async (req, res) => {
  const db = getDB();
  const user = req.body;
  const existingUser = await db.collection('users').findOne({ email: user.email });
  if (existingUser) {
    return res.send({ message: 'user already exists', insertedId: null });
  }
  const result = await db.collection('users').insertOne(user);
  res.send(result);
};

const deleteUser = async (req, res) => {
  const db = getDB();
  const id = req.params.id;
  const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) });
  res.send(result);
};

const updateUserRole = async (req, res) => {
  const db = getDB();
  const id = req.params.id;
  const { role } = req.body;

  if (!role) {
    return res.status(400).send({ message: "Role is required." });
  }

  const result = await db.collection('users').updateOne(
    { _id: new ObjectId(id) },
    { $set: { role: role } }
  );
  res.send(result);
};

module.exports = {
  getAllUsers,
  checkAdmin,
  checkFaculty,
  createUser,
  deleteUser,
  updateUserRole
};