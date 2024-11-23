import { useState, useCallback } from 'react';
import api from '../utils/axios';
import toast from 'react-hot-toast';

export const usePhases = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createPhase = useCallback(async (projectId, phaseData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post(`/projects/${projectId}/phases`, phaseData);
      toast.success('Fase creada exitosamente');
      return response.data;
    } catch (err) {
      setError(err.message);
      toast.error('Error al crear la fase');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePhase = useCallback(async (projectId, phaseId, phaseData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.put(
        `/projects/${projectId}/phases/${phaseId}`,
        phaseData
      );
      toast.success('Fase actualizada exitosamente');
      return response.data;
    } catch (err) {
      setError(err.message);
      toast.error('Error al actualizar la fase');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addPhaseComment = useCallback(async (projectId, phaseId, commentData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post(
        `/projects/${projectId}/phases/${phaseId}/comments`,
        commentData
      );
      toast.success('Comentario añadido exitosamente');
      return response.data;
    } catch (err) {
      setError(err.message);
      toast.error('Error al añadir el comentario');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createPhase,
    updatePhase,
    addPhaseComment
  };
};