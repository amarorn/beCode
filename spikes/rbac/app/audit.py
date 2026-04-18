from __future__ import annotations

from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from .models import Action, Resource, Role, User
from .policy import Decision, ADMIN_ROLES


@dataclass(frozen=True)
class AuditEntry:
    timestamp: str
    user_id: str
    tenant_id: str
    action: str
    resource_type: str
    resource_id: str
    resource_tenant_id: str
    resource_squad_id: str | None
    allowed: bool
    reason: str
    matched_role: str | None
    admin_action: bool

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class AuditLog:
    entries: list[AuditEntry] = field(default_factory=list)

    def record(self, user: User, action: Action, resource: Resource, decision: Decision) -> AuditEntry | None:
        admin_action = decision.matched_role in ADMIN_ROLES
        if decision.allowed and not admin_action:
            return None

        entry = AuditEntry(
            timestamp=datetime.now(timezone.utc).isoformat(),
            user_id=user.id,
            tenant_id=user.tenant_id,
            action=action.value,
            resource_type=resource.type.value,
            resource_id=resource.id,
            resource_tenant_id=resource.tenant_id,
            resource_squad_id=resource.squad_id,
            allowed=decision.allowed,
            reason=decision.reason,
            matched_role=decision.matched_role.value if decision.matched_role else None,
            admin_action=admin_action,
        )
        self.entries.append(entry)
        return entry

    def denied(self) -> list[AuditEntry]:
        return [e for e in self.entries if not e.allowed]

    def admin(self) -> list[AuditEntry]:
        return [e for e in self.entries if e.admin_action]


audit_log = AuditLog()
