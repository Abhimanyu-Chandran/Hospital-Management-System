import { API_BASE_URL, handleResponse, getHeaders } from './api.js';

export const appointmentsAPI = {
  // GET all appointments
  getAllAppointments: async () => {
    const response = await fetch(`${API_BASE_URL}/appointments`);
    return await handleResponse(response);
  },

  // GET single appointment
  getAppointment: async (id) => {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`);
    return await handleResponse(response);
  },

  // POST create appointment
  createAppointment: async (appointment) => {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(appointment)
    });
    return await handleResponse(response);
  },

  // PUT update appointment
  updateAppointment: async (id, appointment) => {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(appointment)
    });
    return await handleResponse(response);
  },

  // DELETE appointment
  deleteAppointment: async (id) => {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'DELETE'
    });
    return await handleResponse(response);
  }
};

