# app/routes/metrics.py
from flask import Blueprint, request, jsonify
from app.services.metrics_service import MetricsService
from app.middlewares.auth_middleware import auth_required, role_required
from datetime import datetime

bp = Blueprint('metrics', __name__, url_prefix='/api/metrics')

# Métricas de Proyecto Individual
@bp.route('/project/<project_id>', methods=['GET'])
# @auth_required
def get_project_metrics(project_id):
    """Obtener métricas detalladas de un proyecto específico"""
    try:
        metrics = MetricsService.generate_project_metrics(project_id)
        return jsonify(metrics)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Métricas por Facultad
@bp.route('/faculty/<faculty>', methods=['GET'])
# @auth_required
# @role_required(['ADMIN', 'DIRECTOR'])
def get_faculty_report(faculty):
    """Obtener reporte completo de una facultad"""
    try:
        report = MetricsService.generate_faculty_report(faculty)
        return jsonify(report)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Datos del Dashboard
@bp.route('/dashboard', methods=['GET'])
# @auth_required
def get_dashboard_data():
    """Obtener datos para el dashboard principal"""
    try:
        faculty = request.args.get('faculty')
        program = request.args.get('program')
        data = MetricsService.generate_dashboard_data(faculty, program)
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Métricas de Usuario
@bp.route('/user/<user_id>', methods=['GET'])
# @auth_required
def get_user_metrics(user_id):
    """Obtener métricas detalladas de un usuario"""
    try:
        metrics = MetricsService.generate_user_metrics(user_id)
        return jsonify(metrics)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Reporte Comparativo
@bp.route('/comparative', methods=['GET'])
# @auth_required
# @role_required(['ADMIN', 'DIRECTOR'])
def get_comparative_report():
    """Obtener reporte comparativo entre períodos"""
    try:
        # Parsear fechas del query string
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        faculty = request.args.get('faculty')

        if start_date:
            start_date = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
        if end_date:
            end_date = datetime.fromisoformat(end_date.replace('Z', '+00:00'))

        report = MetricsService.generate_comparative_report(start_date, end_date, faculty)
        return jsonify(report)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Métricas de Rendimiento por Programa
@bp.route('/program/<program>/performance', methods=['GET'])
# @auth_required
# @role_required(['ADMIN', 'DIRECTOR'])
def get_program_performance(program):
    """Obtener métricas de rendimiento específicas de un programa"""
    try:
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')

        if start_date:
            start_date = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
        if end_date:
            end_date = datetime.fromisoformat(end_date.replace('Z', '+00:00'))

        data = MetricsService.generate_dashboard_data(program=program)
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Métricas de Eficiencia del Equipo
@bp.route('/team-efficiency/<project_id>', methods=['GET'])
# @auth_required
def get_team_efficiency(project_id):
    """Obtener métricas de eficiencia del equipo para un proyecto"""
    try:
        metrics = MetricsService.generate_project_metrics(project_id)
        team_metrics = {
            'project_id': project_id,
            'team_efficiency': metrics.get('performance_metrics', {}),
            'task_distribution': metrics.get('tasks_summary', {}),
            'collaboration_metrics': metrics.get('team_overview', {})
        }
        return jsonify(team_metrics)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Métricas de Tiempo y Retrasos
@bp.route('/time-analysis/<project_id>', methods=['GET'])
# @auth_required
def get_time_analysis(project_id):
    """Obtener análisis detallado de tiempos y retrasos"""
    try:
        metrics = MetricsService.generate_project_metrics(project_id)
        time_metrics = {
            'project_id': project_id,
            'phase_durations': metrics.get('phase_durations', []),
            'delay_analysis': metrics.get('delay_analysis', {}),
            'completion_trends': metrics.get('completion_trends', [])
        }
        return jsonify(time_metrics)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Exportar Reportes
@bp.route('/export', methods=['GET'])
# @auth_required
# @role_required(['ADMIN', 'DIRECTOR'])
def export_metrics():
    """Exportar métricas en formato específico"""
    try:
        report_type = request.args.get('type', 'general')
        format_type = request.args.get('format', 'json')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        faculty = request.args.get('faculty')

        if start_date:
            start_date = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
        if end_date:
            end_date = datetime.fromisoformat(end_date.replace('Z', '+00:00'))

        if report_type == 'comparative':
            data = MetricsService.generate_comparative_report(start_date, end_date, faculty)
        elif report_type == 'faculty':
            data = MetricsService.generate_faculty_report(faculty)
        else:
            data = MetricsService.generate_dashboard_data(faculty=faculty)

        if format_type == 'json':
            return jsonify(data)
        # Aquí podrías añadir más formatos de exportación (CSV, PDF, etc.)
        
        return jsonify({'error': 'Formato no soportado'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500