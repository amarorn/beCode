# Arquitetura — Épico 1 (Discovery & Arquitetura)

Artefatos de arquitetura do projeto **IDE Corporativa para Engenharia de Dados**.

## Task 1.2 — Arquitetura de referência (C4 + domínio)

| Arquivo | DoD atendido |
|---|---|
| [1.2-c4-contexto.md](1.2-c4-contexto.md) | C4 L1 publicado |
| [1.2-c4-containers.md](1.2-c4-containers.md) | C4 L2 publicado |
| [1.2-c4-componentes.md](1.2-c4-componentes.md) | C4 L3 publicado |
| [1.2-bounded-contexts.md](1.2-bounded-contexts.md) | Bounded contexts definidos |
| [1.2-fluxos-principais.md](1.2-fluxos-principais.md) | Fluxos principais descritos + threat modeling inicial |
| [1.2-mapa-servicos.md](1.2-mapa-servicos.md) | Mapa de serviços |
| [1.2-convencoes-apis.md](1.2-convencoes-apis.md) | Convenções de API, eventos e telemetria |

## Task 1.3 — Arquitetura de entrega e ambientes

| Arquivo | DoD atendido |
|---|---|
| [1.3-topologia-ambientes.md](1.3-topologia-ambientes.md) | Topologia por ambiente documentada |
| [1.3-estrategia-iac.md](1.3-estrategia-iac.md) | Estratégia IaC definida |
| [1.3-rollout-rollback.md](1.3-rollout-rollback.md) | Rollout/rollback definidos |
| [1.3-requisitos-rede.md](1.3-requisitos-rede.md) | Requisitos de rede documentados |

## ADRs

Catálogo completo em [`adr/`](adr/). Decisões aceitas:

| ID | Título |
|----|--------|
| [0001](adr/0001-separacao-control-execution-plane.md) | Separação entre control plane e execution plane |
| [0002](adr/0002-ai-gateway-multi-llm.md) | AI Gateway multi-LLM sem lock-in |
| [0003](adr/0003-registry-abstraction.md) | Abstração de registry de imagens/extensões |
| [0004](adr/0004-editor-engine-monaco.md) | Reuso de editor engine (Monaco/Code-OSS) |
| [0005](adr/0005-eventos-pubsub.md) | Eventos de domínio via Pub/Sub com envelope comum |
| [0006](adr/0006-telemetria-opentelemetry.md) | OpenTelemetry como padrão de telemetria |

## Status

- **Rascunho v1.0.0** — 2026-04-18.
- **Task 1.2 concluída** em nível de DoD; pendente review técnico com tech leads e threat modeling detalhado.
- **Task 1.3** permanece rascunho com premissas alinhadas a 1.2; revisar após review técnico.
- **Próximos passos:** agendar walkthrough com tech leads; conduzir threat modeling (STRIDE) sobre os fluxos críticos; validar dimensionamento com FinOps; revisar allowlists de egress com Security; destravar epic 2 (Identity & Tenant).
