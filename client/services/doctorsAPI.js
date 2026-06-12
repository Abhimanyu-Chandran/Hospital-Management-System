import { API_BASE_URL, handleResponse, getHeaders } from './api.js';

export const doctorAPI = {
    //GET All Doctors
    getAllDoctors: async () => {
        const response = await fetch(`${API_BASE_URL}/doctors`);
        return await handleResponse(response);
    },

    //GET Single Doctor
    getDoctor: async (id) => {
        const response = await fetch(`${API_BASE_URL}/doctors/${id}`);
        return await handleResponse(response);
    },

    //POST Create Doctor
    createDoctor: async (doctor) => {
        const response = await fetch(`${API_BASE_URL}/doctors`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(doctor)
        });
        return await handleResponse(response);
    },

    //PUT Update Doctor
    updateDoctor: async (id, doctor) => {
        const response = await fetch(`${API_BASE_URL}/doctors/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(doctor)
        });
        return await handleResponse(response);
    },

    //DELETE Doctor
    deleteDoctor: async (id) => {
        const response = await fetch(`${API_BASE_URL}/doctors/${id}`, {
            method: 'DELETE'
        });
        return await handleResponse(response);
    }
};

