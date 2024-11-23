from functools import wraps
from flask import request
from firebase_admin import firestore

def project_access_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            project_id = kwargs.get('project_id')
            user = request.user
            
            if not project_id or not user:
                return {'error': 'Datos inválidos'}, 400
                
            db = firestore.client()
            project_doc = db.collection('projects').document(project_id).get()
            
            if not project_doc.exists:
                return {'error': 'Proyecto no encontrado'}, 404
                
            project_data = project_doc.to_dict()
            equipo = project_data.get('equipo', {})
            
            # Verificar si el usuario es parte del equipo o tiene rol administrativo
            is_team_member = (
                user['uid'] == equipo.get('director') or
                user['uid'] == equipo.get('lider') or
                user['uid'] == equipo.get('docente') or
                user['uid'] in equipo.get('colaboradores', []) or
                'ADMIN' in user.get('rol', [])
            )
            
            if not is_team_member:
                return {'error': 'No tiene acceso a este proyecto'}, 403
            
            request.project = project_data
            return f(*args, **kwargs)
            
        except Exception as e:
            return {'error': 'Error al verificar acceso al proyecto'}, 500
            
    return decorated_function