import axiosInstance from '../api/axios.config';

const handleResponse = (response) => response.data;

export const apiService = {
  // Usuarios
  users: {
    getUser: (userId) => 
      axiosInstance.get(`/users/${userId}`).then(handleResponse),
    
    updateUser: (userId, data) => 
      axiosInstance.put(`/users/${userId}`, data).then(handleResponse),
    
    createUser: (data) => 
      axiosInstance.post('/users', data).then(handleResponse),
  },

  // Proyectos
  projects: {
    getProject: (projectId) => 
      axiosInstance.get(`/projects/${projectId}`).then(handleResponse),
    
    createProject: (data) => 
      axiosInstance.post('/projects', data).then(handleResponse),
    
    updateProjectPhase: (projectId, data) => 
      axiosInstance.post(`/projects/${projectId}/phases`, data).then(handleResponse),
    
    getProjectsByFaculty: (faculty) => 
      axiosInstance.get(`/projects/faculty/${faculty}`).then(handleResponse),
  },

  // Fases
  phases: {
    createPhase: (projectId, data) => 
      axiosInstance.post(`/projects/${projectId}/phases`, data).then(handleResponse),
    
    updatePhase: (projectId, phaseId, data) => 
      axiosInstance.put(`/projects/${projectId}/phases/${phaseId}`, data).then(handleResponse),
    
    addComment: (projectId, phaseId, data) => 
      axiosInstance.post(`/projects/${projectId}/phases/${phaseId}/comments`, data).then(handleResponse),
  },

  // Tareas
  tasks: {
    createTask: (projectId, phaseId, data) => 
      axiosInstance.post(`/projects/${projectId}/phases/${phaseId}/tasks`, data).then(handleResponse),
    
    updateTask: (projectId, phaseId, taskId, data) => 
      axiosInstance.put(`/projects/${projectId}/phases/${phaseId}/tasks/${taskId}`, data).then(handleResponse),
    
    assignTask: (projectId, phaseId, taskId, userIds) => 
      axiosInstance.post(`/projects/${projectId}/phases/${phaseId}/tasks/${taskId}/assign`, { userIds }).then(handleResponse),
  },

  // Métricas
  metrics: {
    getProjectMetrics: (projectId) => 
      axiosInstance.get(`/metrics/project/${projectId}`).then(handleResponse),
    
    getFacultyReport: (faculty) => 
      axiosInstance.get(`/metrics/faculty/${faculty}`).then(handleResponse),
    
    getDashboardData: (params) => 
      axiosInstance.get('/metrics/dashboard', { params }).then(handleResponse),
    
    getUserMetrics: (userId) => 
      axiosInstance.get(`/metrics/user/${userId}`).then(handleResponse),
  },

  // Notificaciones
  notifications: {
    getUserNotifications: (userId) => 
      axiosInstance.get(`/notifications/user/${userId}`).then(handleResponse),
    
    markAsRead: (notificationId, userId) => 
      axiosInstance.post(`/notifications/${notificationId}/read`, { userId }).then(handleResponse),
  },
};
