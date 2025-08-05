const { MongoClient } = require('mongodb');
require('dotenv').config();

let db;

const connectDB = async () => {
  try {
    const client = new MongoClient(`mongodb+srv://cgSaviorAdmin:WnczohkZW0kCsuHW@cluster0.agjw6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
    await client.connect();
    db = client.db('saviorDb');
    console.log(' MongoDB Connected');
  } catch (err) {
    console.error(' MongoDB Error:', err);
    process.exit(1);
  }
};

const getDB = () => {
  if (!db) throw new Error('Database not connected!');
  return db;
};

module.exports = { connectDB, getDB };