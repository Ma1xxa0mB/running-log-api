import { API_BASE_URL } from './client.js';

export async function fetchRuns() {
  const response = await fetch(`${API_BASE_URL}/runs`, {
    credentials: 'include',
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch runs');
  }

  return result;
}
