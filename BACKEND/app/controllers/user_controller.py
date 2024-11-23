# app/controllers/user_controller.py
from firebase_admin import firestore
from datetime import datetime
import json

class UserController:
    @staticmethod
    def create_user(data):
        try:
            # Validar datos requeridos
            required_fields = ['email', 'nombreCompleto', 'rol', 'facultad', 'programa']
            for field in required_fields:
                if field not in data:
                    return {'error': f'El campo {field} es requerido'}, 400

            db = firestore.client()
            
            # Si no se proporciona un uid, generar uno
            if 'uid' not in data:
                user_ref = db.collection('users').document()
                data['uid'] = user_ref.id
            else:
                user_ref = db.collection('users').document(data['uid'])
            
            # Verificar si el email ya existe
            email_query = db.collection('users').where('email', '==', data['email']).limit(1).get()
            if len(list(email_query)) > 0:
                return {'error': 'El email ya está registrado'}, 400

            # Añadir campos de auditoria
            data['createdAt'] = datetime.now()
            data['lastLogin'] = datetime.now()
            
            # Establecer valores por defecto
            if 'estado' not in data:
                data['estado'] = {
                    'aprobado': False,
                    'activo': True,
                    'fechaAprobacion': None
                }
            
            if 'proyectos' not in data:
                data['proyectos'] = []
                
            if 'configuraciones' not in data:
                data['configuraciones'] = {
                    'notificacionesEmail': True,
                    'temaOscuro': False,
                    'idiomaPreferido': 'es'
                }
            
            # Convertir fechas a formato compatible con Firestore
            for key in ['createdAt', 'lastLogin']:
                if isinstance(data[key], str):
                    data[key] = datetime.fromisoformat(data[key].replace('Z', '+00:00'))
            
            if data['estado'].get('fechaAprobacion'):
                if isinstance(data['estado']['fechaAprobacion'], str):
                    data['estado']['fechaAprobacion'] = datetime.fromisoformat(
                        data['estado']['fechaAprobacion'].replace('Z', '+00:00')
                    )
            
            # Guardar en Firestore
            user_ref.set(data)
            
            return {
                'message': 'Usuario creado exitosamente',
                'uid': data['uid']
            }
            
        except Exception as e:
            print(f"Error creating user: {str(e)}")
            return {'error': str(e)}, 500

    @staticmethod
    def get_user(uid):
        try:
            db = firestore.client()
            user_doc = db.collection('users').document(uid).get()
            
            if user_doc.exists:
                user_data = user_doc.to_dict()
                # Convertir fechas a formato ISO para JSON
                user_data['createdAt'] = user_data['createdAt'].isoformat() if user_data.get('createdAt') else None
                user_data['lastLogin'] = user_data['lastLogin'].isoformat() if user_data.get('lastLogin') else None
                if user_data.get('estado', {}).get('fechaAprobacion'):
                    user_data['estado']['fechaAprobacion'] = user_data['estado']['fechaAprobacion'].isoformat()
                return user_data
                
            return {'error': 'Usuario no encontrado'}, 404
            
        except Exception as e:
            return {'error': str(e)}, 500

    @staticmethod
    def update_user(uid, data):
        try:
            db = firestore.client()
            user_ref = db.collection('users').document(uid)
            
            # Verificar si el usuario existe
            if not user_ref.get().exists:
                return {'error': 'Usuario no encontrado'}, 404
            
            # No permitir actualizar ciertos campos
            protected_fields = ['uid', 'createdAt']
            for field in protected_fields:
                if field in data:
                    del data[field]
            
            # Actualizar lastLogin si se proporciona
            if 'lastLogin' in data and isinstance(data['lastLogin'], str):
                data['lastLogin'] = datetime.fromisoformat(data['lastLogin'].replace('Z', '+00:00'))
            
            # Actualizar fecha de aprobación si se proporciona
            if data.get('estado', {}).get('fechaAprobacion'):
                if isinstance(data['estado']['fechaAprobacion'], str):
                    data['estado']['fechaAprobacion'] = datetime.fromisoformat(
                        data['estado']['fechaAprobacion'].replace('Z', '+00:00')
                    )
            
            user_ref.update(data)
            return {'message': 'Usuario actualizado exitosamente'}
            
        except Exception as e:
            return {'error': str(e)}, 500