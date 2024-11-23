from dataclasses import dataclass
from datetime import datetime
from typing import List, Dict, Optional
from phase import Phase
@dataclass
class Project:
    projectId: str
    titulo: str
    descripcion: str
    objetivos: List[Dict]  # Lista de {id, descripcion, cumplido}
    facultad: str
    programa: str
    estado: str  # ['PLANIFICACION', 'EN_PROGRESO', 'EVALUACION', 'COMPLETADO', 'CANCELADO']
    faseActual: int
    fases: List[Phase]
    equipo: Dict[str, str]  # {director, lider, colaboradores: [], docente}
    createdAt: datetime
    updatedAt: datetime
    metricas: Dict[str, float]