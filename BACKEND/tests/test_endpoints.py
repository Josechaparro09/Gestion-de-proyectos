# test_endpoints.py
import requests
import json
from datetime import datetime, timedelta
from colorama import init, Fore, Style
import time

init()  # Inicializar colorama

class EndpointTester:
    def __init__(self, base_url="http://localhost:5000"):
        self.base_url = base_url
        self.headers = {
            'Content-Type': 'application/json',
            # Aquí puedes añadir un token de autorización si es necesario
            # 'Authorization': 'Bearer your-token-here'
        }
        self.test_results = []

    def print_result(self, endpoint, method, status_code, response_data, time_taken):
        """Imprime el resultado de una prueba con formato"""
        status_color = Fore.GREEN if 200 <= status_code < 300 else Fore.RED
        print(f"\n{Fore.BLUE}Testing {method} {endpoint}{Style.RESET_ALL}")
        print(f"Status Code: {status_color}{status_code}{Style.RESET_ALL}")
        print(f"Time taken: {time_taken:.2f}s")
        print("Response:")
        print(json.dumps(response_data, indent=2))
        print("-" * 80)

    def test_endpoint(self, method, endpoint, data=None, params=None):
        """Realiza una prueba a un endpoint específico"""
        url = f"{self.base_url}{endpoint}"
        start_time = time.time()
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=self.headers, params=params)
            elif method == 'POST':
                response = requests.post(url, headers=self.headers, json=data)
            elif method == 'PUT':
                response = requests.put(url, headers=self.headers, json=data)
            else:
                raise ValueError(f"Método no soportado: {method}")

            time_taken = time.time() - start_time
            
            try:
                response_data = response.json()
            except:
                response_data = response.text

            self.print_result(endpoint, method, response.status_code, response_data, time_taken)
            
            result = {
                'endpoint': endpoint,
                'method': method,
                'status_code': response.status_code,
                'time_taken': time_taken,
                'success': 200 <= response.status_code < 300
            }
            self.test_results.append(result)
            
            return response_data

        except Exception as e:
            print(f"{Fore.RED}Error testing {method} {endpoint}: {str(e)}{Style.RESET_ALL}")
            self.test_results.append({
                'endpoint': endpoint,
                'method': method,
                'error': str(e),
                'success': False
            })
            return None

    def run_all_tests(self):
        """Ejecuta todas las pruebas de endpoints"""
        print(f"{Fore.CYAN}Starting endpoint tests...{Style.RESET_ALL}")
        
        # 1. Pruebas de Usuarios
        print(f"\n{Fore.YELLOW}Testing User Endpoints{Style.RESET_ALL}")
        self.test_endpoint('GET', '/api/users/user_0')  # Obtener usuario específico
        self.test_endpoint('POST', '/api/users', {
            'email': 'test@test.com',
            'nombreCompleto': 'Test User',
            'rol': ['COLABORADOR'],
            'facultad': 'Ingeniería',
            'programa': 'Sistemas'
        })

        # 2. Pruebas de Proyectos
        print(f"\n{Fore.YELLOW}Testing Project Endpoints{Style.RESET_ALL}")
        self.test_endpoint('GET', '/api/projects/project_0')  # Obtener proyecto específico
        self.test_endpoint('GET', '/api/projects/faculty/Ingeniería')  # Proyectos por facultad

        # 3. Pruebas de Fases
        print(f"\n{Fore.YELLOW}Testing Phase Endpoints{Style.RESET_ALL}")
        self.test_endpoint('POST', '/api/projects/project_0/phases', {
            'nombre': 'Nueva Fase',
            'fechaInicio': datetime.now().isoformat(),
            'fechaFin': (datetime.now() + timedelta(days=30)).isoformat()
        })

        # 4. Pruebas de Tareas
        print(f"\n{Fore.YELLOW}Testing Task Endpoints{Style.RESET_ALL}")
        self.test_endpoint('POST', '/api/projects/project_0/phases/1/tasks', {
            'descripcion': 'Nueva Tarea',
            'fechaLimite': (datetime.now() + timedelta(days=7)).isoformat(),
            'prioridad': 'ALTA'
        })

        # 5. Pruebas de Métricas
        print(f"\n{Fore.YELLOW}Testing Metrics Endpoints{Style.RESET_ALL}")
        self.test_endpoint('GET', '/api/metrics/project/project_0')  # Métricas de proyecto
        self.test_endpoint('GET', '/api/metrics/user/user_0')  # Métricas de usuario
        self.test_endpoint('GET', '/api/metrics/faculty/Ingeniería')  # Métricas de facultad
        self.test_endpoint('GET', '/api/metrics/dashboard')  # Dashboard general
        self.test_endpoint('GET', '/api/metrics/comparative', params={
            'start_date': (datetime.now() - timedelta(days=30)).isoformat(),
            'end_date': datetime.now().isoformat(),
            'faculty': 'Ingeniería'
        })
        self.test_endpoint('GET', '/api/metrics/team-efficiency/project_0')  # Eficiencia del equipo
        self.test_endpoint('GET', '/api/metrics/time-analysis/project_0')  # Análisis de tiempo
        self.test_endpoint('GET', '/api/metrics/export', params={
            'type': 'comparative',
            'format': 'json',
            'faculty': 'Ingeniería'
        })

        # 6. Pruebas de Notificaciones
        print(f"\n{Fore.YELLOW}Testing Notification Endpoints{Style.RESET_ALL}")
        self.test_endpoint('GET', '/api/notifications/user/user_0')  # Notificaciones de usuario
        self.test_endpoint('POST', '/api/notifications', {
            'tipo': 'DEADLINE',
            'mensaje': 'Test notification',
            'projectId': 'project_0',
            'destinatarios': ['user_0']
        })

        self.print_summary()

    def print_summary(self):
        """Imprime un resumen de todas las pruebas realizadas"""
        total_tests = len(self.test_results)
        successful_tests = len([r for r in self.test_results if r.get('success')])
        failed_tests = total_tests - successful_tests
        avg_time = sum(r.get('time_taken', 0) for r in self.test_results if 'time_taken' in r) / total_tests

        print(f"\n{Fore.CYAN}Test Summary:{Style.RESET_ALL}")
        print(f"Total tests: {total_tests}")
        print(f"Successful: {Fore.GREEN}{successful_tests}{Style.RESET_ALL}")
        print(f"Failed: {Fore.RED}{failed_tests}{Style.RESET_ALL}")
        print(f"Average response time: {avg_time:.2f}s")

        if failed_tests > 0:
            print(f"\n{Fore.RED}Failed endpoints:{Style.RESET_ALL}")
            for result in self.test_results:
                if not result.get('success'):
                    print(f"- {result['method']} {result['endpoint']}")
                    if 'error' in result:
                        print(f"  Error: {result['error']}")

def main():
    tester = EndpointTester()
    tester.run_all_tests()

if __name__ == "__main__":
    main()