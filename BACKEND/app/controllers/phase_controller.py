# app/controllers/phase_controller.py
from firebase_admin import firestore
from datetime import datetime
from app.services.notification_service import NotificationService

class PhaseController:
    @staticmethod
    def create_phase(project_id, phase_data):
        try:
            db = firestore.client()
            project_ref = db.collection('projects').document(project_id)
            project = project_ref.get()

            if not project.exists:
                return {'error': 'Proyecto no encontrado'}, 404

            project_data = project.to_dict()
            phases = project_data.get('fases', [])

            # Crear nueva fase
            phase_data.update({
                'faseId': len(phases) + 1,
                'tareas': [],
                'progreso': 0,
                'fechaInicio': datetime.now(),
                'comentarios': []
            })

            # Añadir fase al proyecto
            phases.append(phase_data)
            
            project_ref.update({
                'fases': phases,
                'updatedAt': datetime.now()
            })

            return {
                'message': 'Fase creada exitosamente',
                'phaseId': phase_data['faseId']
            }

        except Exception as e:
            return {'error': str(e)}, 500

    @staticmethod
    def update_phase_status(project_id, phase_id, status_data):
        try:
            db = firestore.client()
            project_ref = db.collection('projects').document(project_id)
            project = project_ref.get()

            if not project.exists:
                return {'error': 'Proyecto no encontrado'}, 404

            project_data = project.to_dict()
            phases = project_data.get('fases', [])

            # Actualizar fase
            for phase in phases:
                if phase['faseId'] == phase_id:
                    phase.update(status_data)
                    
                    if status_data.get('completada', False):
                        phase['fechaFin'] = datetime.now()
                        # Notificar al equipo
                        NotificationService.send_phase_completion_notification(
                            project_id,
                            phase_id,
                            project_data['equipo'].values()
                        )

                    project_ref.update({
                        'fases': phases,
                        'updatedAt': datetime.now()
                    })

                    return {'message': 'Estado de fase actualizado'}

            return {'error': 'Fase no encontrada'}, 404

        except Exception as e:
            return {'error': str(e)}, 500

    @staticmethod
    def add_phase_comment(project_id, phase_id, comment_data):
        try:
            db = firestore.client()
            project_ref = db.collection('projects').document(project_id)
            project = project_ref.get()

            if not project.exists:
                return {'error': 'Proyecto no encontrado'}, 404

            project_data = project.to_dict()
            phases = project_data.get('fases', [])

            # Añadir comentario a la fase
            for phase in phases:
                if phase['faseId'] == phase_id:
                    comment_data['fecha'] = datetime.now()
                    phase['comentarios'].append(comment_data)

                    project_ref.update({
                        'fases': phases,
                        'updatedAt': datetime.now()
                    })

                    return {'message': 'Comentario añadido exitosamente'}

            return {'error': 'Fase no encontrada'}, 404

        except Exception as e:
            return {'error': str(e)}, 500