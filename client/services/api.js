export const API_BASE_URL = 'http://localhost:5000/api';

//Response And Error Handler
export const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    return data;
};

//Global Header Used In Child APIs
export const getHeaders = () => {
    const headers = { 'Content-Type': 'application/json' };
    return headers;
};
