import { fetchProperties, fetchPropertyById, fetchOpenHouses, fetchOpenHousesByDateRange } from './client';

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

test('fetchProperties calls correct URL with no params', async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ total: 100, limit: 20, offset: 0, results: [] }),
  });

  const data = await fetchProperties();
  expect(fetch).toHaveBeenCalledWith('/api/properties?');
  expect(data.total).toBe(100);
});

test('fetchProperties includes query params', async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ total: 5, limit: 20, offset: 0, results: [] }),
  });

  await fetchProperties({ city: 'Anaheim', beds: '3' });
  expect(fetch).toHaveBeenCalledWith(
    expect.stringContaining('city=Anaheim')
  );
});

test('fetchProperties throws on non-ok response', async () => {
  global.fetch.mockResolvedValueOnce({
    ok: false,
    status: 500,
  });

  await expect(fetchProperties()).rejects.toThrow('API error: 500');
});

test('fetchPropertyById returns property data', async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ id: 1, L_ListingID: '1115119412' }),
  });

  const data = await fetchPropertyById('1115119412');
  expect(fetch).toHaveBeenCalledWith('/api/properties/1115119412');
  expect(data.L_ListingID).toBe('1115119412');
});

test('fetchPropertyById throws on 404', async () => {
  global.fetch.mockResolvedValueOnce({
    ok: false,
    status: 404,
  });

  await expect(fetchPropertyById('fakeid')).rejects.toThrow('Property not found');
});

test('fetchOpenHouses returns array of open houses', async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [{ id: 1, OpenHouseDate: '2026-08-01' }],
  });

  const data = await fetchOpenHouses('1115119412');
  expect(fetch).toHaveBeenCalledWith('/api/properties/1115119412/openhouses');
  expect(Array.isArray(data)).toBe(true);
});

test('fetchOpenHousesByDateRange passes date params', async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [],
  });

  await fetchOpenHousesByDateRange('2026-08-01', '2026-08-31');
  expect(fetch).toHaveBeenCalledWith(
    expect.stringContaining('startDate=2026-08-01')
  );
});