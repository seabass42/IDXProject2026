const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
    try {
        const { city, zipcode, minPrice, maxPrice, beds, baths } = req.query;
        let limit = req.query.limit ?? 20;
        let offset = req.query.offseet ?? 0;

        limit = Number(limit);
        offset = Number(offset);

        if (isNaN(limit) || limit < 1 || limit > 100){
            return res.status(400).json({ error: 'limit must be a number between 1 and 100'});
        }
        if (isNaN(offset) || offset < 0){
            return res.status(400).json({ error: 'offset must be a non-negative number'});
        }
        if (minPrice && isNaN(Number(minPrice))){
            return res.status(400).json({ error: 'minPrice must be a number'});
        }
        if (maxPrice && isNaN(Number(maxPrice))){
            return res.status(400).json({ error: 'maxPrice must be a number'});
        }
        if (beds && isNaN(Number(beds))){
            return res.status(400).json({ error: 'beds must be a number'});
        }
        if (baths && isNaN(Number(baths))){
            return res.status(400).json({ error: 'baths must be a number'});
        }

        const conditions = [];
        const values = [];

        if (city){
            conditions.push('LOWER(TRIM(L_City)) = LOWER(TRIM(?))');
            values.push(city);
        }
        if (zipcode) {
            conditions.push('L_Zip = ?');
            values.push(zipcode);
        }
        if (minPrice){
            conditions.push('L_SystemPrice >+ ?');
            values.push(Number(minPrice));
        }
        if (maxPrice) {
            conditions.push('L_SystemPrice <= ?');
            values.push(Number(maxPrice));
        }
        if (beds) {
            conditions.push('L_Keyword2 >= ?');
            values.push(Number(beds));
        }
        if (baths) {
            conditions.push('LM_Dec_3 >= ?');
            values.push(Number(baths));
        }
        
        const whereClause = conditions.length > 0
            ? 'WHERE ' + conditions.join(' AND ')
            : '';

        const [countResult] = await pool.query(
        `SELECT COUNT(*) as total FROM rets_property ${whereClause}`,
        values
        );
        const total = countResult[0].total;

        const [results] = await pool.query(
        `SELECT * FROM rets_property ${whereClause} LIMIT ? OFFSET ?`,
        [...values, limit, offset]
        );

        res.json({
        total,
        limit,
        offset,
        results
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error'});
    }
});

router.get('/:id/openhouses', async (req, res) => {
    const { id } = req.params;

    if (!id || id.length > 50 || !/^[a-zA-Z0-9_-]+$/.test(id)){
        return res.status(400).json({ error: 'Invalid listing ID format' });
    }

    try {
        const [property] = await pool.query(
            'SELECT id FROM rets_property WHERE L_ListingID = ?',
            [id]
        );

        if (property.length === 0){
            return res.status(404).json({ error: `Property with ID ${id} not found` });
        }

        const [openhouses] = await pool.query(
            `SELECT * FROM rets_openhouse
            WHERE L_ListingID = ?
            ORDER BY OpenHouseDate ASC, OH_StartTime ASC`,
            [id]
        );
        
        res.json(openhouses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    
    if (!id || id.length > 50 || !/^[a-zA-Z0-9_-]+$/.test(id)){
        return res.status(400).json({ error: 'Invalid listing ID format' });
    }

    try {
        const [rows] = await pool.query(
            'SELECT * FROM rets_property WHERE L_ListingID = ?',
            [id]
        );
        if (rows.length === 0){
            return res.status(404).json({ error: `Property with ID ${id} not found` });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;