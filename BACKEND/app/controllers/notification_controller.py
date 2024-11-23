from firebase_admin import firestore
from datetime import datetime
class NotificationController:
    @staticmethod
    def create_notification(data):
        try:
            db = firestore.client()
            notif_ref = db.collection('notifications').document()
            
            # Añadir datos adicionales
            data['notificationId'] = notif_ref.id
            data['createdAt'] = datetime.now()
            data['leido'] = []
            
            notif_ref.set(data)
            return {'message': 'Notificación creada exitosamente', 'notificationId': data['notificationId']}
        except Exception as e:
            return {'error': str(e)}, 500

    @staticmethod
    def get_user_notifications(user_id):
        try:
            db = firestore.client()
            notifications = db.collection('notifications')\
                            .where('destinatarios', 'array_contains', user_id)\
                            .order_by('createdAt', direction=firestore.Query.DESCENDING)\
                            .limit(50)\
                            .stream()
            
            return {'notifications': [doc.to_dict() for doc in notifications]}
        except Exception as e:
            return {'error': str(e)}, 500

    @staticmethod
    def mark_as_read(notification_id, user_id):
        try:
            db = firestore.client()
            notif_ref = db.collection('notifications').document(notification_id)
            notif_ref.update({
                'leido': firestore.ArrayUnion([user_id])
            })
            return {'message': 'Notificación marcada como leída'}
        except Exception as e:
            return {'error': str(e)}, 500