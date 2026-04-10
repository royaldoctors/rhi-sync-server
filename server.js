const express = require('express');
const app = express();

app.use(express.json());

let storedData = {};

// POST - Save data
app.post('/rhi-sync', (req, res) => {
    storedData = req.body;
    res.json({ status: 'saved' });
});

// GET - Fetch data
app.get('/rhi-sync', (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.json(storedData);
});

// Test route (important)
app.get('/', (req, res) => {
    res.send('RHI Sync Server is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on port ' + PORT));
