const express = require('express');
const pool = require('./db');
const app = express();

const propertiesRouter = require('./routes/properties');
app.use('/api/properties', propertiesRouter);


app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ status: 'ok', database: 'connected' });
    } catch (error) {
        res.status(500).json({ status: 'error', database: 'disconnected' });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});