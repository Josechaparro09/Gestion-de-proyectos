from datetime import datetime
from firebase_admin import firestore

class NotificationService:
    @staticmethod
    def create_deadline_notification(project_id, task_id, assigned_users, days_remaining):
        try:
            notification_data = {
                'tipo': 'DEADLINE',
                'mensaje': f'Tarea próxima a vencer en {days_remaining} días',
                'projectId': project_id,
                'destinatarios': assigned_users,
                'prioridad': 'ALTA' if days_remaining <= 1 else 'MEDIA',
                'accion': {
                    'tipo': 'VER_TAREA',
                    'url': f'/projects/{project_id}/tasks/{task_id}'
                },
                'metadata': {
                    'taskId': task_id,
                    'daysRemaining': days_remaining
                }
            }
            
            db = firestore.client()
            notif_ref = db.collection('notifications').document()
            notification_data['notificationId'] = notif_ref.id
            notification_data['createdAt'] = datetime.now()
            notification_data['leido'] = []
            
            notif_ref.set(notification_data)
            return True
            
        except Exception as e:
            print(f"Error creating notification: {str(e)}")
            return False

    @staticmethod
    def send_phase_completion_notification(project_id, phase_id, team_members):
        try:
            notification_data = {
                'tipo': 'CAMBIO_ESTADO',
                'mensaje': f'Fase {phase_id} completada',
                'projectId': project_id,
                'destinatarios': team_members,
                'prioridad': 'MEDIA',
                'accion': {
                    'tipo': 'VER_FASE',
                    'url': f'/projects/{project_id}/phases/{phase_id}'
                },
                'metadata': {
                    'phaseId': phase_id,
                    'status': 'COMPLETED'
                }
            }
            
            db = firestore.client()
            notif_ref = db.collection('notifications').document()
            notification_data['notificationId'] = notif_ref.id
            notification_data['createdAt'] = datetime.now()
            notification_data['leido'] = []
            
            notif_ref.set(notification_data)
            return True
            
        except Exception as e:
            print(f"Error sending phase completion notification: {str(e)}")
            return False