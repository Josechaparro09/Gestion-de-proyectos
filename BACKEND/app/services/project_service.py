from datetime import datetime
from firebase_admin import firestore
from app.services.notification_service import NotificationService

class ProjectService:
    @staticmethod
    def update_project_metrics(project_id):
        try:
            db = firestore.client()
            project_ref = db.collection('projects').document(project_id)
            project_doc = project_ref.get()
            
            if not project_doc.exists:
                return False
                
            project_data = project_doc.to_dict()
            fases = project_data.get('fases', [])
            
            # Calcular métricas
            total_time = 0
            total_tasks = 0
            completed_tasks = 0
            delays = 0
            
            for fase in fases:
                # Tiempo por fase
                if fase.get('fechaFin') and fase.get('fechaInicio'):
                    fase_time = (fase['fechaFin'] - fase['fechaInicio']).days
                    total_time += fase_time
                
                # Tareas y retrasos
                for tarea in fase.get('tareas', []):
                    total_tasks += 1
                    if tarea.get('completada'):
                        completed_tasks += 1
                    if tarea.get('fechaLimite') and tarea.get('fechaLimite') < datetime.now():
                        delays += 1
            
            # Actualizar métricas
            metrics = {
                'tiempoPromedioPorFase': total_time / len(fases) if fases else 0,
                'tasasCompletitud': (completed_tasks / total_tasks * 100) if total_tasks else 0,
                'retrasosAcumulados': delays,
                'horasRegistradas': total_time * 8  # Asumiendo 8 horas por día
            }
            
            project_ref.update({
                'metricas': metrics,
                'updatedAt': datetime.now()
            })
            
            return True
            
        except Exception as e:
            print(f"Error actualizando métricas: {str(e)}")
            return False

    @staticmethod
    def check_project_deadlines():
        try:
            db = firestore.client()
            projects = db.collection('projects').stream()
            
            for project in projects:
                project_data = project.to_dict()
                fase_actual = project_data.get('fases', [])[project_data.get('faseActual', 0)]
                
                for tarea in fase_actual.get('tareas', []):
                    if not tarea.get('completada') and tarea.get('fechaLimite'):
                        deadline = tarea['fechaLimite']
                        days_remaining = (deadline - datetime.now()).days
                        
                        if days_remaining <= 3:  # Alerta para tareas próximas a vencer
                            NotificationService.create_deadline_notification(
                                project_data['projectId'],
                                tarea['tareaId'],
                                tarea['asignadoA'],
                                days_remaining
                            )
                            
        except Exception as e:
            print(f"Error checking deadlines: {str(e)}")