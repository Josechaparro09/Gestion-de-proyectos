import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNotificationStore } from '../store/notificationStore';

export const useFormValidation = (schema, onSubmit) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addNotification = useNotificationStore((state) => state.addNotification);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmitHandler = useCallback(
    async (data) => {
      setIsSubmitting(true);
      try {
        await onSubmit(data);
        addNotification({
          type: 'success',
          title: 'Éxito',
          message: 'Operación completada correctamente',
        });
        reset();
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: error.response?.data?.error || error.message,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit, addNotification, reset]
  );

  return {
    register,
    handleSubmit: handleSubmit(onSubmitHandler),
    errors,
    isSubmitting,
    reset,
    setValue,
    watch,
  };
};