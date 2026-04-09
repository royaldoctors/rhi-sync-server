const express = require('express');
const app = express();

app.use(express.json());

let storedData = {};

app.post('/rhi-sync', (req, res) => {
    storedData = req.body;
    res.json({ status: 'saved' });
});

app.get('/rhi-sync', (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.json(storedData);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running'));
