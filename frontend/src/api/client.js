const API_BASE = '/api';

export async function fetchProperties(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
            query.append(key, value);
        }
    });
    const res = await fetch(`${API_BASE}/properties?${query.toString()}`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
}