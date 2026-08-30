const request = require('supertest');
const express = require('express');

jest.mock('../db', () => {
  return {
    query: jest.fn(),
  };
});

const pool = require('../db');
const propertiesRouter = require('../routes/properties');

const app = express();
app.use(express.json());
app.use('/api/properties', propertiesRouter);

describe('GET /api/properties', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns 20 properties by default with total count', async () => {
    pool.query
      .mockResolvedValueOnce([[{ total: 53122 }]])
      .mockResolvedValueOnce([[{ id: 1, L_ListingID: '123' }]]);

    const res = await request(app).get('/api/properties');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('results');
    expect(res.body).toHaveProperty('limit', 20);
    expect(res.body).toHaveProperty('offset', 0);
  });

  test('returns 400 for invalid minPrice', async () => {
    const res = await request(app).get('/api/properties?minPrice=abc');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('returns 400 for limit of 0', async () => {
    const res = await request(app).get('/api/properties?limit=0');
    expect(res.status).toBe(400);
  });

  test('returns 400 for limit over 100', async () => {
    const res = await request(app).get('/api/properties?limit=200');
    expect(res.status).toBe(400);
  });

  test('filters by city when provided', async () => {
    pool.query
      .mockResolvedValueOnce([[{ total: 5 }]])
      .mockResolvedValueOnce([[{ id: 1, L_City: 'Anaheim' }]]);

    const res = await request(app).get('/api/properties?city=Anaheim');
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(5);
  });

  test('pagination works with limit and offset', async () => {
    pool.query
      .mockResolvedValueOnce([[{ total: 100 }]])
      .mockResolvedValueOnce([[{ id: 21 }]]);

    const res = await request(app).get('/api/properties?limit=10&offset=20');
    expect(res.status).toBe(200);
    expect(res.body.limit).toBe(10);
    expect(res.body.offset).toBe(20);
  });
});

describe('GET /api/properties/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns full property object for valid id', async () => {
    pool.query.mockResolvedValueOnce([[{ id: 1, L_ListingID: '1115119412' }]]);

    const res = await request(app).get('/api/properties/1115119412');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('L_ListingID');
  });

  test('returns 404 for unknown id', async () => {
    pool.query.mockResolvedValueOnce([[]]);

    const res = await request(app).get('/api/properties/fakeid999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  test('returns 400 for oversized id', async () => {
    const longId = 'a'.repeat(51);
    const res = await request(app).get(`/api/properties/${longId}`);
    expect(res.status).toBe(400);
  });
});

describe('GET /api/properties/:id/openhouses', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns array of open houses for valid property', async () => {
    pool.query
      .mockResolvedValueOnce([[{ id: 1 }]])
      .mockResolvedValueOnce([[{ id: 1, OpenHouseDate: '2026-08-01' }]]);

    const res = await request(app).get('/api/properties/1115119412/openhouses');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('returns empty array when no open houses exist', async () => {
    pool.query
      .mockResolvedValueOnce([[{ id: 1 }]])
      .mockResolvedValueOnce([[]]);

    const res = await request(app).get('/api/properties/1115119412/openhouses');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('returns 404 for unknown property', async () => {
    pool.query.mockResolvedValueOnce([[]]);

    const res = await request(app).get('/api/properties/fakeid999/openhouses');
    expect(res.status).toBe(404);
  });
});