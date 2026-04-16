import { API_BASE_URL } from './client.js';

export async function fetchCurrentUser() {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    credentials: 'include',
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch account');
  }

  return result;
}

export async function updateCurrentUser(userData) {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(userData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to update account');
  }

  return result;
}
