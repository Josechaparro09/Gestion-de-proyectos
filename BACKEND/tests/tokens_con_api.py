# exchange_token.py
import requests
import json
from datetime import datetime
import os

class FirebaseTokenExchanger:
    def __init__(self):
        with open('C:/Users/josec/OneDrive/Documentos/Gestion de proyectos/BACKEND/config/firebase_config.py', 'r') as f:
            self.config = json.load(f)
        self.api_key = self.config['apiKey']
        self.tokens = {}

    def sign_in_with_email(self, email, password):
        """Iniciar sesión con email y contraseña"""
        url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={self.api_key}"
        
        data = {
            "email": email,
            "password": password,
            "returnSecureToken": True
        }
        
        try:
            response = requests.post(url, json=data)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Error signing in: {str(e)}")
            return None

    def refresh_token(self, refresh_token):
        """Refrescar un token existente"""
        url = f"https://securetoken.googleapis.com/v1/token?key={self.api_key}"
        
        data = {
            "grant_type": "refresh_token",
            "refresh_token": refresh_token
        }
        
        try:
            response = requests.post(url, json=data)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Error refreshing token: {str(e)}")
            return None

    def get_user_tokens(self, email, password):
        """Obtener tokens para un usuario"""
        result = self.sign_in_with_email(email, password)
        if result:
            return {
                'id_token': result['idToken'],
                'refresh_token': result['refreshToken'],
                'expires_in': result['expiresIn']
            }
        return None

    def get_all_test_tokens(self):
        """Obtener tokens para todos los usuarios de prueba"""
        test_users = [
            {'email': 'test_admin@test.com', 'password': 'test123456', 'role': 'ADMIN'},
            {'email': 'test_director@test.com', 'password': 'test123456', 'role': 'DIRECTOR'},
            {'email': 'test_lider@test.com', 'password': 'test123456', 'role': 'LIDER'},
            {'email': 'test_colaborador@test.com', 'password': 'test123456', 'role': 'COLABORADOR'},
            {'email': 'test_docente@test.com', 'password': 'test123456', 'role': 'DOCENTE'}
        ]

        tokens = {}
        for user in test_users:
            print(f"Getting tokens for {user['role']}...")
            result = self.get_user_tokens(user['email'], user['password'])
            if result:
                tokens[user['role'].lower()] = {
                    'email': user['email'],
                    'tokens': result,
                    'timestamp': datetime.now().isoformat()
                }
                print(f"✅ Success: {user['role']}")
            else:
                print(f"❌ Failed: {user['role']}")

        # Guardar tokens
        with open('test_tokens.json', 'w') as f:
            json.dump(tokens, f, indent=2)

        return tokens

def main():
    exchanger = FirebaseTokenExchanger()
    print("🔄 Getting tokens for all test users...")
    tokens = exchanger.get_all_test_tokens()
    
    print("\n📝 Token Summary:")
    for role, data in tokens.items():
        print(f"\n{role.upper()}:")
        print(f"Email: {data['email']}")
        print(f"ID Token: {data['tokens']['id_token'][:30]}...")
        print(f"Refresh Token: {data['tokens']['refresh_token'][:30]}...")
        print(f"Expires In: {data['tokens']['expires_in']} seconds")

if __name__ == "__main__":
    main()