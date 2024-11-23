from dataclasses import dataclass
from datetime import datetime
from typing import List, Dict, Optional
from task import Task
@dataclass
class Phase:
    faseId: int
    nombre: str
    tareas: List[Task]
    progreso: float
    fechaInicio: datetime
    fechaFin: datetime
    comentarios: List[Dict]