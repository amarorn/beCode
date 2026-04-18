# Spike: RBAC + Tenant/Squad Scoping (task 2.2)

Protótipo isolado para validar o design de autorização da IDE Corporativa.
**Não é produção** — não integra com Identity real (2.1), usa usuários mockados.

## Objetivos

- Validar matriz RBAC (papéis × permissões × recursos) com deny-by-default
- Validar isolamento multi-tenant e escopo por squad
- Validar formato de audit log para decisões de autorização
- Servir como base para DoR da task 2.2 e ADR futuro

## Estrutura

```
spikes/rbac/
├── app/
│   ├── models.py      # User, Role, Permission, Tenant, Squad, Resource
│   ├── policy.py      # Matriz RBAC + engine deny-by-default
│   ├── audit.py       # Audit log em memória
│   ├── deps.py        # FastAPI Depends para enforcement
│   └── main.py        # App FastAPI com rotas protegidas
└── tests/
    ├── test_policy.py
    ├── test_scoping.py
    └── test_api.py
```

## Papéis (hierarquia)

| Papel            | Escopo                         |
|------------------|--------------------------------|
| `platform_admin` | Cross-tenant (global)          |
| `tenant_admin`   | Todo o tenant                  |
| `squad_lead`     | Squads onde é lead             |
| `engineer`       | Squads onde é membro           |
| `viewer`         | Read-only dentro do squad      |

## Recursos × Ações

- `workspace`: `create`, `read`, `update`, `delete`, `start`, `stop`
- `extension`: `install`, `approve`, `publish`, `read`
- `model`: `invoke`, `configure`
- `integration`: `read`, `query`, `configure`
- `audit`: `read`
- `policy`: `read`, `update`

## Regras

- **Deny by default**: nenhuma permissão explícita ⇒ negado
- **Cross-tenant proibido** exceto para `platform_admin`
- **Squad scoping** aplicado a `engineer` e `viewer`
- Toda decisão gera entrada no audit log (negações + ações administrativas)

## Rodando

```bash
cd spikes/rbac
python -m venv .venv && source .venv/bin/activate
pip install -e '.[dev]'
pytest
uvicorn app.main:app --reload
```

## Escopo fora do spike

- Persistência (só memória)
- Integração real com Identity/SSO (mock de user)
- Cache de decisões
- UI de administração de policies
- Versionamento de policy
