from __future__ import annotations

from dataclasses import dataclass
from .models import Action, Resource, ResourceType, Role, User

Permission = tuple[ResourceType, Action]

WILDCARD_ACTIONS: dict[ResourceType, set[Action]] = {
    ResourceType.WORKSPACE: {Action.CREATE, Action.READ, Action.UPDATE, Action.DELETE, Action.START, Action.STOP},
    ResourceType.EXTENSION: {Action.INSTALL, Action.APPROVE, Action.PUBLISH, Action.READ},
    ResourceType.MODEL: {Action.INVOKE, Action.CONFIGURE},
    ResourceType.INTEGRATION: {Action.READ, Action.QUERY, Action.CONFIGURE},
    ResourceType.AUDIT: {Action.READ},
    ResourceType.POLICY: {Action.READ, Action.UPDATE},
}


def _expand(entries: dict[ResourceType, set[Action] | str]) -> set[Permission]:
    out: set[Permission] = set()
    for rt, acts in entries.items():
        actions = WILDCARD_ACTIONS[rt] if acts == "*" else acts  # type: ignore[assignment]
        for a in actions:
            out.add((rt, a))
    return out


ROLE_PERMISSIONS: dict[Role, set[Permission]] = {
    Role.PLATFORM_ADMIN: _expand({rt: "*" for rt in ResourceType}),
    Role.TENANT_ADMIN: _expand(
        {
            ResourceType.WORKSPACE: "*",
            ResourceType.EXTENSION: "*",
            ResourceType.MODEL: "*",
            ResourceType.INTEGRATION: "*",
            ResourceType.AUDIT: {Action.READ},
            ResourceType.POLICY: {Action.READ},
        }
    ),
    Role.SQUAD_LEAD: _expand(
        {
            ResourceType.WORKSPACE: "*",
            ResourceType.EXTENSION: {Action.INSTALL, Action.READ},
            ResourceType.MODEL: {Action.INVOKE},
            ResourceType.INTEGRATION: {Action.READ, Action.QUERY},
        }
    ),
    Role.ENGINEER: _expand(
        {
            ResourceType.WORKSPACE: {Action.CREATE, Action.READ, Action.UPDATE, Action.START, Action.STOP},
            ResourceType.EXTENSION: {Action.INSTALL, Action.READ},
            ResourceType.MODEL: {Action.INVOKE},
            ResourceType.INTEGRATION: {Action.READ, Action.QUERY},
        }
    ),
    Role.VIEWER: _expand(
        {
            ResourceType.WORKSPACE: {Action.READ},
            ResourceType.EXTENSION: {Action.READ},
            ResourceType.INTEGRATION: {Action.READ},
        }
    ),
}

ADMIN_ROLES = {Role.PLATFORM_ADMIN, Role.TENANT_ADMIN}
SQUAD_SCOPED_ROLES = {Role.SQUAD_LEAD, Role.ENGINEER, Role.VIEWER}


@dataclass(frozen=True)
class Decision:
    allowed: bool
    reason: str
    matched_role: Role | None = None


def _has_permission(user: User, perm: Permission) -> Role | None:
    for role in user.roles:
        if perm in ROLE_PERMISSIONS.get(role, set()):
            return role
    return None


def authorize(user: User, action: Action, resource: Resource) -> Decision:
    perm: Permission = (resource.type, action)

    matched = _has_permission(user, perm)
    if matched is None:
        return Decision(False, "no_permission")

    if Role.PLATFORM_ADMIN in user.roles:
        return Decision(True, "platform_admin_override", Role.PLATFORM_ADMIN)

    if user.tenant_id != resource.tenant_id:
        return Decision(False, "cross_tenant_denied", matched)

    if matched in SQUAD_SCOPED_ROLES and resource.squad_id is not None:
        if resource.squad_id not in user.squad_ids:
            return Decision(False, "squad_scope_denied", matched)

    return Decision(True, "granted", matched)
