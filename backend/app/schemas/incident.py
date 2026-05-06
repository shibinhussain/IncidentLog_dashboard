from __future__ import annotations

from datetime import date, datetime
from enum import Enum
from typing import Generic, Optional, TypeVar

from pydantic import BaseModel, Field


class Severity(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


class Status(str, Enum):
    open = "open"
    investigating = "investigating"
    resolved = "resolved"


class IncidentBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=10)
    severity: Severity
    status: Status
    date: datetime


class IncidentCreate(IncidentBase):
    pass


class IncidentUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=200)
    description: Optional[str] = Field(None, min_length=10)
    severity: Optional[Severity] = None
    status: Optional[Status] = None
    date: Optional[datetime] = None


class IncidentResponse(IncidentBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    data: list[T]
    total: int
    page: int
    page_size: int
    total_pages: int


class ByDatePoint(BaseModel):
    date: date
    count: int


class IncidentStats(BaseModel):
    by_severity: dict[Severity, int]
    by_status: dict[Status, int]
    by_date: list[ByDatePoint]
    total: int
