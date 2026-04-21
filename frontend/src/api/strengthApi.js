import { API_BASE_URL } from './client.js';

export async function fetchStrengthSessions() {
  const response = await fetch(`${API_BASE_URL}/strength-sessions`, {
    credentials: 'include',
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch strength sessions');
  }

  return result;
}

export async function fetchStrengthSessionById(strengthSessionId) {
  const response = await fetch(`${API_BASE_URL}/strength-sessions/${strengthSessionId}`, {
    credentials: 'include',
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch strength session');
  }

  return result;
}

export async function createStrengthSession(strengthSessionData) {
  const response = await fetch(`${API_BASE_URL}/strength-sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(strengthSessionData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to create strength session');
  }

  return result;
}

export async function updateStrengthSessionById(strengthSessionId, strengthSessionData) {
  const response = await fetch(`${API_BASE_URL}/strength-sessions/${strengthSessionId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(strengthSessionData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to update strength session');
  }

  return result;
}

export async function deleteStrengthSessionById(strengthSessionId) {
  const response = await fetch(`${API_BASE_URL}/strength-sessions/${strengthSessionId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to delete strength session');
  }

  return result;
}
