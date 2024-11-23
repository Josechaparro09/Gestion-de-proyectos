# tests/test1.py
import os
import sys
import unittest
import json
from config_test import ROOT_DIR  # Importar configuración de pruebas
sys.path.append(ROOT_DIR)  # Añadir ruta al PYTHONPATH

from app import create_app
from firebase_admin import auth, firestore

class APITestCase(unittest.TestCase):
    def setUp(self):
        """Configuración inicial para cada prueba"""
        self.app = create_app()
        self.client = self.app.test_client()
        self.db = firestore.client()
        
        # Crear usuario de prueba
        self.test_user_data = {
            "email": "test@universidad.edu.co",
            "nombreCompleto": "Usuario Test",
            "rol": ["DOCENTE"],
            "facultad": "Ingeniería",
            "programa": "Ingeniería de Sistemas"
        }
        
        # Crear proyecto de prueba
        self.test_project_data = {
            "titulo": "Proyecto Test",
            "descripcion": "Proyecto para pruebas",
            "facultad": "Ingeniería",
            "programa": "Ingeniería de Sistemas",
            "estado": "PLANIFICACION"
        }

    def test_health_check(self):
        """Prueba el endpoint de estado de la API"""
        response = self.client.get('/health')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('status', data)
        print("✅ Test health check passed")

    def test_create_user(self):
        """Prueba la creación de usuario"""
        response = self.client.post(
            '/api/users',
            json=self.test_user_data,
            headers={'Content-Type': 'application/json'}
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('uid', data)
        print("✅ Test create user passed")

    def test_create_project(self):
        """Prueba la creación de proyecto"""
        response = self.client.post(
            '/api/projects',
            json=self.test_project_data,
            headers={'Content-Type': 'application/json'}
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('projectId', data)
        print("✅ Test create project passed")

    def tearDown(self):
        """Limpieza después de cada prueba"""
        pass

if __name__ == '__main__':
    # Configurar el entorno de prueba
    print("\n🚀 Starting API tests...\n")
    
    # Ejecutar pruebas
    unittest.main(verbosity=2)