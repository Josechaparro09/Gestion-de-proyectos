from app.controllers.project_controller import ProjectController
from flask import Blueprint, request, jsonify
from app.middlewares.auth_middleware import auth_required
bp = Blueprint('projects', __name__, url_prefix='/api/projects')

@bp.route('/', methods=['POST'])
# @auth_required
def create_project():
    return ProjectController.create_project(request.json)

@bp.route('/<project_id>', methods=['GET'])
# @auth_required
def get_project(project_id):
    return ProjectController.get_project(project_id)

@bp.route('/<project_id>/phases', methods=['POST'])
# @auth_required
def update_project_phase(project_id):
    return ProjectController.update_project_phase(project_id, request.json)

@bp.route('/faculty/<faculty>', methods=['GET'])
# @auth_required
def get_faculty_projects(faculty):
    return ProjectController.get_projects_by_faculty(faculty)