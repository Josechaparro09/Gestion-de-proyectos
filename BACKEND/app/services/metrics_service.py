# app/services/metrics_service.py
from firebase_admin import firestore
from datetime import datetime, timedelta
import json

class MetricsService:
    @staticmethod
    def generate_project_metrics(project_id):
        """Genera métricas detalladas para un proyecto específico"""
        try:
            db = firestore.client()
            project_ref = db.collection('projects').document(project_id)
            project = project_ref.get()

            if not project.exists:
                return {'error': 'Proyecto no encontrado'}, 404

            project_data = project.to_dict()
            phases = project_data.get('fases', [])

            # Métricas generales
            total_tasks = 0
            completed_tasks = 0
            delayed_tasks = 0
            total_time = timedelta()

            for phase in phases:
                # Tiempo de fase
                if phase.get('fechaFin') and phase.get('fechaInicio'):
                    phase_time = phase['fechaFin'] - phase['fechaInicio']
                    total_time += phase_time

                # Métricas de tareas
                for task in phase.get('tareas', []):
                    total_tasks += 1
                    if task.get('completada'):
                        completed_tasks += 1
                    if task.get('fechaLimite') and task.get('fechaLimite') < datetime.now():
                        delayed_tasks += 1

            # Calcular métricas
            metrics = {
                'total_tasks': total_tasks,
                'completed_tasks': completed_tasks,
                'completion_rate': (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0,
                'delayed_tasks': delayed_tasks,
                'delay_rate': (delayed_tasks / total_tasks * 100) if total_tasks > 0 else 0,
                'average_phase_duration': total_time.days / len(phases) if phases else 0,
                'total_duration': total_time.days
            }

            return metrics

        except Exception as e:
            print(f"Error generando métricas del proyecto: {str(e)}")
            return {'error': str(e)}, 500

    @staticmethod
    def generate_faculty_report(faculty):
        """Genera un reporte completo de proyectos por facultad"""
        try:
            db = firestore.client()
            projects = db.collection('projects').where('facultad', '==', faculty).stream()

            faculty_metrics = {
                'total_projects': 0,
                'active_projects': 0,
                'completed_projects': 0,
                'average_completion_rate': 0,
                'projects_by_program': {},
                'delayed_projects': 0,
                'phases_summary': {
                    'planning': 0,
                    'execution': 0,
                    'evaluation': 0
                },
                'resource_utilization': {
                    'total_hours': 0,
                    'hours_by_phase': {}
                }
            }

            completion_rates = []
            total_hours = 0

            for project in projects:
                project_data = project.to_dict()
                faculty_metrics['total_projects'] += 1

                # Contar proyectos por estado
                if project_data['estado'] == 'COMPLETADO':
                    faculty_metrics['completed_projects'] += 1
                elif project_data['estado'] in ['PLANIFICACION', 'EN_PROGRESO', 'EVALUACION']:
                    faculty_metrics['active_projects'] += 1

                # Agrupar por programa
                program = project_data['programa']
                if program not in faculty_metrics['projects_by_program']:
                    faculty_metrics['projects_by_program'][program] = 0
                faculty_metrics['projects_by_program'][program] += 1

                # Calcular tasa de completitud
                phases = project_data.get('fases', [])
                total_tasks = 0
                completed_tasks = 0

                for phase in phases:
                    phase_name = phase.get('nombre', 'unknown')
                    if phase_name not in faculty_metrics['resource_utilization']['hours_by_phase']:
                        faculty_metrics['resource_utilization']['hours_by_phase'][phase_name] = 0
                    
                    # Calcular horas por fase
                    if phase.get('fechaInicio') and phase.get('fechaFin'):
                        duration = (phase['fechaFin'] - phase['fechaInicio']).total_seconds() / 3600  # convertir a horas
                        faculty_metrics['resource_utilization']['hours_by_phase'][phase_name] += duration
                        total_hours += duration
                    
                    # Contar tareas
                    for task in phase.get('tareas', []):
                        total_tasks += 1
                        if task.get('completada'):
                            completed_tasks += 1

                if total_tasks > 0:
                    completion_rate = (completed_tasks / total_tasks) * 100
                    completion_rates.append(completion_rate)

                # Verificar retrasos
                if project_data.get('metricas', {}).get('retrasosAcumulados', 0) > 0:
                    faculty_metrics['delayed_projects'] += 1
                
                # Actualizar conteo de fases
                current_phase = project_data.get('faseActual', 0)
                if current_phase == 0:
                    faculty_metrics['phases_summary']['planning'] += 1
                elif current_phase < len(phases) - 1:
                    faculty_metrics['phases_summary']['execution'] += 1
                else:
                    faculty_metrics['phases_summary']['evaluation'] += 1

            # Actualizar métricas finales
            faculty_metrics['resource_utilization']['total_hours'] = total_hours
            if completion_rates:
                faculty_metrics['average_completion_rate'] = sum(completion_rates) / len(completion_rates)
            
            # Añadir métricas de rendimiento
            faculty_metrics['performance_indicators'] = {
                'completion_efficiency': (faculty_metrics['completed_projects'] / faculty_metrics['total_projects'] * 100) if faculty_metrics['total_projects'] > 0 else 0,
                'delay_ratio': (faculty_metrics['delayed_projects'] / faculty_metrics['total_projects'] * 100) if faculty_metrics['total_projects'] > 0 else 0,
                'average_hours_per_project': total_hours / faculty_metrics['total_projects'] if faculty_metrics['total_projects'] > 0 else 0
            }

            return faculty_metrics

        except Exception as e:
            print(f"Error generando reporte de facultad: {str(e)}")
            return {'error': str(e)}, 500

    @staticmethod
    def generate_dashboard_data(faculty=None, program=None):
        """Genera datos para el dashboard principal"""
        try:
            db = firestore.client()
            query = db.collection('projects')
            
            if faculty:
                query = query.where('facultad', '==', faculty)
            if program:
                query = query.where('programa', '==', program)
                
            projects = query.stream()
            
            dashboard_data = {
                'projects_summary': {
                    'total': 0,
                    'by_status': {
                        'PLANIFICACION': 0,
                        'EN_PROGRESO': 0,
                        'EVALUACION': 0,
                        'COMPLETADO': 0,
                        'CANCELADO': 0
                    },
                    'by_faculty': {},
                    'by_program': {}
                },
                'tasks_summary': {
                    'total': 0,
                    'completed': 0,
                    'pending': 0,
                    'delayed': 0
                },
                'team_overview': {
                    'total_members': 0,
                    'by_role': {
                        'DIRECTOR': 0,
                        'LIDER': 0,
                        'COLABORADOR': 0,
                        'DOCENTE': 0
                    }
                },
                'performance_metrics': {
                    'average_completion_time': 0,
                    'on_time_completion_rate': 0,
                    'delayed_projects_rate': 0
                },
                'timeline_data': {
                    'upcoming_deadlines': [],
                    'recent_completions': [],
                    'active_phases': []
                },
                'resource_allocation': {
                    'by_faculty': {},
                    'by_program': {},
                    'by_role': {}
                }
            }
            
            completion_times = []
            team_members = set()
            
            for project in projects:
                data = project.to_dict()
                dashboard_data['projects_summary']['total'] += 1
                
                # Conteo por estado
                status = data.get('estado', 'EN_PROGRESO')
                dashboard_data['projects_summary']['by_status'][status] += 1
                
                # Conteo por facultad y programa
                faculty = data.get('facultad')
                program = data.get('programa')
                
                if faculty not in dashboard_data['projects_summary']['by_faculty']:
                    dashboard_data['projects_summary']['by_faculty'][faculty] = 0
                    dashboard_data['resource_allocation']['by_faculty'][faculty] = 0
                dashboard_data['projects_summary']['by_faculty'][faculty] += 1
                
                if program not in dashboard_data['projects_summary']['by_program']:
                    dashboard_data['projects_summary']['by_program'][program] = 0
                    dashboard_data['resource_allocation']['by_program'][program] = 0
                dashboard_data['projects_summary']['by_program'][program] += 1
                
                # Análisis de tareas y fechas límite
                current_phase = None
                for fase in data.get('fases', []):
                    if fase.get('faseId') == data.get('faseActual'):
                        current_phase = fase
                        dashboard_data['timeline_data']['active_phases'].append({
                            'project_id': project.id,
                            'project_name': data.get('titulo'),
                            'phase_name': fase.get('nombre'),
                            'progress': fase.get('progreso', 0)
                        })
                    
                    for tarea in fase.get('tareas', []):
                        dashboard_data['tasks_summary']['total'] += 1
                        if tarea.get('completada'):
                            dashboard_data['tasks_summary']['completed'] += 1
                            if tarea.get('fechaCompletado'):
                                dashboard_data['timeline_data']['recent_completions'].append({
                                    'task_id': tarea.get('tareaId'),
                                    'task_name': tarea.get('descripcion'),
                                    'completion_date': tarea['fechaCompletado'].isoformat()
                                })
                        else:
                            dashboard_data['tasks_summary']['pending'] += 1
                            if tarea.get('fechaLimite'):
                                if tarea['fechaLimite'] < datetime.now():
                                    dashboard_data['tasks_summary']['delayed'] += 1
                                else:
                                    dashboard_data['timeline_data']['upcoming_deadlines'].append({
                                        'task_id': tarea.get('tareaId'),
                                        'task_name': tarea.get('descripcion'),
                                        'deadline': tarea['fechaLimite'].isoformat(),
                                        'project_name': data.get('titulo')
                                    })
                
                # Análisis del equipo y recursos
                equipo = data.get('equipo', {})
                for rol, miembro_id in equipo.items():
                    if miembro_id:
                        team_members.add(miembro_id)
                        role_upper = rol.upper()
                        dashboard_data['team_overview']['by_role'][role_upper] += 1
                        
                        if miembro_id not in dashboard_data['resource_allocation']['by_role']:
                            dashboard_data['resource_allocation']['by_role'][miembro_id] = {
                                'projects': 0,
                                'tasks': 0,
                                'role': role_upper
                            }
                        dashboard_data['resource_allocation']['by_role'][miembro_id]['projects'] += 1
                
                # Actualizar asignación de recursos
                dashboard_data['resource_allocation']['by_faculty'][faculty] += len(team_members)
                dashboard_data['resource_allocation']['by_program'][program] += len(team_members)
                
                # Cálculo de tiempos de completitud
                if status == 'COMPLETADO':
                    if data.get('createdAt') and data.get('updatedAt'):
                        time_to_complete = (data['updatedAt'] - data['createdAt']).days
                        completion_times.append(time_to_complete)
            
            # Ordenar y limitar las listas de timeline
            dashboard_data['timeline_data']['upcoming_deadlines'] = sorted(
                dashboard_data['timeline_data']['upcoming_deadlines'],
                key=lambda x: x['deadline']
            )[:5]
            
            dashboard_data['timeline_data']['recent_completions'] = sorted(
                dashboard_data['timeline_data']['recent_completions'],
                key=lambda x: x['completion_date'],
                reverse=True
            )[:5]
            
            # Actualizar métricas finales
            dashboard_data['team_overview']['total_members'] = len(team_members)
            
            if completion_times:
                dashboard_data['performance_metrics']['average_completion_time'] = sum(completion_times) / len(completion_times)
            
            total_completed = dashboard_data['projects_summary']['by_status']['COMPLETADO']
            if dashboard_data['projects_summary']['total'] > 0:
                dashboard_data['performance_metrics']['on_time_completion_rate'] = (
                    (total_completed - dashboard_data['tasks_summary']['delayed']) / 
                    dashboard_data['projects_summary']['total'] * 100
                )
                dashboard_data['performance_metrics']['delayed_projects_rate'] = (
                    dashboard_data['tasks_summary']['delayed'] / 
                    dashboard_data['projects_summary']['total'] * 100
                )
            
            return dashboard_data
            
        except Exception as e:
            print(f"Error generando datos del dashboard: {str(e)}")
            return {'error': str(e)}, 500

    @staticmethod
    def generate_user_metrics(user_id):
        """Genera métricas detalladas para un usuario específico"""
        try:
            db = firestore.client()
            
            user_metrics = {
                'projects': {
                    'total': 0,
                    'as_director': 0,
                    'as_leader': 0,
                    'as_collaborator': 0,
                    'as_teacher': 0,
                    'by_status': {
                        'PLANIFICACION': 0,
                        'EN_PROGRESO': 0,
                        'EVALUACION': 0,
                        'COMPLETADO': 0,
                        'CANCELADO': 0
                    }
                },
                'tasks': {
                    'total': 0,
                    'completed': 0,
                    'pending': 0,
                    'delayed': 0,
                    # app/services/metrics_service.py (continuación)
                    'by_priority': {
                        'ALTA': 0,
                        'MEDIA': 0,
                        'BAJA': 0
                    },
                    'recent_activity': []
                },
                'performance': {
                    'completion_rate': 0,
                    'on_time_rate': 0,
                    'average_task_time': 0,
                    'efficiency_score': 0
                },
                'contribution': {
                    'comments': 0,
                    'documents': 0,
                    'reviews': 0
                },
                'timeline': {
                    'upcoming_deadlines': [],
                    'recent_completions': [],
                    'active_tasks': []
                }
            }
            
            task_times = []
            total_tasks_weight = 0
            completed_tasks_weight = 0
            
            # Buscar proyectos donde el usuario participa en cualquier rol
            roles = ['director', 'lider', 'docente', 'colaborador']
            for role in roles:
                projects = db.collection('projects')\
                            .where(f'equipo.{role}', '==', user_id)\
                            .stream()
                            
                for project in projects:
                    data = project.to_dict()
                    user_metrics['projects']['total'] += 1
                    user_metrics['projects'][f'as_{role}'] += 1
                    
                    # Contabilizar por estado
                    status = data.get('estado', 'EN_PROGRESO')
                    user_metrics['projects']['by_status'][status] += 1
                    
                    # Analizar tareas asignadas
                    for fase in data.get('fases', []):
                        for tarea in fase.get('tareas', []):
                            if user_id in tarea.get('asignadoA', []):
                                task_weight = 1
                                if tarea.get('prioridad') == 'ALTA':
                                    task_weight = 3
                                    user_metrics['tasks']['by_priority']['ALTA'] += 1
                                elif tarea.get('prioridad') == 'MEDIA':
                                    task_weight = 2
                                    user_metrics['tasks']['by_priority']['MEDIA'] += 1
                                else:
                                    user_metrics['tasks']['by_priority']['BAJA'] += 1
                                
                                total_tasks_weight += task_weight
                                user_metrics['tasks']['total'] += 1
                                
                                if tarea.get('completada'):
                                    user_metrics['tasks']['completed'] += 1
                                    completed_tasks_weight += task_weight
                                    
                                    if tarea.get('fechaCompletado') and tarea.get('fechaAsignacion'):
                                        task_time = (tarea['fechaCompletado'] - tarea['fechaAsignacion']).days
                                        task_times.append(task_time)
                                        
                                        # Añadir a completados recientes
                                        user_metrics['timeline']['recent_completions'].append({
                                            'task_id': tarea.get('tareaId'),
                                            'description': tarea.get('descripcion'),
                                            'project_name': data.get('titulo'),
                                            'completion_date': tarea['fechaCompletado'].isoformat(),
                                            'time_taken': task_time
                                        })
                                else:
                                    user_metrics['tasks']['pending'] += 1
                                    
                                    # Verificar si está retrasada
                                    if tarea.get('fechaLimite') and tarea['fechaLimite'] < datetime.now():
                                        user_metrics['tasks']['delayed'] += 1
                                    elif tarea.get('fechaLimite'):
                                        # Añadir a próximas fechas límite
                                        user_metrics['timeline']['upcoming_deadlines'].append({
                                            'task_id': tarea.get('tareaId'),
                                            'description': tarea.get('descripcion'),
                                            'project_name': data.get('titulo'),
                                            'deadline': tarea['fechaLimite'].isoformat(),
                                            'days_remaining': (tarea['fechaLimite'] - datetime.now()).days
                                        })
                                    
                                    # Añadir a tareas activas
                                    user_metrics['timeline']['active_tasks'].append({
                                        'task_id': tarea.get('tareaId'),
                                        'description': tarea.get('descripcion'),
                                        'project_name': data.get('titulo'),
                                        'phase_name': fase.get('nombre'),
                                        'priority': tarea.get('prioridad', 'MEDIA')
                                    })
                            
                            # Contabilizar contribuciones
                            if tarea.get('comentarios'):
                                for comentario in tarea['comentarios']:
                                    if comentario.get('userId') == user_id:
                                        user_metrics['contribution']['comments'] += 1
                            
                            if tarea.get('archivosAdjuntos'):
                                for archivo in tarea['archivosAdjuntos']:
                                    if archivo.get('userId') == user_id:
                                        user_metrics['contribution']['documents'] += 1
            
            # Ordenar y limitar las listas de timeline
            user_metrics['timeline']['upcoming_deadlines'] = sorted(
                user_metrics['timeline']['upcoming_deadlines'],
                key=lambda x: x['deadline']
            )[:5]
            
            user_metrics['timeline']['recent_completions'] = sorted(
                user_metrics['timeline']['recent_completions'],
                key=lambda x: x['completion_date'],
                reverse=True
            )[:5]
            
            # Calcular métricas de rendimiento
            if user_metrics['tasks']['total'] > 0:
                user_metrics['performance']['completion_rate'] = (
                    user_metrics['tasks']['completed'] / user_metrics['tasks']['total'] * 100
                )
                user_metrics['performance']['on_time_rate'] = (
                    (user_metrics['tasks']['completed'] - user_metrics['tasks']['delayed']) /
                    user_metrics['tasks']['total'] * 100
                )
                
                # Calcular score de eficiencia
                if total_tasks_weight > 0:
                    efficiency_base = (completed_tasks_weight / total_tasks_weight) * 100
                    on_time_bonus = user_metrics['performance']['on_time_rate'] * 0.2
                    contribution_bonus = (
                        (user_metrics['contribution']['comments'] + 
                         user_metrics['contribution']['documents'] * 2) / 
                        user_metrics['tasks']['total']
                    ) * 10
                    
                    user_metrics['performance']['efficiency_score'] = min(
                        100, 
                        efficiency_base + on_time_bonus + contribution_bonus
                    )
            
            if task_times:
                user_metrics['performance']['average_task_time'] = sum(task_times) / len(task_times)
            
            # Añadir medallas o logros basados en el rendimiento
            achievements = []
            if user_metrics['performance']['completion_rate'] >= 90:
                achievements.append('ALTO_RENDIMIENTO')
            if user_metrics['performance']['on_time_rate'] >= 95:
                achievements.append('PUNTUALIDAD_EXCEPCIONAL')
            if user_metrics['contribution']['comments'] + user_metrics['contribution']['documents'] > 50:
                achievements.append('COLABORADOR_ACTIVO')
            if user_metrics['projects']['total'] >= 5:
                achievements.append('EXPERIMENTADO')
                
            user_metrics['achievements'] = achievements
            
            return user_metrics
            
        except Exception as e:
            print(f"Error generando métricas del usuario: {str(e)}")
            return {'error': str(e)}, 500

    @staticmethod
    def generate_comparative_report(start_date=None, end_date=None, faculty=None):
        """Genera un reporte comparativo entre diferentes períodos"""
        try:
            db = firestore.client()
            query = db.collection('projects')
            
            if faculty:
                query = query.where('facultad', '==', faculty)
            
            projects = query.stream()
            
            report_data = {
                'period_comparison': {
                    'current': {
                        'total_projects': 0,
                        'completed_projects': 0,
                        'completion_rate': 0,
                        'average_delay': 0
                    },
                    'previous': {
                        'total_projects': 0,
                        'completed_projects': 0,
                        'completion_rate': 0,
                        'average_delay': 0
                    }
                },
                'trends': {
                    'completion_trend': [],
                    'delay_trend': [],
                    'efficiency_trend': []
                },
                'performance_by_program': {},
                'recommendations': []
            }
            
            for project in projects:
                data = project.to_dict()
                created_at = data.get('createdAt')
                
                if not created_at:
                    continue
                
                # Determinar período
                is_current = True
                if start_date and end_date:
                    is_current = start_date <= created_at <= end_date
                
                period = 'current' if is_current else 'previous'
                
                # Actualizar métricas del período
                report_data['period_comparison'][period]['total_projects'] += 1
                if data.get('estado') == 'COMPLETADO':
                    report_data['period_comparison'][period]['completed_projects'] += 1
                
                # Actualizar métricas por programa
                program = data.get('programa')
                if program not in report_data['performance_by_program']:
                    report_data['performance_by_program'][program] = {
                        'total_projects': 0,
                        'completed_projects': 0,
                        'average_completion_time': 0,
                        'delayed_projects': 0
                    }
                
                prog_metrics = report_data['performance_by_program'][program]
                prog_metrics['total_projects'] += 1
                
                if data.get('estado') == 'COMPLETADO':
                    prog_metrics['completed_projects'] += 1
                    if data.get('createdAt') and data.get('updatedAt'):
                        completion_time = (data['updatedAt'] - data['createdAt']).days
                        prog_metrics['average_completion_time'] = (
                            (prog_metrics['average_completion_time'] * (prog_metrics['completed_projects'] - 1) + 
                             completion_time) / prog_metrics['completed_projects']
                        )
                
                if data.get('metricas', {}).get('retrasosAcumulados', 0) > 0:
                    prog_metrics['delayed_projects'] += 1
            
            # Calcular tasas de completitud para ambos períodos
            for period in ['current', 'previous']:
                metrics = report_data['period_comparison'][period]
                if metrics['total_projects'] > 0:
                    metrics['completion_rate'] = (
                        metrics['completed_projects'] / metrics['total_projects'] * 100
                    )
            
            # Generar recomendaciones basadas en métricas
            current_metrics = report_data['period_comparison']['current']
            previous_metrics = report_data['period_comparison']['previous']
            
            if current_metrics['completion_rate'] < previous_metrics['completion_rate']:
                report_data['recommendations'].append({
                    'type': 'WARNING',
                    'message': 'La tasa de completitud ha disminuido respecto al período anterior',
                    'suggestion': 'Revisar la asignación de recursos y la planificación de proyectos'
                })
            
            for program, metrics in report_data['performance_by_program'].items():
                if metrics['total_projects'] > 0:
                    delay_rate = metrics['delayed_projects'] / metrics['total_projects'] * 100
                    if delay_rate > 30:
                        report_data['recommendations'].append({
                            'type': 'ALERT',
                            'message': f'Alto índice de retrasos en {program}',
                            'suggestion': 'Implementar seguimiento más cercano y revisión de la capacidad del equipo'
                        })
            
            return report_data
            
        except Exception as e:
            print(f"Error generando reporte comparativo: {str(e)}")
            return {'error': str(e)}, 500