# test_data_generator.py
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime, timedelta
import random
import string
from typing import List, Dict
import json
import os

# Inicializar Firebase

class TestDataGenerator:
    def __init__(self):
        # Obtener la ruta absoluta al directorio del proyecto
        self.base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        
        # Construir la ruta al archivo key.json
        self.key_path = os.path.join(self.base_path, 'key.json')
        
        # Verificar que el archivo existe
        if not os.path.exists(self.key_path):
            raise FileNotFoundError(f"No se encontró el archivo key.json en: {self.key_path}")
        
        # Inicializar Firebase
        cred = credentials.Certificate(self.key_path)
        if not firebase_admin._apps:
            firebase_admin.initialize_app(cred)
        self.db = firestore.client()
        
        # Datos para generación
        self.facultades = ['Ingeniería', 'Ciencias', 'Artes', 'Medicina', 'Economía']
        self.programas = {
            'Ingeniería': ['Sistemas', 'Civil', 'Industrial', 'Electrónica'],
            'Ciencias': ['Física', 'Matemáticas', 'Química', 'Biología'],
            'Artes': ['Música', 'Diseño', 'Teatro', 'Artes Visuales'],
            'Medicina': ['Medicina General', 'Enfermería', 'Fisioterapia'],
            'Economía': ['Administración', 'Contaduría', 'Economía', 'Finanzas']
        }
        self.roles = ['ADMIN', 'DIRECTOR', 'LIDER', 'COLABORADOR', 'DOCENTE']
        self.estados_proyecto = ['PLANIFICACION', 'EN_PROGRESO', 'EVALUACION', 'COMPLETADO', 'CANCELADO']
        self.prioridades = ['ALTA', 'MEDIA', 'BAJA']
        
        print(f" Firebase inicializado correctamente")
        print(f" Usando archivo de credenciales: {self.key_path}")

    def generate_random_date(self, start_date: datetime, end_date: datetime) -> datetime:
        """Genera una fecha aleatoria entre dos fechas"""
        time_between = end_date - start_date
        days_between = time_between.days
        random_days = random.randrange(days_between)
        return start_date + timedelta(days=random_days)

    def generate_users(self, num_users: int) -> List[Dict]:
        """Genera usuarios de prueba"""
        users = []
        for i in range(num_users):
            facultad = random.choice(self.facultades)
            user = {
                'uid': f'user_{i}',
                'email': f'user{i}@universidad.edu.co',
                'nombreCompleto': f'Usuario Prueba {i}',
                'rol': [random.choice(self.roles)],
                'facultad': facultad,
                'programa': random.choice(self.programas[facultad]),
                'proyectos': [],
                'createdAt': self.generate_random_date(
                    datetime.now() - timedelta(days=365),
                    datetime.now()
                ),
                'lastLogin': datetime.now(),
                'estado': {
                    'aprobado': True,
                    'activo': True,
                    'fechaAprobacion': datetime.now() - timedelta(days=random.randint(1, 30))
                },
                'datosPersonales': {
                    'documento': f'DOC{i}',
                    'tipoDocumento': 'CC',
                    'telefono': f'300{i:07d}',
                    'cargo': 'Cargo Prueba'
                },
                'configuraciones': {
                    'notificacionesEmail': True,
                    'temaOscuro': random.choice([True, False]),
                    'idiomaPreferido': 'es'
                }
            }
            users.append(user)
        return users

    def generate_phases(self, start_date: datetime, num_phases: int = 3) -> List[Dict]:
        """Genera fases de proyecto"""
        phases = []
        current_date = start_date

        for i in range(num_phases):
            phase_duration = timedelta(days=random.randint(15, 45))
            tasks = []
            
            # Generar tareas para la fase
            for j in range(random.randint(3, 7)):
                task_deadline = current_date + timedelta(days=random.randint(5, 15))
                task = {
                    'tareaId': f'task_{i}_{j}',
                    'descripcion': f'Tarea {j} de la Fase {i}',
                    'completada': random.choice([True, False]),
                    'asignadoA': [f'user_{random.randint(0, 9)}' for _ in range(random.randint(1, 3))],
                    'fechaLimite': task_deadline,
                    'prioridad': random.choice(self.prioridades),
                    'archivosAdjuntos': [],
                    'fechaCreacion': current_date,
                    'fechaActualizacion': current_date + timedelta(days=random.randint(1, 10))
                }
                tasks.append(task)

            phase = {
                'faseId': i + 1,
                'nombre': f'Fase {i + 1}',
                'tareas': tasks,
                'progreso': random.randint(0, 100),
                'fechaInicio': current_date,
                'fechaFin': current_date + phase_duration,
                'comentarios': []
            }
            phases.append(phase)
            current_date += phase_duration

        return phases

    def generate_projects(self, num_projects: int, users: List[Dict]) -> List[Dict]:
        """Genera proyectos de prueba"""
        projects = []
        for i in range(num_projects):
            facultad = random.choice(self.facultades)
            start_date = self.generate_random_date(
                datetime.now() - timedelta(days=180),
                datetime.now() - timedelta(days=30)
            )

            # Seleccionar usuarios aleatorios para el equipo
            available_users = users.copy()
            random.shuffle(available_users)
            
            project = {
                'projectId': f'project_{i}',
                'titulo': f'Proyecto de Prueba {i}',
                'descripcion': f'Descripción detallada del proyecto {i}',
                'objetivos': [
                    {
                        'id': f'obj_{j}',
                        'descripcion': f'Objetivo {j} del proyecto {i}',
                        'cumplido': random.choice([True, False])
                    } for j in range(3)
                ],
                'facultad': facultad,
                'programa': random.choice(self.programas[facultad]),
                'estado': random.choice(self.estados_proyecto),
                'faseActual': random.randint(0, 2),
                'fases': self.generate_phases(start_date),
                'equipo': {
                    'director': available_users[0]['uid'],
                    'lider': available_users[1]['uid'],
                    'colaboradores': [user['uid'] for user in available_users[2:5]],
                    'docente': available_users[5]['uid']
                },
                'createdAt': start_date,
                'updatedAt': datetime.now(),
                'metricas': {
                    'tiempoPromedioPorFase': random.randint(15, 45),
                    'tasasCompletitud': random.randint(0, 100),
                    'retrasosAcumulados': random.randint(0, 10),
                    'horasRegistradas': random.randint(100, 1000)
                }
            }
            projects.append(project)
        return projects

    def generate_notifications(self, projects: List[Dict]) -> List[Dict]:
        """Genera notificaciones de prueba"""
        notifications = []
        notification_types = ['DEADLINE', 'CAMBIO_ESTADO', 'ASIGNACION', 'COMENTARIO', 'APROBACION']
        
        for i, project in enumerate(projects):
            for _ in range(random.randint(3, 7)):
                notification = {
                    'notificationId': f'notif_{i}_{_}',
                    'tipo': random.choice(notification_types),
                    'mensaje': f'Notificación de prueba {_} para proyecto {project["projectId"]}',
                    'projectId': project['projectId'],
                    'destinatarios': [user_id for user_id in project['equipo'].values() if isinstance(user_id, str)],
                    'leido': [],
                    'createdAt': self.generate_random_date(project['createdAt'], datetime.now()),
                    'prioridad': random.choice(self.prioridades),
                    'accion': {
                        'tipo': 'VER_PROYECTO',
                        'url': f'/projects/{project["projectId"]}'
                    },
                    'metadata': {
                        'origen': 'SISTEMA',
                        'contexto': {}
                    }
                }
                notifications.append(notification)
        return notifications

    def insert_test_data(self):
        """Inserta todos los datos de prueba en Firebase"""
        try:
            # Generar datos
            print("\n Generando datos de prueba...")
            
            print(" Generando usuarios...")
            users = self.generate_users(50)
            
            print(" Generando proyectos...")
            projects = self.generate_projects(30, users)
            
            print(" Generando notificaciones...")
            notifications = self.generate_notifications(projects)

            # Insertar datos en Firebase
            print("\n Insertando datos en Firebase...")
            
            # Usuarios
            print(" Insertando usuarios...")
            for user in users:
                self.db.collection('users').document(user['uid']).set(user)
            print(f" {len(users)} usuarios insertados")

            # Proyectos
            print(" Insertando proyectos...")
            for project in projects:
                self.db.collection('projects').document(project['projectId']).set(project)
            print(f" {len(projects)} proyectos insertados")

            # Notificaciones
            print(" Insertando notificaciones...")
            for notification in notifications:
                self.db.collection('notifications').document(notification['notificationId']).set(notification)
            print(f" {len(notifications)} notificaciones insertadas")

            summary = {
                'users_created': len(users),
                'projects_created': len(projects),
                'notifications_created': len(notifications),
                'timestamp': datetime.now().isoformat()
            }

            print("\n Todos los datos fueron insertados exitosamente")
            return summary

        except Exception as e:
            print(f"\n Error insertando datos de prueba: {str(e)}")
            raise e

def main():
    try:
        print("\n Iniciando generador de datos de prueba...")
        generator = TestDataGenerator()
        summary = generator.insert_test_data()
        
        print("\n Resumen de datos insertados:")
        print(json.dumps(summary, indent=2))
        
    except Exception as e:
        print(f"\n Error en la ejecución: {str(e)}")
        import traceback
        print("\nDetalles del error:")
        print(traceback.format_exc())

if __name__ == "__main__":
    main()