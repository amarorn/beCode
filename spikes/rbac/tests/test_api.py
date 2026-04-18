import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.audit import audit_log


@pytest.fixture(autouse=True)
def clear_audit():
    audit_log.entries.clear()
    yield
    audit_log.entries.clear()


@pytest.fixture
def client():
    return TestClient(app)


def test_unknown_user_401(client):
    r = client.get("/workspaces/w1", headers={"X-User-Id": "ghost"})
    assert r.status_code == 401


def test_engineer_creates_workspace(client):
    r = client.post("/workspaces", headers={"X-User-Id": "u-eng-a1"}, params={"squad_id": "sq-a1"})
    assert r.status_code == 201


def test_viewer_cannot_create(client):
    r = client.post("/workspaces", headers={"X-User-Id": "u-viewer-a1"}, params={"squad_id": "sq-a1"})
    assert r.status_code == 403
    assert r.json()["detail"] == "no_permission"


def test_cross_tenant_blocked(client):
    r = client.get(
        "/workspaces/w1",
        headers={"X-User-Id": "u-eng-a1"},
        params={"tenant_id": "t-b", "squad_id": "sq-a1"},
    )
    assert r.status_code == 403
    assert r.json()["detail"] == "cross_tenant_denied"


def test_engineer_wrong_squad_blocked(client):
    r = client.get(
        "/workspaces/w1",
        headers={"X-User-Id": "u-eng-a1"},
        params={"squad_id": "sq-a2"},
    )
    assert r.status_code == 403
    assert r.json()["detail"] == "squad_scope_denied"


def test_platform_admin_cross_tenant(client):
    r = client.get(
        "/workspaces/w1",
        headers={"X-User-Id": "u-platform"},
        params={"tenant_id": "t-b", "squad_id": "sq-b1"},
    )
    assert r.status_code == 200


def test_engineer_cannot_approve_extension(client):
    r = client.post("/extensions/ext1/approve", headers={"X-User-Id": "u-eng-a1"})
    assert r.status_code == 403


def test_tenant_admin_can_approve_extension(client):
    r = client.post("/extensions/ext1/approve", headers={"X-User-Id": "u-tadmin-a"})
    assert r.status_code == 200


def test_audit_endpoint_denied_for_engineer(client):
    r = client.get("/audit", headers={"X-User-Id": "u-eng-a1"})
    assert r.status_code == 403


def test_audit_records_denials_and_admin(client):
    client.get(
        "/workspaces/w1",
        headers={"X-User-Id": "u-eng-a1"},
        params={"tenant_id": "t-b", "squad_id": "sq-a1"},
    )
    client.post("/extensions/ext1/approve", headers={"X-User-Id": "u-tadmin-a"})
    r = client.get("/audit", headers={"X-User-Id": "u-tadmin-a"})
    assert r.status_code == 200
    entries = r.json()["entries"]
    reasons = {e["reason"] for e in entries}
    assert "cross_tenant_denied" in reasons
    assert any(e["admin_action"] and e["allowed"] for e in entries)
