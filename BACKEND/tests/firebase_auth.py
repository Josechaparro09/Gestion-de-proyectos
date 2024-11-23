# generate_test_tokens.py

import firebase_admin
from firebase_admin import credentials, auth
import json
from datetime import datetime

class TestTokenGenerator:
    def __init__(self):
        try:
            firebase_admin.get_app()
        except ValueError:
            cred = credentials.Certificate('BACKEND\key.json')
            firebase_admin.initialize_app(cred)

    def create_test_user(self, email, role):
        """Crear o actualizar usuario de prueba"""
        try:
            # Intentar crear nuevo usuario
            try:
                user = auth.create_user(
                    email=email,
                    password='Test123456',
                    email_verified=True
                )
                print(f"Created new user: {email}")
            except auth.EmailAlreadyExistsError:
                # Si el usuario existe, obtenerlo
                users = auth.get_users_by_email(email)
                user = users[0]
                print(f"User already exists: {email}")

            # Establecer claims personalizados
            auth.set_custom_user_claims(user.uid, {
                'role': [role],
                'email': email
            })

            return user
        except Exception as e:
            print(f"Error creating/updating user {email}: {str(e)}")
            raise e

    def generate_custom_token(self, uid):
        """Generar token personalizado"""
        try:
            token = auth.create_custom_token(uid)
            return token.decode('utf-8')
        except Exception as e:
            print(f"Error generating token: {str(e)}")
            raise e

    def generate_all_test_tokens(self):
        """Generar tokens para todos los roles de prueba"""
        test_users = [
            {'email': 'admin@test.com', 'role': 'ADMIN'},
            {'email': 'director@test.com', 'role': 'DIRECTOR'},
            {'email': 'lider@test.com', 'role': 'LIDER'},
            {'email': 'colaborador@test.com', 'role': 'COLABORADOR'},
            {'email': 'docente@test.com', 'role': 'DOCENTE'}
        ]

        tokens = {}
        for user_data in test_users:
            try:
                print(f"\nProcessing {user_data['role']}...")
                # Crear o actualizar usuario
                user = self.create_test_user(user_data['email'], user_data['role'])
                
                # Generar token
                token = self.generate_custom_token(user.uid)
                
                tokens[user_data['role'].lower()] = {
                    'uid': user.uid,
                    'email': user_data['email'],
                    'token': token,
                    'role': user_data['role'],
                    'generated_at': datetime.now().isoformat()
                }
                
                print(f"✅ Success: Generated token for {user_data['role']}")
                
            except Exception as e:
                print(f"❌ Error processing {user_data['role']}: {str(e)}")

        # Guardar tokens
        with open('test_tokens.json', 'w') as f:
            json.dump(tokens, f, indent=2)

        return tokens

def main():
    print("🔐 Initializing token generation...")
    generator = TestTokenGenerator()
    
    print("\n🔄 Generating test tokens...")
    tokens = generator.generate_all_test_tokens()
    
    print("\n📝 Generated Tokens:")
    for role, data in tokens.items():
        print(f"\n{role.upper()}:")
        print(f"UID: {data['uid']}")
        print(f"Email: {data['email']}")
        print(f"Token: {data['token'][:30]}...")
        print(f"Generated: {data['generated_at']}")
    
    print("\n✨ Tokens have been saved to test_tokens.json")

if __name__ == "__main__":
    main()