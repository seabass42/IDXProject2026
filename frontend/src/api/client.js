const API_BASE = '/api';

export async function fetchProperties(params = {}) {
  console.log('fetchProperties called with:', params); // add this
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      query.append(key, value);
    }
  });
  console.log('query string:', query.toString()); // add this
  const res = await fetch(`/api/properties?${query.toString()}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}