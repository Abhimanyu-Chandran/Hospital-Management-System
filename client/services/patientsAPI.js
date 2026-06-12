import { API_BASE_URL, handleResponse, getHeaders } from './api.js';

export const patientAPI = {
    //GET all patients
    getAllPatients: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/patients`);
            return await handleResponse(response);
        } catch (error) {
            console.error('Error fetching patients:', error);
            throw error;
        }
    },

    //GET single patient
    getPatient: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/patients/${id}`);
            return await handleResponse(response);
        } catch (error) {
            console.error('Error fetching patient:', error);
            throw error;
        }
    },

    //POST create patient
    createPatient: async (patient) => {
        try {
            console.log('Creating patient with data:', patient);
            const response = await fetch(`${API_BASE_URL}/patients`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(patient)
            });
            const data = await handleResponse(response);
            console.log('Patient created successfully:', data);
            return data;
        } catch (error) {
            console.error('Error creating patient:', error);
            throw error;
        }
    },

    //PUT update patient
    updatePatient: async (id, patient) => {
        try {
            console.log('Updating patient:', id, patient);
            const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(patient)
            });
            const data = await handleResponse(response);
            console.log('Patient updated successfully:', data);
            return data;
        } catch (error) {
            console.error('Error updating patient:', error);
            throw error;
        }
    },

    //DELETE patient
    deletePatient: async (id) => {
        try {
            console.log('Deleting patient:', id);
            const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
                method: 'DELETE'
            });
            return await handleResponse(response);
        } catch (error) {
            console.error('Error deleting patient:', error);
            throw error;
        }
    }
};