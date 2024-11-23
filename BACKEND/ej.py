import os
import json
from pathlib import Path

class BackendGenerator:
    def __init__(self, base_path="backend"):
        self.base_path = Path(base_path)
        self.templates = {
            # Plantilla para app/__init__.py
            "app_init": '''from flask import Flask
from flask_cors import CORS
from .firebase_config import initialize_firebase

def create_app(config_name="development"):
    app = Flask(__name__)
    CORS(app)
    
    # Inicializa Firebase
    initialize_firebase()
    
    # Registra los blueprints
    from .routes import auth_bp, projects_bp, users_bp, notifications_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(projects_bp, url_prefix="/api/projects")
    app.register_blueprint(users_bp, url_prefix="/api/users")
    app.register_blueprint(notifications_bp, url_prefix="/api/notifications")
    
    return app''',

            # Plantilla para firebase_config.py
            "firebase_config": '''import firebase_admin
from firebase_admin import credentials, firestore
from pathlib import Path

def initialize_firebase():
    key_path = Path(__file__).parent.parent / "key.json"
    cred = credentials.Certificate(str(key_path))
    firebase_admin.initialize_app(cred)
    return firestore.client()

db = initialize_firebase()''',

            # Plantilla para routes/auth.py
            "auth_route": '''from flask import Blueprint, request, jsonify
from ..services.auth_service import AuthService
from ..utils.decorators import token_required

auth_bp = Blueprint("auth", __name__)
auth_service = AuthService()

@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        user = auth_service.register_user(data)
        return jsonify({"message": "Usuario registrado exitosamente", "user": user}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        token = auth_service.login_user(data)
        return jsonify({"token": token}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 401''',

            # Plantilla para services/auth_service.py
            "auth_service": '''from firebase_admin import auth
from ..models.user import User
from ..firebase_config import db

class AuthService:
    def register_user(self, data):
        try:
            # Crear usuario en Firebase Auth
            user = auth.create_user(
                email=data["email"],
                password=data["password"]
            )
            
            # Guardar datos adicionales en Firestore
            user_data = {
                "uid": user.uid,
                "email": data["email"],
                "nombre": data.get("nombre", ""),
                "rol": data.get("rol", "COLABORADOR"),
                "facultad": data.get("facultad", ""),
                "programa": data.get("programa", "")
            }
            
            db.collection("users").document(user.uid).set(user_data)
            return user_data
            
        except Exception as e:
            raise Exception(f"Error al registrar usuario: {str(e)}")

    def login_user(self, data):
        try:
            # Verificar credenciales (implementar lógica)
            # Retornar token JWT
            return "token_jwt"
        except Exception as e:
            raise Exception(f"Error al iniciar sesión: {str(e)}")''',

            # Plantilla para models/user.py
            "user_model": '''from dataclasses import dataclass
from typing import List, Optional
from datetime import datetime

@dataclass
class User:
    uid: str
    email: str
    nombre_completo: str
    rol: str
    facultad: str
    programa: str
    proyectos: Optional[List[str]] = None
    created_at: datetime = datetime.now()
    
    @staticmethod
    def from_dict(data: dict) -> 'User':
        return User(
            uid=data.get('uid'),
            email=data.get('email'),
            nombre_completo=data.get('nombre_completo'),
            rol=data.get('rol'),
            facultad=data.get('facultad'),
            programa=data.get('programa'),
            proyectos=data.get('proyectos', []),
            created_at=data.get('created_at', datetime.now())
        )
    
    def to_dict(self) -> dict:
        return {
            'uid': self.uid,
            'email': self.email,
            'nombre_completo': self.nombre_completo,
            'rol': self.rol,
            'facultad': self.facultad,
            'programa': self.programa,
            'proyectos': self.proyectos,
            'created_at': self.created_at
        }''',

            # Plantilla para utils/decorators.py
            "decorators": '''from functools import wraps
from flask import request, jsonify
from firebase_admin import auth

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(' ')[1]
        
        if not token:
            return jsonify({'message': 'Token no proporcionado'}), 401
            
        try:
            decoded_token = auth.verify_id_token(token)
            request.user = decoded_token
        except Exception as e:
            return jsonify({'message': f'Token inválido: {str(e)}'}), 401
            
        return f(*args, **kwargs)
    return decorated''',

            # Plantilla para requirements.txt
            "requirements": '''Flask==2.0.1
flask-cors==3.0.10
firebase-admin==5.0.0
python-dotenv==0.19.0
PyJWT==2.1.0
requests==2.26.0
gunicorn==20.1.0''',

            # Plantilla para app.py
            # Plantilla para .env
            "env_template": '''# Flask configuration
FLASK_ENV=development
FLASK_DEBUG=True
FLASK_HOST=0.0.0.0
FLASK_PORT=5000

# Firebase configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-bucket-name

# Security
JWT_SECRET_KEY=your-secret-key
JWT_ACCESS_TOKEN_EXPIRES=3600''',

            "app_main": '''from app import create_app
from dotenv import load_dotenv
import os

# Cargar variables de entorno
load_dotenv()

# Crear la aplicación Flask
app = create_app(os.getenv('FLASK_ENV', 'development'))

if __name__ == '__main__':
    app.run(
        host=os.getenv('FLASK_HOST', '0.0.0.0'),
        port=int(os.getenv('FLASK_PORT', 5000)),
        debug=os.getenv('FLASK_DEBUG', 'True') == 'True'
    )'''
        }

    def create_directory_structure(self):
        """Crea la estructura base de directorios"""
        directories = [
            "app",
            "app/models",
            "app/routes",
            "app/services",
            "app/utils",
            "tests"
        ]

        for directory in directories:
            dir_path = self.base_path / directory
            dir_path.mkdir(parents=True, exist_ok=True)
            # Crea __init__.py en cada directorio
            (dir_path / "__init__.py").write_text("")

    def create_files(self):
        """Crea todos los archivos necesarios"""
        # Archivos principales
        (self.base_path / "app.py").write_text(self.templates["app_main"])
        (self.base_path / ".env").write_text(self.templates["env_template"])
        (self.base_path / "app/__init__.py").write_text(self.templates["app_init"])
        (self.base_path / "app/firebase_config.py").write_text(self.templates["firebase_config"])
        (self.base_path / "requirements.txt").write_text(self.templates["requirements"])

        # Rutas
        (self.base_path / "app/routes/auth.py").write_text(self.templates["auth_route"])
        
        # Servicios
        (self.base_path / "app/services/auth_service.py").write_text(self.templates["auth_service"])
        
        # Modelos
        (self.base_path / "app/models/user.py").write_text(self.templates["user_model"])
        
        # Utilidades
        (self.base_path / "app/utils/decorators.py").write_text(self.templates["decorators"])

    def verify_firebase_key(self):
        """Verifica que el archivo key.json existe y es válido"""
        key_path = Path("key.json")
        if not key_path.exists():
            raise FileNotFoundError("No se encontró el archivo key.json en el directorio raíz")
        
        try:
            with open(key_path) as f:
                json.load(f)
            print(" Archivo key.json verificado correctamente")
        except json.JSONDecodeError:
            raise ValueError("El archivo key.json no es un JSON válido")

    def copy_firebase_key(self):
        """Copia el archivo key.json al directorio del backend"""
        source = Path("key.json")
        destination = self.base_path / "key.json"
        import shutil
        shutil.copy2(source, destination)
        print(" Archivo key.json copiado al backend")

    def generate(self):
        """Ejecuta todo el proceso de generación"""
        print(" Iniciando generación del backend...")
        
        try:
            # Verifica el archivo key.json
            self.verify_firebase_key()
            
            # Crea la estructura de directorios
            self.create_directory_structure()
            print(" Estructura de directorios creada")
            
            # Crea los archivos
            self.create_files()
            print(" Archivos base creados")
            
            # Copia el archivo key.json
            self.copy_firebase_key()
            
            print("\n Backend generado exitosamente!")
            print("\nPasos siguientes:")
            print("1. cd backend")
            print("2. python -m venv venv")
            print("3. source venv/bin/activate  # En Windows: .\\venv\\Scripts\\activate")
            print("4. pip install -r requirements.txt")
            print("5. Configura las variables de entorno necesarias")
            print("6. flask run  # Para iniciar el servidor de desarrollo")
            
        except Exception as e:
            print(f"\n Error durante la generación: {str(e)}")
            raise

if __name__ == "__main__":
    generator = BackendGenerator()
    generator.generate()