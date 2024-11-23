from dataclasses import dataclass
from datetime import datetime
from typing import List, Dict, Optional

@dataclass
class Task:
    tareaId: str
    descripcion: str
    completada: bool
    asignadoA: List[str]  # Lista de userIds
    fechaLimite: datetime
    prioridad: str
    archivosAdjuntos: List[Dict]  # Lista de {nombre, url, tipo, tamaño, fechaSubida}