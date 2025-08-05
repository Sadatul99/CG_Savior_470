const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const { verifyToken } = require('../middlewares/authMiddleware');

const getBookmarks = async (req, res) => {
  const db = getDB();
  const email = req.query.email;
  const query = { email: email };
  const result = await db.collection('bookmarks').find(query).toArray();
  res.send(result);
};

const createBookmark = async (req, res) => {
  const db = getDB();
  const bookmarkedCourse = req.body;
  const result = await db.collection('bookmarks').insertOne(bookmarkedCourse);
  res.send(result);
};

const deleteBookmark = async (req, res) => {
  const db = getDB();
  const id = req.params.id;
  const result = await db.collection('bookmarks').deleteOne({ _id: new ObjectId(id) });
  res.send(result);
};

module.exports = {
  getBookmarks,
  createBookmark,
  deleteBookmark
};