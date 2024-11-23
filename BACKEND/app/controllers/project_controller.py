from firebase_admin import firestore
from datetime import datetime
class ProjectController:
    @staticmethod
    def create_project(data):
        try:
            db = firestore.client()
            project_ref = db.collection('projects').document()
            project_id = project_ref.id
            
            # Añadir datos adicionales
            data['projectId'] = project_id
            data['createdAt'] = datetime.now()
            data['updatedAt'] = datetime.now()
            data['faseActual'] = 0
            data['metricas'] = {
                'tiempoPromedioPorFase': 0,
                'tasasCompletitud': 0,
                'retrasosAcumulados': 0,
                'horasRegistradas': 0
            }
            
            project_ref.set(data)
            return {'message': 'Proyecto creado exitosamente', 'projectId': project_id}
        except Exception as e:
            return {'error': str(e)}, 500

    @staticmethod
    def get_project(project_id):
        try:
            db = firestore.client()
            project_doc = db.collection('projects').document(project_id).get()
            if project_doc.exists:
                return project_doc.to_dict()
            return {'error': 'Proyecto no encontrado'}, 404
        except Exception as e:
            return {'error': str(e)}, 500

    @staticmethod
    def update_project_phase(project_id, phase_data):
        try:
            db = firestore.client()
            project_ref = db.collection('projects').document(project_id)
            
            # Actualizar fase y métricas
            project_ref.update({
                'fases': firestore.ArrayUnion([phase_data]),
                'updatedAt': datetime.now(),
                'faseActual': phase_data['faseId']
            })
            return {'message': 'Fase actualizada exitosamente'}
        except Exception as e:
            return {'error': str(e)}, 500