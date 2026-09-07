const express = require('express');
const router = express.Router();
const { extractDigest } = require('../services/aiService');
const Digest = require('../models/Digest');

router.post('/generate', async (req, res) => {
  const { notes } = req.body;

  if (!notes || typeof notes !== 'string' || notes.trim().length < 20) {
    return res.status(400).json({
      error: 'Please provide at least 20 characters of meeting notes.',
    });
  }

  if (notes.length > 10000) {
    return res.status(400).json({
      error: 'Notes are too long. Please keep them under 10,000 characters.',
    });
  }

  try {
    const extracted = await extractDigest(notes);

    const digest = new Digest({
      notes,
      decisions: extracted.decisions,
      actionItems: extracted.actionItems,
      openQuestions: extracted.openQuestions,
    });

    await digest.save();

    res.json(digest);
  } catch (err) {
    console.error('AI extraction failed:', err.message);
    res.status(500).json({ error: 'Failed to generate digest. Please try again.' });
  }
});

router.get('/', async (req, res) => {
  try {
    const digests = await Digest.find().sort({ createdAt: -1 });
    res.json(digests);
  } catch (err) {
    console.error('Failed to fetch digests:', err.message);
    res.status(500).json({ error: 'Failed to load past digests.' });
  }
});

module.exports = router;