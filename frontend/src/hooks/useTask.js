import { useState, useCallback } from 'react';
import api from '../utils/axios';
import toast from 'react-hot-toast';

export const useTasks = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createTask = useCallback(async (projectId, phaseId, taskData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post(
        `/projects/${projectId}/phases/${phaseId}/tasks`,
        taskData
      );
      toast.success('Tarea creada exitosamente');
      return response.data;
    } catch (err) {
      setError(err.message);
      toast.error('Error al crear la tarea');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (projectId, phaseId, taskId, taskData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.put(
        `/projects/${projectId}/phases/${phaseId}/tasks/${taskId}`,
        taskData
      );
      toast.success('Tarea actualizada exitosamente');
      return response.data;
    } catch (err) {
      setError(err.message);
      toast.error('Error al actualizar la tarea');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const assignTask = useCallback(async (projectId, phaseId, taskId, userIds) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post(
        `/projects/${projectId}/phases/${phaseId}/tasks/${taskId}/assign`,
        { userIds }
      );
      toast.success('Tarea asignada exitosamente');
      return response.data;
    } catch (err) {
      setError(err.message);
      toast.error('Error al asignar la tarea');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const completeTask = useCallback(async (projectId, phaseId, taskId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.put(
        `/projects/${projectId}/phases/${phaseId}/tasks/${taskId}`,
        { completed: true }
      );
      toast.success('Tarea completada exitosamente');
      return response.data;
    } catch (err) {
      setError(err.message);
      toast.error('Error al completar la tarea');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createTask,
    updateTask,
    assignTask,
    completeTask
  };
};