# Architecture Decision Records (ADRs)

Cada decisão significativa de arquitetura é registrada como um ADR, seguindo o formato leve [Nygard](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions.html).

## Status possíveis

- `Proposto` — em discussão.
- `Aceito` — decisão corrente.
- `Obsoleto` — substituído por outro ADR (indicar qual).
- `Revogado` — cancelado.

## Catálogo

| ID | Título | Status | Relacionado |
|----|--------|--------|-------------|
| [0001](0001-separacao-control-execution-plane.md) | Separação entre control plane e execution plane | Aceito | Task 1.2, 1.3 |
| [0002](0002-ai-gateway-multi-llm.md) | AI Gateway multi-LLM sem lock-in | Aceito | Task 1.2, 7.x |
| [0003](0003-registry-abstraction.md) | Abstração de registry de imagens/extensões | Aceito | Task 1.2, 6.x |
| [0004](0004-editor-engine-monaco.md) | Reuso de editor engine (Monaco/Code-OSS) | Aceito | Task 1.1, 1.2, 3.x |
| [0005](0005-eventos-pubsub.md) | Eventos de domínio via Pub/Sub com envelope comum | Aceito | Task 1.2, 11.2 |
| [0006](0006-telemetria-opentelemetry.md) | OpenTelemetry como padrão de telemetria | Aceito | Task 1.2, 11.1 |

## Template

Usar [template.md](template.md) ao criar um novo ADR. Numerar sequencialmente com 4 dígitos.
