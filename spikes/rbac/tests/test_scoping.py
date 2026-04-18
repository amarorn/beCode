from app.audit import AuditLog
from app.models import Action, Resource, ResourceType, Role, User
from app.policy import authorize


def test_audit_records_denials():
    log = AuditLog()
    eng = User("u1", "t-a", frozenset({Role.ENGINEER}), frozenset({"sq-a1"}))
    resource = Resource(ResourceType.WORKSPACE, "w1", "t-b", "sq-a1")
    decision = authorize(eng, Action.READ, resource)
    log.record(eng, Action.READ, resource, decision)
    assert len(log.denied()) == 1
    assert log.denied()[0].reason == "cross_tenant_denied"


def test_audit_ignores_non_admin_allows():
    log = AuditLog()
    eng = User("u1", "t-a", frozenset({Role.ENGINEER}), frozenset({"sq-a1"}))
    resource = Resource(ResourceType.WORKSPACE, "w1", "t-a", "sq-a1")
    decision = authorize(eng, Action.READ, resource)
    log.record(eng, Action.READ, resource, decision)
    assert log.entries == []


def test_audit_records_admin_actions():
    log = AuditLog()
    admin = User("u-admin", "t-a", frozenset({Role.TENANT_ADMIN}))
    resource = Resource(ResourceType.POLICY, "p1", "t-a", None)
    decision = authorize(admin, Action.READ, resource)
    log.record(admin, Action.READ, resource, decision)
    assert len(log.admin()) == 1
    assert log.admin()[0].allowed is True


def test_squad_lead_multi_squad():
    lead = User("u-lead", "t-a", frozenset({Role.SQUAD_LEAD}), frozenset({"sq-a1", "sq-a2"}))
    for sq in ("sq-a1", "sq-a2"):
        assert authorize(lead, Action.DELETE, Resource(ResourceType.WORKSPACE, "w", "t-a", sq)).allowed
    assert not authorize(lead, Action.DELETE, Resource(ResourceType.WORKSPACE, "w", "t-a", "sq-a3")).allowed


def test_resource_without_squad_bypasses_squad_check():
    eng = User("u1", "t-a", frozenset({Role.ENGINEER}), frozenset({"sq-a1"}))
    r = Resource(ResourceType.WORKSPACE, "w", "t-a", None)
    assert authorize(eng, Action.READ, r).allowed
