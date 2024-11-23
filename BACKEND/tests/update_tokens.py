# update_test_tokens.py
import json
def update_test_tokens():
    """Actualizar tokens en el tester de endpoints"""
    try:
        # Leer los tokens actuales
        with open('test_tokens.json', 'r') as f:
            tokens = json.load(f)

        # Actualizar el archivo de configuración del tester
        config = {
            'tokens': {role: data['token'] for role, data in tokens.items()},
            'base_url': 'http://localhost:5000'
        }

        with open('test_config.json', 'w') as f:
            json.dump(config, f, indent=2)

        print("✅ Test configuration updated successfully")
        
    except Exception as e:
        print(f"❌ Error updating test configuration: {str(e)}")

if __name__ == "__main__":
    update_test_tokens()