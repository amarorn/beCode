# ADR-0005 — Eventos de domínio via Pub/Sub com envelope comum

**Status:** Aceito
**Data:** 2026-04-18
**Decisores:** Arquitetura, SecPlat, SRE
**Relacionado:** Task 1.2, Épico 11 (Observabilidade / Auditoria)

## Contexto

Múltiplos serviços (Workspace, AI, Data, Identity, Extensions) precisam publicar fatos de domínio consumidos por: Audit Service, Billing (chargeback), dashboards, futuros automatismos.

Acoplar consumidores via chamadas HTTP síncronas criaria dependências circulares e aumentaria falhas em cascata.

## Decisão

Usar **GCP Pub/Sub** como barramento de eventos de domínio, com:

- Tópicos por contexto: `workspace-events`, `ai-events`, `policy-events`, `data-events`, `identity-events`, `extension-events`.
- Envelope padronizado (ver [1.2-convencoes-apis.md](../1.2-convencoes-apis.md) §2).
- Schema Registry com versionamento aditivo por minor; breaking bumpa `event_version`.
- `ordering_key = tenant_id` quando ordenação importar.
- Consumidores idempotentes por `event_id`.

Audit Service assina **todos** os tópicos como consumidor de cross-cutting.

## Consequências

**Positivas**
- Desacoplamento temporal e lógico entre produtores e consumidores.
- Replay possível para rebuild de projeções.
- Auditoria e chargeback escutam o mesmo canal.

**Negativas**
- Consistência eventual: consumidores devem tolerar out-of-order e duplicatas.
- Custo de operação/monitoria do barramento.

**Abertos**
- Política de DLQ e alertas por atraso (SRE, task 11.x).
- Padrão de retenção por tópico (default 7 dias, revisar por caso).

## Alternativas consideradas

1. **Kafka gerenciado.** Muito potente, custo e complexidade altos para MVP.
2. **Webhooks HTTP ponto-a-ponto.** Inviável para N consumidores; ausência de replay e ordering.
