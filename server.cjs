require('dotenv').config();
const dns      = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']); // bypass system DNS that blocks SRV lookups
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGODB_URI;

const ScoreSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  rawScore:      Number,
  timeBonus:     Number,
  finalScore:    Number,
  totalPossible: Number,
  sections:      mongoose.Schema.Types.Mixed,
  createdAt:     { type: Date, default: Date.now },
});
const Score = mongoose.models.Score || mongoose.model('Score', ScoreSchema);

mongoose.connect(MONGO_URI, {
  bufferCommands: false,
  serverSelectionTimeoutMS: 5000,
})
  .then(() => console.log('MongoDB connected to', MONGO_URI?.split('/').at(-1)?.split('?')[0]))
  .catch(err => console.error('MongoDB connection FAILED:', err.message));

const app = express();
app.use(cors());
app.use(express.json());

const isDbReady = () => mongoose.connection.readyState === 1;

app.post('/api/scores', async (req, res) => {
  if (!isDbReady()) return res.status(503).json({ error: 'Database not connected — check MongoDB Atlas IP Access List and MONGODB_URI' });
  try {
    const doc    = await Score.create(req.body);
    const total  = await Score.countDocuments();
    const beaten = await Score.countDocuments({ finalScore: { $lt: doc.finalScore } });
    const pct    = total > 1 ? Math.round((beaten / (total - 1)) * 100) : 100;
    res.status(201).json({ doc, pct, totalCount: total });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/scores', async (req, res) => {
  if (!isDbReady()) return res.status(503).json({ error: 'Database not connected' });
  try {
    const { action } = req.query;
    if (action === 'champion') {
      const total = await Score.countDocuments();
      if (total === 0) return res.json(null);
      const top    = await Score.findOne().sort({ finalScore: -1 }).lean();
      const beaten = await Score.countDocuments({ finalScore: { $lt: top.finalScore } });
      const pct    = total > 1 ? Math.round((beaten / (total - 1)) * 100) : 100;
      return res.json({ ...top, totalCount: total, pct });
    }
    const scores = await Score.find().sort({ finalScore: -1 }).limit(10).lean();
    res.json(scores);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Dev API server on http://localhost:${PORT}`));
