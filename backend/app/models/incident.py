from __future__ import annotations

from datetime import datetime, timedelta, timezone
from uuid import uuid4

from sqlalchemy import DateTime, Index, String, Text, func, select
from sqlalchemy.orm import Mapped, Session, mapped_column

from app.core.database import Base


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Incident(Base):
    __tablename__ = "incidents"
    __table_args__ = (
        Index("ix_incidents_severity", "severity"),
        Index("ix_incidents_status", "status"),
        Index("ix_incidents_date", "date"),
        Index("ix_incidents_created_at", "created_at"),
    )

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid4()))
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    severity: Mapped[str] = mapped_column(String(20), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False)
    date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False
    )

    def __repr__(self) -> str:
        return (
            f"Incident(id={self.id!r}, title={self.title!r}, severity={self.severity!r}, "
            f"status={self.status!r}, date={self.date.isoformat()!r})"
        )


def seed_sample_data(db: Session) -> None:
    existing_count = db.scalar(select(func.count()).select_from(Incident))
    if existing_count:
        return

    now = utcnow()
    samples = [
        {
            "title": "API latency spike in auth service",
            "description": "Users experienced slow login responses after a traffic surge.",
            "severity": "high",
            "status": "investigating",
            "date": now - timedelta(days=1, hours=3),
        },
        {
            "title": "Payment webhook retries increasing",
            "description": "Webhook delivery delays caused duplicate retry events for some merchants.",
            "severity": "medium",
            "status": "open",
            "date": now - timedelta(days=2, hours=4),
        },
        {
            "title": "Primary database failover event",
            "description": "The production database failed over after storage saturation on the primary node.",
            "severity": "critical",
            "status": "resolved",
            "date": now - timedelta(days=3, hours=6),
        },
        {
            "title": "Suspicious admin login attempt",
            "description": "Security monitoring detected repeated failed admin login attempts from a new IP range.",
            "severity": "high",
            "status": "investigating",
            "date": now - timedelta(days=4, hours=2),
        },
        {
            "title": "Search indexing backlog",
            "description": "Index workers fell behind after a deployment and delayed fresh search results.",
            "severity": "medium",
            "status": "resolved",
            "date": now - timedelta(days=5, hours=5),
        },
        {
            "title": "Email notifications partially delayed",
            "description": "Transactional emails were queued longer than expected for a subset of tenants.",
            "severity": "low",
            "status": "resolved",
            "date": now - timedelta(days=6, hours=1),
        },
        {
            "title": "CDN cache invalidation failure",
            "description": "Static asset invalidation failed, leaving stale frontend bundles in edge caches.",
            "severity": "high",
            "status": "open",
            "date": now - timedelta(days=7, hours=7),
        },
        {
            "title": "Reporting export timeout",
            "description": "Large CSV exports timed out during generation for enterprise accounts.",
            "severity": "medium",
            "status": "investigating",
            "date": now - timedelta(days=8, hours=2),
        },
        {
            "title": "Audit log ingestion gap",
            "description": "A broker partition issue caused a short gap in audit event ingestion.",
            "severity": "high",
            "status": "resolved",
            "date": now - timedelta(days=9, hours=4),
        },
        {
            "title": "Feature flag sync drift",
            "description": "Two application nodes served stale feature flag values after cache desynchronization.",
            "severity": "low",
            "status": "open",
            "date": now - timedelta(days=10, hours=3),
        },
        {
            "title": "SSO callback mismatch",
            "description": "Customers using one SSO provider hit redirect mismatches after certificate rotation.",
            "severity": "medium",
            "status": "resolved",
            "date": now - timedelta(days=11, hours=6),
        },
        {
            "title": "Background job worker crash loop",
            "description": "Queue workers crashed repeatedly because of malformed payload handling in one job type.",
            "severity": "critical",
            "status": "investigating",
            "date": now - timedelta(days=12, hours=8),
        },
        {
            "title": "Dashboard metrics lag",
            "description": "Customer dashboards displayed stale analytics because the aggregation job slowed down.",
            "severity": "medium",
            "status": "open",
            "date": now - timedelta(days=13, hours=2),
        },
        {
            "title": "File upload antivirus queue delay",
            "description": "Uploaded files were held longer than expected while awaiting malware scanning.",
            "severity": "low",
            "status": "resolved",
            "date": now - timedelta(days=15, hours=3),
        },
        {
            "title": "Mobile API token refresh failure",
            "description": "A refresh token parsing bug caused mobile sessions to expire unexpectedly.",
            "severity": "high",
            "status": "resolved",
            "date": now - timedelta(days=17, hours=5),
        },
        {
            "title": "Data warehouse sync interruption",
            "description": "Nightly sync to the warehouse stopped midway after a network maintenance window.",
            "severity": "medium",
            "status": "investigating",
            "date": now - timedelta(days=19, hours=4),
        },
        {
            "title": "Customer portal 502 errors",
            "description": "A bad upstream health check configuration caused intermittent 502s in the portal.",
            "severity": "critical",
            "status": "resolved",
            "date": now - timedelta(days=21, hours=1),
        },
        {
            "title": "Role permission regression",
            "description": "A release changed one policy check and prevented some managers from editing incidents.",
            "severity": "high",
            "status": "resolved",
            "date": now - timedelta(days=23, hours=2),
        },
        {
            "title": "Session cleanup task skipped",
            "description": "Expired sessions persisted longer than intended after a scheduled task was disabled.",
            "severity": "low",
            "status": "open",
            "date": now - timedelta(days=26, hours=6),
        },
        {
            "title": "Backup verification alert",
            "description": "Automated backup validation reported checksum mismatches for one recent snapshot.",
            "severity": "critical",
            "status": "investigating",
            "date": now - timedelta(days=28, hours=5),
        },
    ]

    db.add_all(Incident(**sample) for sample in samples)
    db.commit()
