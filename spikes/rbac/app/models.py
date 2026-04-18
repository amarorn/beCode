from __future__ import annotations

from enum import Enum
from dataclasses import dataclass, field


class Role(str, Enum):
    PLATFORM_ADMIN = "platform_admin"
    TENANT_ADMIN = "tenant_admin"
    SQUAD_LEAD = "squad_lead"
    ENGINEER = "engineer"
    VIEWER = "viewer"


class ResourceType(str, Enum):
    WORKSPACE = "workspace"
    EXTENSION = "extension"
    MODEL = "model"
    INTEGRATION = "integration"
    AUDIT = "audit"
    POLICY = "policy"


class Action(str, Enum):
    CREATE = "create"
    READ = "read"
    UPDATE = "update"
    DELETE = "delete"
    START = "start"
    STOP = "stop"
    INSTALL = "install"
    APPROVE = "approve"
    PUBLISH = "publish"
    INVOKE = "invoke"
    CONFIGURE = "configure"
    QUERY = "query"


@dataclass(frozen=True)
class User:
    id: str
    tenant_id: str
    roles: frozenset[Role]
    squad_ids: frozenset[str] = field(default_factory=frozenset)


@dataclass(frozen=True)
class Resource:
    type: ResourceType
    id: str
    tenant_id: str
    squad_id: str | None = None
