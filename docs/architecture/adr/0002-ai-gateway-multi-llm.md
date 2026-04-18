# ADR-0002 — AI Gateway multi-LLM sem lock-in

**Status:** Aceito
**Data:** 2026-04-18
**Decisores:** Arquitetura, AI Platform, Security, FinOps
**Relacionado:** Task 1.1, Task 1.2, Épico 7 (AI Gateway), Épico 8 (AI IDE Experience)

## Contexto

A plataforma precisa oferecer IA contextual governada com:
- Mascaramento de PII/segredos antes do envio a provedores externos.
- Atribuição de custo por tenant/squad.
- Rate limiting hierárquico.
- Auditoria de prompts (hash) e respostas (tokens/custo).
- Liberdade de escolher, combinar ou migrar entre provedores (Anthropic, OpenAI, Vertex AI, Bedrock).

Acoplar código do cliente diretamente a SDKs de provedores leva a lock-in e impede aplicar política centralizada.

## Decisão

Todo acesso a LLM passa por um **AI Gateway** interno que:

1. Expõe uma interface provider-agnostic (`complete`, `embed`, `stream`).
2. Encadeia: Auth → Quota → Prompt Policy → Masker → Cache → Router → Provider → Sanitizer → Cost Tracker → Event Publisher.
3. Enxerga provedores via **adaptadores plugáveis**, selecionados por roteamento (tenant default + override por chamada).
4. Registra `ai.completed` no barramento para chargeback.

## Consequências

**Positivas**
- Política de mascaramento, quota e custo aplicada em um ponto único.
- Provedor pode ser trocado sem mudar o SPA ou serviços consumidores.
- Observabilidade e auditoria consistentes.

**Negativas / trade-offs**
- Latência adicional (um hop).
- Features específicas de provedor (ex.: prompt caching do Anthropic, thinking, batching) exigem mapeamento explícito no adaptador, com risco de perder diferenciais.
- Complexidade do gateway cresce com o tempo.

**Abertos**
- Estratégia de streaming end-to-end com mascaramento (cada delta precisa passar pelo Sanitizer).
- Política de fallback cross-provider em caso de falha.

## Alternativas consideradas

1. **SDK direto no backend.** Mais simples, mas impossibilita política central e gera lock-in.
2. **Proxy HTTP transparente (ex.: LiteLLM).** Não suporta nativamente mascaramento e cost tracking com granularidade de squad; manter responsabilidade interna.
