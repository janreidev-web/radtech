import mongoose from 'mongoose';

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

async function dbConnect() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGO_URI, {
    bufferCommands: false,
    serverSelectionTimeoutMS: 5000,
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await dbConnect();

    if (req.method === 'POST') {
      const doc = await Score.create(req.body);
      const total   = await Score.countDocuments();
      const beaten  = await Score.countDocuments({ finalScore: { $lt: doc.finalScore } });
      const pct     = total > 1 ? Math.round((beaten / (total - 1)) * 100) : 100;
      return res.status(201).json({ doc, pct, totalCount: total });
    }

    if (req.method === 'GET') {
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
      return res.json(scores);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
