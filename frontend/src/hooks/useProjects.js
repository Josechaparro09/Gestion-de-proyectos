import { useState, useCallback } from 'react';
import api from '../utils/axios';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export const useProjects = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const getProjects = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/projects', { params: filters });
      return response.data;
    } catch (err) {
      setError(err.message);
      toast.error('Error al cargar los proyectos');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getProjectById = useCallback(async (projectId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/projects/${projectId}`);
      return response.data;
    } catch (err) {
      setError(err.message);
      toast.error('Error al cargar el proyecto');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createProject = useCallback(async (projectData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post('/projects', {
        ...projectData,
        facultad: user.facultad,
        programa: user.programa
      });
      toast.success('Proyecto creado exitosamente');
      return response.data;
    } catch (err) {
      setError(err.message);
      toast.error('Error al crear el proyecto');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateProject = useCallback(async (projectId, projectData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.put(`/projects/${projectId}`, projectData);
      toast.success('Proyecto actualizado exitosamente');
      return response.data;
    } catch (err) {
      setError(err.message);
      toast.error('Error al actualizar el proyecto');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getProjects,
    getProjectById,
    createProject,
    updateProject
  };
};