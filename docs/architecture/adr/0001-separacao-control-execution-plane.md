# ADR-0001 — Separação entre control plane e execution plane

**Status:** Aceito
**Data:** 2026-04-18
**Decisores:** Arquitetura, Security, SRE
**Relacionado:** Task 1.2, Task 1.3, Task 5.1

## Contexto

A plataforma hospeda execução de código de usuários (terminal, kernels Python, dbt, queries) em ambiente corporativo multi-tenant. Misturar em um único plano a orquestração (identidade, policy, catálogo, AI Gateway) e a execução (pods que rodam código arbitrário) aumenta:

- Risco de escalada lateral cross-tenant.
- Surface area para supply chain / extensões maliciosas.
- Complexidade de patching (control plane precisaria do mesmo SLA de segurança que hosts de execução).

A visão do produto (task 1.1) já estabelece "separação control plane / execution plane" como regra inegociável.

## Decisão

Adotar **dois clusters Kubernetes distintos**: `control` e `execution`. O control plane hospeda todos os serviços de domínio, gateways, banco e filas. O execution plane hospeda **apenas** pods de workspace e seus sidecars de telemetria.

Regras:

- Nenhum serviço do control plane executa código do usuário.
- Apenas dois canais atravessam a fronteira: (a) Workspace Manager → API K8s de execução; (b) Terminal Proxy ↔ Pod via WebSocket, com Policy Engine inline.
- Egress do execution plane é restrito por allow-list (BigQuery, Databricks, Git, Registry, Secret Manager; LLMs somente via AI Gateway do control plane).

## Consequências

**Positivas**
- Isolamento forte de blast radius.
- Políticas de segurança e patching podem divergir entre planos.
- Permite dimensionar os planos de forma independente.

**Negativas / trade-offs**
- Custo operacional maior (dois clusters, dois conjuntos de nodepools).
- Latência levemente maior em chamadas cross-plane.
- Requer disciplina contínua para não acoplar serviços por conveniência.

**Abertos**
- Estratégia de network peering e DNS entre clusters (delegado à task 1.3).

## Alternativas consideradas

1. **Cluster único com namespaces isolados.** Menor custo, mas blast radius inaceitável para execução de código arbitrário em ambiente corporativo.
2. **VMs por usuário em vez de pods.** Isolamento ainda maior, mas custo e tempo de provisionamento incompatíveis com SLO p95 < 3 min.
