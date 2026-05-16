const API_BASE_URL = 'http://localhost:5000/api';

export const patientAPI = {
    getAllPatients: () => fetch(`${API_BASE_URL}/patients`).then(res => res.json()),
    getPatient: (id) => fetch(`${API_BASE_URL}/patients/${id}`).then(res => res.json()),
    createPatient: (patient) => fetch(`${API_BASE_URL}/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patient)
    }).then(res => res.json()),
    updatePatient: (id, patient) => fetch(`${API_BASE_URL}/patients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patient)
    }).then(res => res.json()),
    deletePatient: (id) => fetch(`${API_BASE_URL}/patients/${id}`, {
        method: 'DELETE'
    }).then(res => res.json())
};