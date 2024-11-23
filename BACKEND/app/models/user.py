# app/models/user.py
from dataclasses import dataclass
from datetime import datetime
from typing import List, Dict, Optional

@dataclass
class User:
    uid: str
    email: str
    nombreCompleto: str
    rol: List[str]  # ['ADMIN', 'DIRECTOR', 'LIDER', 'COLABORADOR', 'DOCENTE']
    facultad: str
    programa: str
    proyectos: List[str]  # Lista de IDs de proyectos
    createdAt: datetime
    lastLogin: datetime
    estado: Dict[str, any]  # {aprobado: bool, activo: bool, fechaAprobacion: datetime}
    datosPersonales: Dict[str, str]  # {documento, tipoDocumento, telefono, cargo}
    configuraciones: Dict[str, any]  # {notificacionesEmail: bool, temaOscuro: bool, idiomaPreferido: str}

