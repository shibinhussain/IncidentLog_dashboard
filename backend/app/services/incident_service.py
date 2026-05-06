from __future__ import annotations

import math
from datetime import datetime, timedelta, timezone

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.models.incident import Incident
from app.schemas.incident import IncidentCreate, IncidentUpdate


class IncidentService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_all(self, filters: dict) -> dict:
        search = filters.get("search")
        severity = filters.get("severity")
        status = filters.get("status")
        sort_by = filters.get("sort_by", "created_at")
        sort_order = filters.get("sort_order", "desc")
        page = max(filters.get("page", 1), 1)
        page_size = min(max(filters.get("page_size", 20), 1), 100)

        query = select(Incident)
        count_query = select(func.count()).select_from(Incident)

        if search:
            pattern = f"%{search.strip()}%"
            search_clause = or_(
                Incident.title.ilike(pattern),
                Incident.description.ilike(pattern),
            )
            query = query.where(search_clause)
            count_query = count_query.where(search_clause)

        if severity:
            query = query.where(Incident.severity == severity)
            count_query = count_query.where(Incident.severity == severity)

        if status:
            query = query.where(Incident.status == status)
            count_query = count_query.where(Incident.status == status)

        sort_columns = {
            "date": Incident.date,
            "severity": Incident.severity,
            "title": Incident.title,
            "status": Incident.status,
            "created_at": Incident.created_at,
        }
        sort_column = sort_columns.get(sort_by, Incident.created_at)
        order_by = sort_column.asc() if sort_order == "asc" else sort_column.desc()

        total = self.db.scalar(count_query) or 0
        total_pages = math.ceil(total / page_size) if total else 0
        offset = (page - 1) * page_size

        incidents = self.db.scalars(
            query.order_by(order_by).offset(offset).limit(page_size)
        ).all()

        return {
            "data": incidents,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages,
        }

    def get_by_id(self, id: str) -> Incident | None:
        return self.db.get(Incident, id)

    def create(self, data: IncidentCreate) -> Incident:
        incident = Incident(**data.model_dump())
        self.db.add(incident)
        self.db.commit()
        self.db.refresh(incident)
        return incident

    def update(self, id: str, data: IncidentUpdate) -> Incident | None:
        incident = self.get_by_id(id)
        if incident is None:
            return None

        for field, value in data.model_dump(exclude_none=True).items():
            setattr(incident, field, value)

        self.db.commit()
        self.db.refresh(incident)
        return incident

    def delete(self, id: str) -> bool:
        incident = self.get_by_id(id)
        if incident is None:
            return False

        self.db.delete(incident)
        self.db.commit()
        return True

    def get_stats(self) -> dict:
        severity_keys = ["low", "medium", "high", "critical"]
        status_keys = ["open", "investigating", "resolved"]
        today = datetime.now(timezone.utc).date()
        start_date = today - timedelta(days=29)

        total = self.db.scalar(select(func.count()).select_from(Incident)) or 0

        severity_rows = self.db.execute(
            select(Incident.severity, func.count())
            .group_by(Incident.severity)
            .order_by(Incident.severity)
        ).all()
        by_severity = {key: 0 for key in severity_keys}
        for key, count in severity_rows:
            by_severity[key] = count

        status_rows = self.db.execute(
            select(Incident.status, func.count())
            .group_by(Incident.status)
            .order_by(Incident.status)
        ).all()
        by_status = {key: 0 for key in status_keys}
        for key, count in status_rows:
            by_status[key] = count

        date_rows = self.db.execute(
            select(func.date(Incident.date), func.count())
            .where(func.date(Incident.date) >= start_date)
            .group_by(func.date(Incident.date))
            .order_by(func.date(Incident.date))
        ).all()
        counts_by_day = {day: count for day, count in date_rows}

        by_date = []
        for index in range(30):
            current_day = start_date + timedelta(days=index)
            by_date.append(
                {
                    "date": current_day.isoformat(),
                    "count": counts_by_day.get(current_day, 0),
                }
            )

        return {
            "total": total,
            "by_severity": by_severity,
            "by_status": by_status,
            "by_date": by_date,
        }
