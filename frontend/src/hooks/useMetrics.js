import { useState, useCallback } from 'react';
import api from '../utils/axios';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export const useMetrics = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const getDashboardData = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/metrics/dashboard', {
        params: {
          ...filters,
          facultad: user.facultad,
          programa: user.programa
        }
      });
      return response.data;
    } catch (err) {
      setError(err.message);
      toast.error('Error al cargar las métricas');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getProjectMetrics = useCallback(async (projectId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/metrics/project/${projectId}`);
      return response.data;
    } catch (err) {
      setError(err.message);
      toast.error('Error al cargar las métricas del proyecto');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getFacultyReport = useCallback(async (faculty) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/metrics/faculty/${faculty}`);
      return response.data;
    } catch (err) {
      setError(err.message);
      toast.error('Error al cargar el reporte de facultad');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserMetrics = useCallback(async (userId) => {
    try{

        setLoading(true);
        setError(null);
        const response = await api.get(`/metrics/user/${userId}`);
        return response.data;
      } catch (err) {
        setError(err.message);
        toast.error('Error al cargar las métricas del usuario');
        throw err;
      } finally {
        setLoading(false);
      }
    }, []);
  
    const getComparativeReport = useCallback(async (filters) => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/metrics/comparative', { params: filters });
        return response.data;
      } catch (err) {
        setError(err.message);
        toast.error('Error al cargar el reporte comparativo');
        throw err;
      } finally {
        setLoading(false);
      }
    }, []);
  
    return {
      loading,
      error,
      getDashboardData,
      getProjectMetrics,
      getFacultyReport,
      getUserMetrics,
      getComparativeReport
    };
  };