from flask import Flask
from flask_cors import CORS
from config.firebase_config import initialize_firebase

def create_app():
    # Inicializar Firebase antes de crear la aplicación
    initialize_firebase()
    
    app = Flask(__name__)
    CORS(app)
    
    # Registrar blueprints después de inicializar Firebase
    from app.routes import projects, users, notifications
    app.register_blueprint(projects.bp)
    app.register_blueprint(users.bp)
    app.register_blueprint(notifications.bp)
    
    # Ruta de prueba para verificar que la app está funcionando
    @app.route('/health')
    def health_check():
        return {'status': 'ok', 'message': 'Server is running'}
    
    return app