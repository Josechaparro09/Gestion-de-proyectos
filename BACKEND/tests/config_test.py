# tests/config_test.py
import os
import sys

# Obtener la ruta del directorio raíz del proyecto
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Añadir el directorio raíz al PYTHONPATH
sys.path.append(ROOT_DIR)