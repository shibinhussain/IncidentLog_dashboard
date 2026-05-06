from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.incident import (
    IncidentCreate,
    IncidentResponse,
    IncidentUpdate,
    PaginatedResponse,
    Severity,
    Status,
)
from app.services.incident_service import IncidentService


router = APIRouter(prefix="", tags=["incidents"])


@router.get("/incidents", response_model=PaginatedResponse[IncidentResponse])
def list_incidents(
    search: str | None = None,
    severity: Severity | None = None,
    status_filter: Status | None = Query(default=None, alias="status"),
    sort_by: str = Query(default="created_at"),
    sort_order: str = Query(default="desc", pattern="^(asc|desc)$"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
) -> PaginatedResponse[IncidentResponse]:
    service = IncidentService(db)
    result = service.get_all(
        {
            "search": search,
            "severity": severity.value if severity else None,
            "status": status_filter.value if status_filter else None,
            "sort_by": sort_by,
            "sort_order": sort_order,
            "page": page,
            "page_size": page_size,
        }
    )
    return PaginatedResponse[IncidentResponse](**result)


@router.post(
    "/incidents",
    response_model=IncidentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_incident(
    payload: IncidentCreate,
    db: Session = Depends(get_db),
) -> IncidentResponse:
    service = IncidentService(db)
    incident = service.create(payload)
    return IncidentResponse.model_validate(incident)


@router.get("/incidents/{id}", response_model=IncidentResponse)
def get_incident(id: str, db: Session = Depends(get_db)) -> IncidentResponse:
    service = IncidentService(db)
    incident = service.get_by_id(id)
    if incident is None:
        raise HTTPException(status_code=404, detail="Incident not found")
    return IncidentResponse.model_validate(incident)


@router.put("/incidents/{id}", response_model=IncidentResponse)
def update_incident(
    id: str,
    payload: IncidentUpdate,
    db: Session = Depends(get_db),
) -> IncidentResponse:
    service = IncidentService(db)
    incident = service.update(id, payload)
    if incident is None:
        raise HTTPException(status_code=404, detail="Incident not found")
    return IncidentResponse.model_validate(incident)


@router.delete("/incidents/{id}")
def delete_incident(id: str, db: Session = Depends(get_db)) -> dict[str, str]:
    service = IncidentService(db)
    deleted = service.delete(id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Incident not found")
    return {"message": "Incident deleted successfully"}
