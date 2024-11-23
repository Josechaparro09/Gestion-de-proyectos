# config/firebase_config.py

import os
import firebase_admin
from firebase_admin import credentials

def initialize_firebase():
    """
    Inicializa la conexión con Firebase usando el archivo de credenciales
    """
    try:
        # Obtener la ruta absoluta al archivo key.json
        current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        cred_path = os.path.join(current_dir, 'key.json')
        
        if not os.path.exists(cred_path):
            raise FileNotFoundError(f"No se encontró el archivo de credenciales en: {cred_path}")
        
        # Verificar si ya hay una app inicializada
        if not firebase_admin._apps:
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
            print("✅ Firebase inicializado correctamente")
        else:
            print("ℹ️ Firebase ya estaba inicializado")
            
    except Exception as e:
        print(f"❌ Error al inicializar Firebase: {str(e)}")
        raise e