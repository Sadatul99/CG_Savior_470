const jwt = require('jsonwebtoken');
const { getDB } = require('../config/db');

async function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'unauthorized access' });
  }
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'unauthorized access' });
    }
    req.decoded = decoded;
    next();
  });
}

async function verifyAdmin(req, res, next) {
  const db = getDB();
  const email = req.decoded.email;
  const user = await db.collection('users').findOne({ email });
  const isAdmin = user?.role === 'admin';
  if (!isAdmin) {
    return res.status(403).send({ message: 'forbidden access' });
  }
  next();
}

async function verifyFaculty(req, res, next) {
  const db = getDB();
  const email = req.decoded.email;
  const user = await db.collection('users').findOne({ email });
  const isFaculty = user?.role === 'faculty' || user?.role === 'admin';
  if (!isFaculty) {
    return res.status(403).send({ message: 'forbidden access' });
  }
  next();
}

async function verifyFacultyAdmin(req, res, next) {
  const db = getDB();
  const email = req.decoded.email;
  const user = await db.collection('users').findOne({ email });
  const isFacultyAdmin = user?.role === 'faculty' || user?.role === 'admin';
  if (!isFacultyAdmin) {
    return res.status(403).send({ message: 'forbidden access' });
  }
  next();
}

module.exports = {
  verifyToken,
  verifyAdmin,
  verifyFaculty,
  verifyFacultyAdmin
};