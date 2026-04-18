from __future__ import annotations

from fastapi import Depends, FastAPI
from .deps import current_user, require
from .models import Action, ResourceType, User
from .audit import audit_log

app = FastAPI(title="RBAC Spike")


@app.post("/workspaces", status_code=201)
def create_workspace(user: User = Depends(require(Action.CREATE, ResourceType.WORKSPACE))):
    return {"ok": True, "by": user.id}


@app.get("/workspaces/{resource_id}")
def read_workspace(
    resource_id: str,
    user: User = Depends(require(Action.READ, ResourceType.WORKSPACE)),
):
    return {"id": resource_id, "by": user.id}


@app.post("/extensions/{resource_id}/approve")
def approve_extension(
    resource_id: str,
    user: User = Depends(require(Action.APPROVE, ResourceType.EXTENSION)),
):
    return {"approved": resource_id, "by": user.id}


@app.post("/models/{resource_id}/invoke")
def invoke_model(
    resource_id: str,
    user: User = Depends(require(Action.INVOKE, ResourceType.MODEL)),
):
    return {"invoked": resource_id, "by": user.id}


@app.get("/audit")
def read_audit(user: User = Depends(require(Action.READ, ResourceType.AUDIT))):
    return {"entries": [e.to_dict() for e in audit_log.entries]}


@app.get("/me")
def me(user: User = Depends(current_user)):
    return {
        "id": user.id,
        "tenant_id": user.tenant_id,
        "roles": [r.value for r in user.roles],
        "squads": sorted(user.squad_ids),
    }
