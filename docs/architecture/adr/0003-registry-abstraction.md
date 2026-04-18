# ADR-0003 — Abstração de registry de imagens/extensões

**Status:** Aceito
**Data:** 2026-04-18
**Decisores:** Arquitetura, DX, Security
**Relacionado:** Task 1.2, Épico 6 (Extension Catalog), Épico 4 (Workspaces)

## Contexto

Imagens de workspace e artefatos de extensão são puxados de um registry. Acoplar o código diretamente ao Artifact Registry da GCP dificultaria:

- Eventual multi-cloud ou mudança de provedor.
- Uso de registries self-hosted (Harbor) em ambientes soberanos.
- Troca de estratégia de distribuição (ex.: OCI artifacts para extensões).

A visão (task 1.1) estabelece "sem lock-in de registry".

## Decisão

Definir uma interface interna `ArtifactRegistry` com operações:

```
ArtifactRegistry {
  resolveDigest(ref) -> Digest
  pull(digest) -> Artifact
  verifySignature(digest) -> SignatureResult
  listTags(repo) -> []Tag
}
```

Implementações iniciais:
- `ArtifactRegistryGCP` (primária no MVP).
- `OCIGeneric` (fallback para qualquer registry OCI-compliant).

**Todas as referências a artefatos no domínio são por digest**, nunca por tag mutável.
**Assinatura é obrigatória** (cosign/Sigstore) para imagens base e extensões publicadas.

## Consequências

**Positivas**
- Troca/adição de registry sem mudar serviços.
- Reproducibilidade via digest.
- Base para política de supply chain (SBOM, atestação).

**Negativas**
- Trabalho inicial para cobrir features avançadas (ex.: replicação, quota) através da abstração.
- Risco de "menor denominador comum" se abstração for mal desenhada.

**Abertos**
- Política de rotação de chaves de assinatura (Security).
- Estratégia de cache local de camadas no execution plane.

## Alternativas consideradas

1. **Uso direto do Artifact Registry GCP.** Simples, mas contraria a regra arquitetural.
2. **Padronizar somente OCI (sem abstração).** Não resolve o problema de autenticação e quotas específicas por provider.
