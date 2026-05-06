from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.incident import IncidentStats
from app.services.incident_service import IncidentService


router = APIRouter(prefix="", tags=["stats"])


@router.get("/stats", response_model=IncidentStats)
def get_stats(db: Session = Depends(get_db)) -> IncidentStats:
    service = IncidentService(db)
    stats = service.get_stats()
    return IncidentStats(**stats)
