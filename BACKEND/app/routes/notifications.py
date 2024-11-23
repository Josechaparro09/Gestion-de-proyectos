from flask import Blueprint, request, jsonify
from app.controllers.notification_controller import NotificationController
from app.middlewares.auth_middleware import auth_required

from app.controllers.notification_controller import NotificationController

bp = Blueprint('notifications', __name__, url_prefix='/api/notifications')

@bp.route('/', methods=['POST'])
# @auth_required
def create_notification():
    return NotificationController.create_notification(request.json)

@bp.route('/user/<user_id>', methods=['GET'])
# @auth_required
def get_user_notifications(user_id):
    return NotificationController.get_user_notifications(user_id)

@bp.route('/<notification_id>/read', methods=['POST'])
# @auth_required
def mark_notification_read(notification_id):
    user_id = request.json.get('userId')
    return NotificationController.mark_as_read(notification_id, user_id)