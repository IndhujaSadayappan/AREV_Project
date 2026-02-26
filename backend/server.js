const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
mongoose.connection.once("open", async () => {
  console.log("Connected DB:", mongoose.connection.name);

  const Test = mongoose.model("Test", new mongoose.Schema({
    name: String
  }));

  await Test.create({ name: "First Entry" });

  console.log("Test document inserted");
});
// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/arev_survey_db';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Survey Schema
const surveySchema = new mongoose.Schema({
  city: { type: String, required: true },
  personId: { type: String, required: true },
  name: { type: String, required: true },
  contact: { type: String, required: true },
  numberPlate: { type: String, required: true },
  vehicleType: { type: String, required: true, enum: ['Own', 'Rent'] },
  investment: { type: Number, default: null }, // only if own
  rentalAmount: { type: Number, default: null }, // only if rent
  dailyKM: { type: Number, required: true },
  petrolExpense: { type: Number, required: true },
  dailyIncome: { type: Number, required: true },
  maintenance: { type: Number, required: true },
  valueOfAuto: { type: Number, default: null }, // only if own
  peakHours: { type: String, required: true },
  totalAutosInCity: { type: Number, required: true },
  nightRideAcceptance: { type: String, required: true }, // Yes/No
  runDaysPerMonth: { type: Number, required: true },
  monthlyProfit: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Survey = mongoose.model('Survey', surveySchema);

// Routes

// 1. Submit Survey
app.post('/api/surveys', async (req, res) => {
  try {
    const newSurvey = new Survey(req.body);
    const savedSurvey = await newSurvey.save();
    res.status(201).json({ message: 'Survey submitted successfully', data: savedSurvey });
  } catch (error) {
    console.error('Submit Error:', error);
    res.status(400).json({ message: 'Error submitting survey', error: error.message });
  }
});

// 2. Get Surveys by personId
app.get('/api/surveys/:personId', async (req, res) => {
  try {
    const { personId } = req.params;
    const surveys = await Survey.find({ personId }).sort({ createdAt: -1 });

    // Calculate stats
    const totalCount = surveys.length;
    const averageProfit = totalCount > 0
      ? surveys.reduce((sum, s) => sum + s.monthlyProfit, 0) / totalCount
      : 0;

    res.status(200).json({
      surveys,
      stats: {
        totalCount,
        averageProfit: averageProfit.toFixed(2)
      }
    });
  } catch (error) {
    console.error('Fetch Error:', error);
    res.status(500).json({ message: 'Error fetching surveys', error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('AREV Consultancy Survey API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
