import { API_BASE_URL, handleResponse, getHeaders } from './api.js';

export const authAPI = {
  register: async ({ name, email, password }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ name, email, password })
    });
    return await handleResponse(response);
  },

  login: async ({ email, password }) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password })
    });
    return await handleResponse(response);
  },

  me: async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    return await handleResponse(response);
  }
};