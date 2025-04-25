const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/noticeboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'));

const noticeSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: {
    type: Date,
    default: Date.now
  }
});

const Notice = mongoose.model('Notice', noticeSchema);

app.get('/api/notices', async (req, res) => {
  const notices = await Notice.find().sort({ date: -1 });
  res.json(notices);
});

app.post('/api/notices', async (req, res) => {
  const newNotice = new Notice(req.body);
  await newNotice.save();
  res.json(newNotice);
});

app.delete('/api/notices/:id', async (req, res) => {
  await Notice.findByIdAndDelete(req.params.id);
  res.json({ message: 'Notice deleted' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port ${PORT}"));