import axios from 'axios';

const api = axios.create({
    baseURL: '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Companies
export const companyService = {
    findAll: () => api.get('/companies').then(res => res.data),
    findById: (id: number) => api.get(`/companies/${id}`).then(res => res.data),
    create: (data: { name: string; taxNumber: string }) =>
        api.post('/companies', data).then(res => res.data),
    update: (id: number, data: { name: string; taxNumber: string }) =>
        api.put(`/companies/${id}`, data).then(res => res.data),
    delete: (id: number) => api.delete(`/companies/${id}`),
};

// Vehicles
export const vehicleService = {
    findAll: () => api.get('/vehicles').then(res => res.data),
    findById: (id: number) => api.get(`/vehicles/${id}`).then(res => res.data),
    findByCompany: (companyId: number) =>
        api.get(`/vehicles?companyId=${companyId}`).then(res => res.data),
    create: (data: unknown) => api.post('/vehicles', data).then(res => res.data),
    delete: (id: number) => api.delete(`/vehicles/${id}`),
};

// Trips
export const tripService = {
    findAll: () => api.get('/trips').then(res => res.data),
    findByVehicle: (vehicleId: number) =>
        api.get(`/trips?vehicleId=${vehicleId}`).then(res => res.data),
    create: (data: unknown) => api.post('/trips', data).then(res => res.data),
};

// Fuelings
export const fuelingService = {
    findAll: () => api.get('/fuelings').then(res => res.data),
    findByVehicle: (vehicleId: number) =>
        api.get(`/fuelings?vehicleId=${vehicleId}`).then(res => res.data),
    create: (data: unknown) => api.post('/fuelings', data).then(res => res.data),
};