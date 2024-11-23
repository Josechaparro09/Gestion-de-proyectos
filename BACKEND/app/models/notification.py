from dataclasses import dataclass
from datetime import datetime
from typing import List, Optional,Dict

@dataclass
class Notification:
    notificationId: str
    tipo: str  # ['DEADLINE', 'CAMBIO_ESTADO', 'ASIGNACION', 'COMENTARIO', 'APROBACION']
    mensaje: str
    projectId: str
    destinatarios: List[str]  # Lista de userIds
    leido: List[str]  # Lista de userIds que han leído
    createdAt: datetime
    prioridad: str  # ['ALTA', 'MEDIA', 'BAJA']
    accion: Dict[str, str]  # {tipo, url}
    metadata: Dict  # {origen, contexto}