# app/routes/users.py
from flask import Blueprint, request, jsonify
from app.controllers.user_controller import UserController
# Comentamos temporalmente los middlewares para pruebas
# from app.middlewares.auth_middleware import auth_required, admin_required

bp = Blueprint('users', __name__, url_prefix='/api/users')

@bp.route('/', methods=['POST'])
# @admin_required  # Comentado temporalmente para pruebas
def create_user():
    return UserController.create_user(request.json)

@bp.route('/<uid>', methods=['GET'])
# @auth_required  # Comentado temporalmente para pruebas
def get_user(uid):
    return UserController.get_user(uid)

@bp.route('/<uid>', methods=['PUT'])
# @auth_required  # Comentado temporalmente para pruebas
def update_user(uid):
    return UserController.update_user(uid, request.json)