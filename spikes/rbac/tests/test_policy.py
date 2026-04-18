from app.models import Action, Resource, ResourceType, Role, User
from app.policy import authorize


def mk_user(role: Role, tenant="t-a", squads=()) -> User:
    return User(f"u-{role.value}", tenant, frozenset({role}), frozenset(squads))


def res(rt=ResourceType.WORKSPACE, tenant="t-a", squad="sq-a1", rid="r1") -> Resource:
    return Resource(rt, rid, tenant, squad)


def test_deny_by_default_unknown_permission():
    viewer = mk_user(Role.VIEWER, squads=["sq-a1"])
    d = authorize(viewer, Action.DELETE, res())
    assert not d.allowed
    assert d.reason == "no_permission"


def test_engineer_allowed_on_own_squad():
    eng = mk_user(Role.ENGINEER, squads=["sq-a1"])
    assert authorize(eng, Action.CREATE, res(squad="sq-a1")).allowed


def test_engineer_denied_other_squad():
    eng = mk_user(Role.ENGINEER, squads=["sq-a1"])
    d = authorize(eng, Action.READ, res(squad="sq-a2"))
    assert not d.allowed
    assert d.reason == "squad_scope_denied"


def test_cross_tenant_denied():
    eng = mk_user(Role.ENGINEER, tenant="t-a", squads=["sq-a1"])
    d = authorize(eng, Action.READ, res(tenant="t-b", squad="sq-a1"))
    assert not d.allowed
    assert d.reason == "cross_tenant_denied"


def test_platform_admin_cross_tenant_allowed():
    admin = User("u-p", "t-system", frozenset({Role.PLATFORM_ADMIN}))
    d = authorize(admin, Action.DELETE, res(tenant="t-b"))
    assert d.allowed
    assert d.reason == "platform_admin_override"


def test_tenant_admin_scoped_to_tenant():
    admin = mk_user(Role.TENANT_ADMIN)
    assert authorize(admin, Action.DELETE, res(tenant="t-a", squad=None)).allowed
    d = authorize(admin, Action.DELETE, res(tenant="t-b", squad=None))
    assert not d.allowed
    assert d.reason == "cross_tenant_denied"


def test_tenant_admin_ignores_squad_scope():
    admin = mk_user(Role.TENANT_ADMIN)
    assert authorize(admin, Action.DELETE, res(squad="sq-zzz")).allowed


def test_viewer_read_only():
    v = mk_user(Role.VIEWER, squads=["sq-a1"])
    assert authorize(v, Action.READ, res()).allowed
    assert not authorize(v, Action.CREATE, res()).allowed


def test_extension_approve_requires_admin():
    lead = mk_user(Role.SQUAD_LEAD, squads=["sq-a1"])
    d = authorize(lead, Action.APPROVE, res(ResourceType.EXTENSION, squad=None))
    assert not d.allowed
    admin = mk_user(Role.TENANT_ADMIN)
    assert authorize(admin, Action.APPROVE, res(ResourceType.EXTENSION, squad=None)).allowed


def test_audit_read_requires_admin():
    eng = mk_user(Role.ENGINEER, squads=["sq-a1"])
    assert not authorize(eng, Action.READ, res(ResourceType.AUDIT, squad=None)).allowed
    admin = mk_user(Role.TENANT_ADMIN)
    assert authorize(admin, Action.READ, res(ResourceType.AUDIT, squad=None)).allowed
