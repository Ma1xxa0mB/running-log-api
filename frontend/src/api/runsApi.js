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

export async function fetchRunById(runId) {
  const response = await fetch(`${API_BASE_URL}/runs/${runId}`, {
    credentials: 'include',
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch run');
  }

  return result;
}

export async function updateRunById(runId, runData) {
  const response = await fetch(`${API_BASE_URL}/runs/${runId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(runData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to update run');
  }

  return result;
}

export async function deleteRunById(runId) {
  const response = await fetch(`${API_BASE_URL}/runs/${runId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to delete run');
  }

  return result;
}
