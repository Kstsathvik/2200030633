const express = require('express');
const cors = require('cors');
const { fetchNumbers } = require('./Calculator/fetch');

const app = express();
const PORT = 9876;
const MAX_WINDOW_SIZE = 10;

app.use(cors());

const ALLOWED_KEYS = ['p', 'f', 'e', 'r'];

const dataStore = {
  p: [],
  f: [],
  e: [],
  r: []
};

app.get('/numbers/:key', async (req, res) => {
  const key = req.params.key;

  if (!ALLOWED_KEYS.includes(key)) {
    return res.status(400).json({ error: 'Invalid number key' });
  }

  const previousState = [...dataStore[key]];
  const startTimestamp = Date.now();

  try {
    const responseNumbers = await fetchNumbers(key);
    const existingNumbers = new Set(dataStore[key]);

    const freshNumbers = responseNumbers.filter(num => !existingNumbers.has(num));

    let combined = [...dataStore[key], ...freshNumbers];

    if (combined.length > MAX_WINDOW_SIZE) {
      combined = combined.slice(-MAX_WINDOW_SIZE);
    }

    dataStore[key] = combined;

    const average = combined.length
      ? +(combined.reduce((sum, value) => sum + value, 0) / combined.length).toFixed(2)
      : 0;

    const processingTime = Date.now() - startTimestamp;

    if (processingTime < 500) {
      await new Promise(resolve => setTimeout(resolve, 500 - processingTime));
    }

    return res.json({
      windowPrevState: previousState,
      windowCurrState: dataStore[key],
      numbers: freshNumbers,
      avg: average
    });

  } catch (error) {
    return res.status(504).json({ error: 'Unable to fetch from thirdparty server' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is up and running at http://localhost:${PORT}`);
});
