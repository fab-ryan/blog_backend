import express from 'express';
import dotenv from 'dotenv';
import db_connect from './db/index.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
dotenv.config();
db_connect;

const app = express();
app.use(express.json());

const schema = mongoose.Schema;
const registerSchema = new schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
  },
  password: {
    type: String,
  },
  create_at:{
    type: Date,
    default: new Date(),
  }
});
const RegisterModal = mongoose.model('register', registerSchema);

app.post('/register', async (req, res) => {
  try {
    const solt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, solt);
    const register = await RegisterModal.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    });
    await register.save();
    res.json({ message: 'success', data: register });
  } catch (error) {
    res.status(500).json({ message: 'error', error: error });
  }
});

app.post('/login', async (req, res) => {
  try {
    const user = await RegisterModal.findOne({ email: req.body.email });
    if (!user) {
      res.status(400).json({ message: 'error', error: 'Invalid email' });
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      res.status(400).json({ message: 'error', error: 'Invalid password' });
    }
    user.password = undefined;
    const token = jwt.sign({ _id: user._id, user: user }, process.env.SECRET, {
      expiresIn: '1h',
    });
    res.json({ message: 'success', token: token });
  } catch (error) {
    res.status(500).json({ message: 'error', error: error });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
