from flask import Blueprint, request
from app.controllers.task_controller import TaskController
from app.middlewares.auth_middleware import auth_required
from app.middlewares.project_middleware import project_access_required

bp = Blueprint('tasks', __name__, url_prefix='/api/projects/<project_id>/phases/<phase_id>/tasks')

@bp.route('/', methods=['POST'])
# @auth_required
# @project_access_required
def create_task(project_id, phase_id):
    return TaskController.create_task(project_id, phase_id, request.json)

@bp.route('/<task_id>', methods=['PUT'])
# @auth_required
# @project_access_required
def update_task(project_id, phase_id, task_id):
    return TaskController.update_task_status(project_id, phase_id, task_id, request.json)

@bp.route('/<task_id>/assign', methods=['POST'])
# @auth_required
# @project_access_required
def assign_task(project_id, phase_id, task_id):
    return TaskController.assign_task(project_id, phase_id, task_id, request.json.get('userIds', []))