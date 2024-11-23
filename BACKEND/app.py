# app.py
from flask import Flask, jsonify
from flask_cors import CORS
from config.firebase_config import initialize_firebase
from app.routes import users, projects, notifications, tasks, phases, metrics
import schedule
import time
import threading
from app.services.project_service import ProjectService

def create_app():
    # Inicializar Firebase
    initialize_firebase()
    
    app = Flask(__name__)
    CORS(app)
    
    # Registrar blueprints
    app.register_blueprint(users.bp)
    app.register_blueprint(projects.bp)
    app.register_blueprint(notifications.bp)
    app.register_blueprint(tasks.bp)
    app.register_blueprint(phases.bp)
    app.register_blueprint(metrics.bp)
    
    # Manejador de errores global
    @app.errorhandler(Exception)
    def handle_error(error):
        response = {
            'error': str(error),
            'message': 'Ha ocurrido un error en el servidor'
        }
        return jsonify(response), 500
    
    # Ruta de estado de la API
    @app.route('/health')
    def health_check():
        return {
            'status': 'ok',
            'timestamp': time.time()
        }
    
    return app

def run_schedule():
    while True:
        schedule.run_pending()
        time.sleep(1)

def setup_scheduler():
    schedule.every().day.at("00:00").do(ProjectService.check_project_deadlines)
    scheduler_thread = threading.Thread(target=run_schedule)
    scheduler_thread.daemon = True
    scheduler_thread.start()

if __name__ == '__main__':
    app = create_app()
    setup_scheduler()
    app.run(debug=True)