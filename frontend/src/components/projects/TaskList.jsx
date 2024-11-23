import { useState } from 'react';
import {
  CheckCircleIcon,
  PlusCircleIcon,
  TrashIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { useTasks } from '../../hooks/useTasks';
import { TaskForm } from './TaskForm';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const TaskList = ({ projectId, phaseId, tasks, onTaskUpdate }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const { completeTask, updateTask } = useTasks();

  const handleComplete = async (taskId) => {
    try {
      await completeTask(projectId, phaseId, taskId);
      onTaskUpdate();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleSubmit = async (taskData) => {
    try {
      if (editingTask) {
        await updateTask(projectId, phaseId, editingTask.tareaId, taskData);
      }
      setIsFormOpen(false);
      setEditingTask(null);
      onTaskUpdate();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Tareas</h3>
          <button
            type="button"
            onClick={() => {
              setEditingTask(null);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Nueva Tarea
          </button>
        </div>

        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.tareaId}
              className={`border rounded-lg p-4 ${
                task.completada ? 'bg-green-50' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleComplete(task.tareaId)}
                    className={`p-1 rounded-full ${
                      task.completada
                        ? 'text-green-600 hover:text-green-700'
                        : 'text-gray-400 hover:text-gray-500'
                    }`}
                  >
                    <CheckCircleIcon className="h-6 w-6" />
                  </button>
                  <div>
                    <h4
                      className={`text-sm font-medium ${
                        task.completada ? 'text-green-800' : 'text-gray-900'
                      }`}
                    >
                      {task.descripcion}
                    </h4>
                    <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500">
                      <span>Fecha límite: {format(new Date(task.fechaLimite), 'd MMM yyyy', { locale: es })}</span>
                      <span>•</span>
                      <span>Prioridad: {task.prioridad}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(task)}
                    className="p-1 text-gray-400 hover:text-gray-500"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  {/* Aquí podrías agregar más acciones como eliminar */}
                </div>
              </div>

              {task.asignadoA?.length > 0 && (
                <div className="mt-3 flex items-center space-x-2">
                  <div className="flex -space-x-1">
                    {task.asignadoA.map((userId) => (
                      <img
                        key={userId}
                        className="h-6 w-6 rounded-full ring-2 ring-white"
                        src={`https://ui-avatars.com/api/?name=${userId}`}
                        alt=""
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">
                    {task.asignadoA.length} asignados
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {isFormOpen && (
        <TaskForm
          projectId={projectId}
          phaseId={phaseId}
          task={editingTask}
          onSubmit={handleSubmit}
          onClose={() => {
            setIsFormOpen(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
};
