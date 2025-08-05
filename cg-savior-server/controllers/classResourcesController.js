const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

const getAllClassResources = async (req, res) => {
  const db = getDB();
  const result = await db.collection('classResources').find().toArray();
  res.send(result);
};

const createClassResource = async (req, res) => {
  const db = getDB();
  const resource = req.body;
  const result = await db.collection('classResources').insertOne(resource);
  res.send(result);
};

const deleteClassResource = async (req, res) => {
  const db = getDB();
  const id = req.params.id;
  const result = await db.collection('classResources').deleteOne({ _id: new ObjectId(id) });
  res.send(result);
};

module.exports = {
  getAllClassResources,
  createClassResource,
  deleteClassResource
};