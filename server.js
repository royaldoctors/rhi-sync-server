const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors()); // VERY IMPORTANT
app.use(express.json());

let storedData = {};

// POST
app.post('/rhi-sync', (req, res) => {
    storedData = req.body;
    res.json({ status: 'saved' });
});

// GET
app.get('/rhi-sync', (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.json(storedData);
});

// Test
app.get('/', (req, res) => {
    res.send('RHI Sync Server is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running'));
