# generate_tokens.py
import firebase_admin
from firebase_admin import credentials, auth
import json
from datetime import datetime

class TokenGenerator:
    def __init__(self):
        try:
            # Intenta obtener la app existente
            self.app = firebase_admin.get_app()
        except ValueError:
            # Si no existe, inicializa Firebase
            cred = credentials.Certificate('C:/Users/josec/OneDrive/Documentos/Gestion de proyectos/BACKEND/key.json')
            self.app = firebase_admin.initialize_app(cred)
        
        self.tokens = {}

    def setup_test_user(self, email, role):
        """Configura un usuario de prueba con roles específicos"""
        try:
            # Intentar obtener el usuario existente
            try:
                user = auth.get_user_by_email(email)
                print(f"Usuario existente encontrado: {email}")
            except auth.UserNotFoundError:
                # Si no existe, crear nuevo usuario
                user = auth.create_user(
                    email=email,
                    password='Test123456!',
                    email_verified=True,
                    display_name=f"Test {role}"
                )
                print(f"Nuevo usuario creado: {email}")

            # Configurar claims con roles
            claims = {
                'role': [role],
                'permissions': self.get_role_permissions(role)
            }
            
            # Establecer custom claims
            auth.set_custom_user_claims(user.uid, claims)
            print(f"Claims actualizados para: {email}")

            return user

        except Exception as e:
            print(f"Error configurando usuario {email}: {str(e)}")
            raise e

    def get_role_permissions(self, role):
        """Define permisos por rol"""
        permissions = {
            'ADMIN': ['*'],
            'DIRECTOR': [
                'view_faculty_projects',
                'manage_faculty_projects',
                'view_metrics',
                'approve_phases'
            ],
            'LIDER': [
                'manage_project',
                'assign_tasks',
                'update_phases',
                'view_project_metrics'
            ],
            'COLABORADOR': [
                'view_assigned_tasks',
                'update_tasks',
                'view_project'
            ],
            'DOCENTE': [
                'view_projects',
                'comment_projects',
                'evaluate_phases'
            ]
        }
        return permissions.get(role, [])

    def create_custom_token(self, user, role):
        """Crea un token personalizado con claims adicionales"""
        try:
            additional_claims = {
                'role': [role],
                'permissions': self.get_role_permissions(role),
                'email': user.email
            }
            token = auth.create_custom_token(user.uid, additional_claims)
            return token.decode('utf-8')
        except Exception as e:
            print(f"Error creando token personalizado: {str(e)}")
            raise e

    def generate_all_tokens(self):
        """Genera tokens para todos los roles de prueba"""
        test_users = [
            {'email': 'admin@test.edu.co', 'role': 'ADMIN'},
            {'email': 'director@test.edu.co', 'role': 'DIRECTOR'},
            {'email': 'lider@test.edu.co', 'role': 'LIDER'},
            {'email': 'colaborador@test.edu.co', 'role': 'COLABORADOR'},
            {'email': 'docente@test.edu.co', 'role': 'DOCENTE'}
        ]

        for user_data in test_users:
            try:
                print(f"\nProcesando {user_data['role']}...")
                
                # Configurar usuario
                user = self.setup_test_user(user_data['email'], user_data['role'])
                
                # Generar token personalizado
                token = self.create_custom_token(user, user_data['role'])
                
                # Almacenar información
                self.tokens[user_data['role'].lower()] = {
                    'uid': user.uid,
                    'email': user_data['email'],
                    'token': token,
                    'role': user_data['role'],
                    'generated_at': datetime.now().isoformat()
                }
                
                print(f"✅ Token generado para {user_data['role']}")
                
            except Exception as e:
                print(f"❌ Error procesando {user_data['role']}: {str(e)}")

        # Guardar tokens en archivo
        with open('test_tokens.json', 'w') as f:
            json.dump(self.tokens, f, indent=2)
            print("\nTokens guardados en test_tokens.json")

        return self.tokens

    def verify_tokens(self):
        """Verifica que los tokens generados sean válidos"""
        print("\nVerificando tokens generados:")
        
        for role, data in self.tokens.items():
            try:
                decoded_token = auth.verify_id_token(data['token'])
                print(f"✅ Token válido para {role}")
                print(f"   UID: {decoded_token['uid']}")
                print(f"   Role: {decoded_token.get('role', [])}")
                print(f"   Email: {decoded_token.get('email')}")
            except Exception as e:
                print(f"❌ Token inválido para {role}: {str(e)}")

def main():
    print("🔐 Iniciando generación de tokens...")
    generator = TokenGenerator()
    
    print("\n📝 Generando tokens...")
    tokens = generator.generate_all_tokens()
    
    print("\n🔍 Verificando tokens...")
    generator.verify_tokens()
    
    print("\n✨ Proceso completado!")

if __name__ == "__main__":
    main()