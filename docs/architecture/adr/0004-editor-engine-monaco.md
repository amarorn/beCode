# ADR-0004 — Reuso de editor engine (Monaco / Code-OSS)

**Status:** Aceito
**Data:** 2026-04-18
**Decisores:** Arquitetura, IDE-UX
**Relacionado:** Task 1.1 (regra), Task 1.2, Épico 3 (IDE Shell)

## Contexto

Construir um editor engine próprio consumiria anos de engenharia para alcançar paridade com:
- Destaque de sintaxe / LSP / DAP.
- Performance em arquivos grandes.
- Ecossistema de linguagens.

A visão do produto (task 1.1) explicita "editor engine próprio fora do MVP".

## Decisão

Reutilizar **Monaco Editor** como engine primária na SPA. Considerar migrar para **Code-OSS** (base do VS Code) em Fase 2 caso a necessidade de extensibilidade avançada (ex.: plug-ins VSX) justifique.

Regras:

- Camada fina de adaptação acima do Monaco; nenhum comando de negócio acoplado a APIs internas da engine.
- Temas, command palette e painéis são componentes próprios, não forks do VS Code.
- Suporte a LSP via WebSocket através do Workspace Pod (language servers rodam no execution plane, ADR-0001).

## Consequências

**Positivas**
- Acelera entrega do MVP; paridade funcional mínima facilita adoção.
- Aproveita linguagem familiar aos engenheiros que hoje usam VS Code.

**Negativas**
- Dependência de uma engine mantida por terceiro; patches de segurança a acompanhar.
- Alguns recursos avançados (ex.: webviews isoladas) exigem trabalho extra.

**Abertos**
- Migração para Code-OSS em Fase 2 (extensões VSX).

## Alternativas consideradas

1. **CodeMirror 6.** Ótimo, mas ecossistema LSP/DAP inferior ao Monaco no caso de uso corporativo.
2. **Fork de VS Code web.** Mais poder, mas custo de manutenção de fork é alto demais para MVP.
