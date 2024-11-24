export const queryKeys = {
    user: (userId) => ['user', userId],
    users: ['users'],
    project: (projectId) => ['project', projectId],
    projects: ['projects'],
    facultyProjects: (faculty) => ['projects', 'faculty', faculty],
    projectMetrics: (projectId) => ['metrics', 'project', projectId],
    facultyMetrics: (faculty) => ['metrics', 'faculty', faculty],
    dashboardMetrics: (params) => ['metrics', 'dashboard', params],
    userMetrics: (userId) => ['metrics', 'user', userId],
    userNotifications: (userId) => ['notifications', 'user', userId],
  };