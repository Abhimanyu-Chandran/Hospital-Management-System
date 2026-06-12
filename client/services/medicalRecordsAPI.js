import { API_BASE_URL, handleResponse, getHeaders } from "./api.js";

export const medicalRecordAPI = {
  // GET all medical records
  getAllMedicalRecords: async () => {
    const response = await fetch(`${API_BASE_URL}/medical-records`);
    return await handleResponse(response);
  },

  // GET single medical record
  getMedicalRecord: async (id) => {
    const response = await fetch(`${API_BASE_URL}/medical-records/${id}`);
    return await handleResponse(response);
  },

  // POST create medical record
  createMedicalRecord: async (payload) => {
    const response = await fetch(`${API_BASE_URL}/medical-records`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return await handleResponse(response);
  },

  // PUT update medical record
  updateMedicalRecord: async (id, payload) => {
    const response = await fetch(`${API_BASE_URL}/medical-records/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return await handleResponse(response);
  },

  // DELETE medical record
  deleteMedicalRecord: async (id) => {
    const response = await fetch(`${API_BASE_URL}/medical-records/${id}`, {
      method: "DELETE",
    });
    return await handleResponse(response);
  },
};

