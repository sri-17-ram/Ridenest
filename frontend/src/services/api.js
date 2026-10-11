import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Request interceptor - attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/register') &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const resp = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
        const { accessToken } = resp.data.data;
        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// Parent API
export const parentApi = {
  getProfile: () => api.get('/parent/profile'),
  updateProfile: (data) => api.put('/parent/profile', data),
  getChildren: () => api.get('/parent/children'),
  addChild: (data) => api.post('/parent/children', data),
  updateChild: (id, data) => api.put(`/parent/children/${id}`, data),
  deleteChild: (id) => api.delete(`/parent/children/${id}`),
  generateQr: (childId) => api.post(`/parent/children/${childId}/generate-qr`),
  getActiveTrip: () => api.get('/parent/trips/active'),
  getTripHistory: () => api.get('/parent/trips'),
  getTripDetails: (id) => api.get(`/parent/trips/${id}`),
  getLocations: () => api.get('/parent/locations'),
  addLocation: (data) => api.post('/parent/locations', data),
  updateLocation: (id, data) => api.put(`/parent/locations/${id}`, data),
  deleteLocation: (id) => api.delete(`/parent/locations/${id}`),
  getEmergencyContacts: () => api.get('/parent/emergency-contacts'),
  addEmergencyContact: (data) => api.post('/parent/emergency-contacts', data),
  deleteEmergencyContact: (id) => api.delete(`/parent/emergency-contacts/${id}`),
  getTrustedPersons: (childId) => api.get(`/parent/children/${childId}/trusted-persons`),
  addTrustedPerson: (childId, data) => api.post(`/parent/children/${childId}/trusted-persons`, data),
  submitComplaint: (data) => api.post('/parent/complaints', data),
  getComplaints: () => api.get('/parent/complaints'),
  getNotifications: () => api.get('/parent/notifications'),
  markNotificationRead: (id) => api.put(`/parent/notifications/${id}/read`),
};

// Driver API
export const driverApi = {
  getProfile: () => api.get('/driver/profile'),
  updateProfile: (data) => api.put('/driver/profile', data),
  uploadDocument: (type, formData) => api.post(`/driver/documents/${type}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getTrips: () => api.get('/driver/trips'),
  getTodayTrips: () => api.get('/driver/trips/today'),
  startTrip: (tripId) => api.post(`/driver/trips/${tripId}/start`),
  endTrip: (tripId) => api.post(`/driver/trips/${tripId}/end`),
  scanQr: (data) => api.post('/driver/qr/scan', data),
  confirmDrop: (tripId, childId) => api.post(`/driver/trips/${tripId}/drop/${childId}`),
  getVehicles: () => api.get('/driver/vehicles'),
  addVehicle: (data) => api.post('/driver/vehicles', data),
  respondToAccident: (tripId, safe) => api.post(`/driver/trips/${tripId}/accident-response`, { safe }),
};

// Institution API
export const institutionApi = {
  getProfile: () => api.get('/institution/profile'),
  getStudents: () => api.get('/institution/students'),
  addStudent: (data) => api.post('/institution/students', data),
  getTodayTransport: () => api.get('/institution/transport/today'),
  getActiveTransport: () => api.get('/institution/transport/active'),
  markStudentAbsent: (childId) => api.post(`/institution/students/${childId}/absent`),
  raiseMissingAlert: (childId) => api.post(`/institution/students/${childId}/missing-alert`),
  confirmDeparture: (tripId) => api.post(`/institution/trips/${tripId}/confirm-departure`),
};

// Admin API
export const adminApi = {
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getPendingDrivers: () => api.get('/admin/drivers/pending'),
  verifyDriver: (id, status) => api.put(`/admin/drivers/${id}/verify`, { status }),
  getPendingVehicles: () => api.get('/admin/vehicles/pending'),
  verifyVehicle: (id, status) => api.put(`/admin/vehicles/${id}/verify`, { status }),
  getPendingInstitutions: () => api.get('/admin/institutions/pending'),
  approveInstitution: (id, status) => api.put(`/admin/institutions/${id}/approve`, { status }),
  getAllUsers: () => api.get('/admin/users'),
  getActiveTrips: () => api.get('/admin/trips/active'),
  getOpenComplaints: () => api.get('/admin/complaints/open'),
  resolveComplaint: (id, response) => api.put(`/admin/complaints/${id}/resolve`, { response }),
  getAllTrips: () => api.get('/admin/trips'),
};

// GPS API
export const gpsApi = {
  updateLocation: (data) => api.post('/gps/update', data),
  getCurrentLocation: (tripId) => api.get(`/gps/trip/${tripId}/current`),
  getTripPath: (tripId) => api.get(`/gps/trip/${tripId}/path`),
};

export default api;
