const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');

const ADMIN_PASSWORD = 'admin123'; // Static admin password

router.get('/', async (req, res) => {
  const notices = await Notice.find().sort({ date: -1 });
  res.json(notices);
});

router.post('/', async (req, res) => {
  const { title, description, password } = req.body;
  if (password !== ADMIN_PASSWORD) return res.status(403).json({ error: 'Unauthorized' });

  const newNotice = new Notice({ title, description });
  await newNotice.save();
  res.status(201).json(newNotice);
});

router.delete('/:id', async (req, res) => {
  const { password } = req.body;
  if (password !== ADMIN_PASSWORD) return res.status(403).json({ error: 'Unauthorized' });

  await Notice.findByIdAndDelete(req.params.id);
  res.json({ message: 'Notice deleted' });
});

module.exports = router;
