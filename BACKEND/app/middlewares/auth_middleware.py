# app/middlewares/auth_middleware.py

from functools import wraps
from flask import request, jsonify
from firebase_admin import auth, credentials, initialize_app
import firebase_admin
import json
import os
from config.firebase_config import initialize_firebase 


initialize_firebase()

def auth_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            # Verificar si hay token
            auth_header = request.headers.get('Authorization')
            if not auth_header:
                return {'error': 'No se proporcionó token de autorización'}, 401
            
            # Extraer el token
            token = auth_header.split('Bearer ')[1]
            
            try:
                # Verificar el token con Firebase
                decoded_token = auth.verify_id_token(token)
                # Añadir información del usuario a la request
                request.user = decoded_token
                return f(*args, **kwargs)
            except Exception as e:
                print(f"Error verificando token: {str(e)}")
                return {'error': 'Token inválido o expirado'}, 401
                
        except Exception as e:
            print(f"Error de autenticación: {str(e)}")
            return {'error': 'Error de autenticación'}, 401
            
    return decorated_function

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            # Verificar si hay token
            auth_header = request.headers.get('Authorization')
            if not auth_header:
                return {'error': 'No se proporcionó token de autorización'}, 401
            
            # Extraer el token
            token = auth_header.split('Bearer ')[1]
            
            try:
                # Verificar el token con Firebase
                decoded_token = auth.verify_id_token(token)
                
                # Verificar si es admin
                if 'role' not in decoded_token or 'ADMIN' not in decoded_token['role']:
                    return {'error': 'Se requieren privilegios de administrador'}, 403
                
                # Añadir información del usuario a la request
                request.user = decoded_token
                return f(*args, **kwargs)
            except Exception as e:
                print(f"Error verificando token: {str(e)}")
                return {'error': 'Token inválido o expirado'}, 401
                
        except Exception as e:
            print(f"Error de autenticación: {str(e)}")
            return {'error': 'Error de autenticación'}, 401
            
    return decorated_function

def role_required(allowed_roles):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                # Verificar si hay token
                auth_header = request.headers.get('Authorization')
                if not auth_header:
                    return {'error': 'No se proporcionó token de autorización'}, 401
                
                # Extraer el token
                token = auth_header.split('Bearer ')[1]
                
                try:
                    # Verificar el token con Firebase
                    decoded_token = auth.verify_id_token(token)
                    
                    # Verificar rol
                    user_roles = decoded_token.get('role', [])
                    if not any(role in allowed_roles for role in user_roles):
                        return {'error': 'No tiene los permisos necesarios'}, 403
                    
                    # Añadir información del usuario a la request
                    request.user = decoded_token
                    return f(*args, **kwargs)
                except Exception as e:
                    print(f"Error verificando token: {str(e)}")
                    return {'error': 'Token inválido o expirado'}, 401
                    
            except Exception as e:
                print(f"Error de autenticación: {str(e)}")
                return {'error': 'Error de autenticación'}, 401
                
        return decorated_function
    return decorator