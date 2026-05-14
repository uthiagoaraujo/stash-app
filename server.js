const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname)));

const MONGO_URI = 'mongodb+srv://uthiagoaraujo:700stash@cluster0.p2bl0xn.mongodb.net/stash?appName=Cluster0';

const dataSchema = new mongoose.Schema({
  key: { type: String, unique: true },
  value: String
});
const Data = mongoose.model('Data', dataSchema);

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

app.get('/api/data', async (req, res) => {
  try {
    const doc = await Data.findOne({ key: 'pf_expenses' });
    const expenses = doc ? JSON.parse(doc.value) : [];
    res.json({ expenses });
  } catch (err) {
    res.json({ expenses: [] });
  }
});

app.post('/api/data', async (req, res) => {
  try {
    const { expenses } = req.body;
    await Data.findOneAndUpdate(
      { key: 'pf_expenses' },
      { value: JSON.stringify(expenses) },
      { upsert: true, new: true }
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Stash running on port ' + PORT));
