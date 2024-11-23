# app/controllers/task_controller.py
from firebase_admin import firestore
from datetime import datetime

class TaskController:
    @staticmethod
    def create_task(project_id, phase_id, task_data):
        try:
            db = firestore.client()
            project_ref = db.collection('projects').document(project_id)
            project = project_ref.get()

            if not project.exists:
                return {'error': 'Proyecto no encontrado'}, 404

            project_data = project.to_dict()
            phases = project_data.get('fases', [])

            # Encontrar la fase correcta
            phase_index = next((i for i, phase in enumerate(phases) 
                              if phase['faseId'] == phase_id), None)
            
            if phase_index is None:
                return {'error': 'Fase no encontrada'}, 404

            # Crear nueva tarea
            task_data.update({
                'tareaId': f"task_{len(phases[phase_index]['tareas']) + 1}",
                'completada': False,
                'fechaCreacion': datetime.now(),
            })

            # Añadir tarea a la fase
            phases[phase_index]['tareas'].append(task_data)

            # Actualizar proyecto
            project_ref.update({
                'fases': phases,
                'updatedAt': datetime.now()
            })

            return {
                'message': 'Tarea creada exitosamente',
                'taskId': task_data['tareaId']
            }

        except Exception as e:
            return {'error': str(e)}, 500

    @staticmethod
    def update_task_status(project_id, phase_id, task_id, status_data):
        try:
            db = firestore.client()
            project_ref = db.collection('projects').document(project_id)
            project = project_ref.get()

            if not project.exists:
                return {'error': 'Proyecto no encontrado'}, 404

            project_data = project.to_dict()
            phases = project_data.get('fases', [])

            # Encontrar la fase y tarea
            for phase in phases:
                if phase['faseId'] == phase_id:
                    for task in phase['tareas']:
                        if task['tareaId'] == task_id:
                            task.update(status_data)
                            task['fechaActualizacion'] = datetime.now()

                            # Actualizar proyecto
                            project_ref.update({
                                'fases': phases,
                                'updatedAt': datetime.now()
                            })

                            return {'message': 'Estado de tarea actualizado'}

            return {'error': 'Tarea no encontrada'}, 404

        except Exception as e:
            return {'error': str(e)}, 500

    @staticmethod
    def assign_task(project_id, phase_id, task_id, user_ids):
        try:
            db = firestore.client()
            project_ref = db.collection('projects').document(project_id)
            project = project_ref.get()

            if not project.exists:
                return {'error': 'Proyecto no encontrado'}, 404

            # Verificar que los usuarios existen
            users_ref = db.collection('users')
            for user_id in user_ids:
                user = users_ref.document(user_id).get()
                if not user.exists:
                    return {'error': f'Usuario {user_id} no encontrado'}, 404

            project_data = project.to_dict()
            phases = project_data.get('fases', [])

            # Encontrar y actualizar la tarea
            for phase in phases:
                if phase['faseId'] == phase_id:
                    for task in phase['tareas']:
                        if task['tareaId'] == task_id:
                            task['asignadoA'] = user_ids
                            task['fechaAsignacion'] = datetime.now()

                            # Actualizar proyecto
                            project_ref.update({
                                'fases': phases,
                                'updatedAt': datetime.now()
                            })

                            return {'message': 'Usuarios asignados exitosamente'}

            return {'error': 'Tarea no encontrada'}, 404

        except Exception as e:
            return {'error': str(e)}, 500