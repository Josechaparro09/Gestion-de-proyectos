from flask import Blueprint, request
from app.middlewares.auth_middleware import auth_required
from app.middlewares.project_middleware import project_access_required
from app.controllers.phase_controller import PhaseController

bp = Blueprint('phases', __name__, url_prefix='/api/projects/<project_id>/phases')

@bp.route('/', methods=['POST'])
# @auth_required
# @project_access_required
def create_phase(project_id):
    return PhaseController.create_phase(project_id, request.json)

@bp.route('/<phase_id>', methods=['PUT'])
# @auth_required
# @project_access_required
def update_phase(project_id, phase_id):
    return PhaseController.update_phase_status(project_id, phase_id, request.json)

@bp.route('/<phase_id>/comments', methods=['POST'])
# @auth_required
# @project_access_required
def add_comment(project_id, phase_id):
    return PhaseController.add_phase_comment(project_id, phase_id, request.json)
