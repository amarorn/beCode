from __future__ import annotations

from typing import Callable
from fastapi import Depends, Header, HTTPException, status
from .models import Action, Resource, ResourceType, Role, User
from .policy import authorize
from .audit import audit_log


MOCK_USERS: dict[str, User] = {
    "u-platform": User("u-platform", "t-system", frozenset({Role.PLATFORM_ADMIN})),
    "u-tadmin-a": User("u-tadmin-a", "t-a", frozenset({Role.TENANT_ADMIN})),
    "u-lead-a1": User("u-lead-a1", "t-a", frozenset({Role.SQUAD_LEAD}), frozenset({"sq-a1"})),
    "u-eng-a1": User("u-eng-a1", "t-a", frozenset({Role.ENGINEER}), frozenset({"sq-a1"})),
    "u-eng-a2": User("u-eng-a2", "t-a", frozenset({Role.ENGINEER}), frozenset({"sq-a2"})),
    "u-viewer-a1": User("u-viewer-a1", "t-a", frozenset({Role.VIEWER}), frozenset({"sq-a1"})),
    "u-eng-b1": User("u-eng-b1", "t-b", frozenset({Role.ENGINEER}), frozenset({"sq-b1"})),
}


def current_user(x_user_id: str = Header(...)) -> User:
    user = MOCK_USERS.get(x_user_id)
    if user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "unknown user")
    return user


def require(action: Action, resource_type: ResourceType) -> Callable:
    def _dep(
        user: User = Depends(current_user),
        resource_id: str = "",
        tenant_id: str = "",
        squad_id: str | None = None,
    ) -> User:
        resource = Resource(
            type=resource_type,
            id=resource_id or "unknown",
            tenant_id=tenant_id or user.tenant_id,
            squad_id=squad_id,
        )
        decision = authorize(user, action, resource)
        audit_log.record(user, action, resource, decision)
        if not decision.allowed:
            raise HTTPException(status.HTTP_403_FORBIDDEN, decision.reason)
        return user

    return _dep
