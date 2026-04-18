# ADR-0006 — OpenTelemetry como padrão de telemetria

**Status:** Aceito
**Data:** 2026-04-18
**Decisores:** Arquitetura, SRE, SecPlat
**Relacionado:** Task 1.2, Épico 11 (Observabilidade)

## Contexto

A plataforma exige instrumentação consistente de traces, logs e métricas entre linguagens (Go, Node, Python) e serviços. Acoplar a um SDK proprietário (Datadog, New Relic) resultaria em lock-in e dificultaria migração de backend de observabilidade.

## Decisão

Adotar **OpenTelemetry** como padrão único de instrumentação em todos os serviços.

- Propagação W3C `traceparent` + `baggage`.
- **OTel Collector** como hub interno; sinks configuráveis (Cloud Trace, Cloud Logging, Grafana/Tempo, Prometheus).
- Atributos obrigatórios: `tenant.id`, `squad.id`, `user.id`, `trace_id`, `span_id`.
- Atributos de domínio específicos: `policy.id`, `policy.decision`, `ai.provider`, `ai.model`, `ai.tokens.in`, `ai.tokens.out`.
- Logs via OTel Logs API em formato JSON estruturado.
- Métricas expostas em convenção `<service>_<objeto>_<unidade>`.
- Proibido logar: prompts brutos, conteúdo de queries, valores de secrets.

Auditoria é canal separado (Pub/Sub → GCS Bucket Lock; ver ADR-0005 e task 11.2), não OTel.

## Consequências

**Positivas**
- Backend de observabilidade intercambiável.
- Trace distribuído consistente cross-service.
- Padrão aberto, comunidade ativa, bindings para todas as linguagens do stack.

**Negativas**
- OTel Collector é peça adicional a operar.
- Alguns SDKs (ex.: Logs) ainda maturando por linguagem.

**Abertos**
- Volumes esperados para dimensionar collector (FinOps).
- Amostragem: head vs tail sampling (SRE).

## Alternativas consideradas

1. **SDK proprietário único.** Mais rápido inicialmente, gera lock-in contra a regra da visão.
2. **Formatos heterogêneos por serviço.** Impede correlação e padroniza dívida técnica.
