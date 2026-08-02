import { fetchProperties } from './client';

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