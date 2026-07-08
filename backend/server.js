const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const studentRoutes = require('./routes/studentRoutes');
const mentorRoutes = require('./routes/mentorRoutes');
const schoolRoutes = require('./routes/schoolRoutes');
const collegeRoutes = require('./routes/collegeRoutes');
const doubtRoutes = require('./routes/doubtRoutes');
const sessionRoutes = require('./routes/sessionRoutes');

app.use('/api/students', studentRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/doubts', doubtRoutes);
app.use('/api/sessions', sessionRoutes);
const messageRoutes = require('./routes/messageRoutes');
app.use('/api/messages', messageRoutes);
const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chat', chatRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected!'))
.catch((err) => console.log('MongoDB Error:', err));

app.get('/', (req, res) => {
  res.send('Thunaivan Backend is Running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});