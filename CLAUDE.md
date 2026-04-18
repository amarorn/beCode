# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Corporate Data Engineering IDE ("IDE Corporativa para Engenharia de Dados") — an enterprise platform for data engineering teams. The project is currently in the **planning/pre-development phase** with no source code yet. All deliverables so far are backlog and architecture documentation.

## Repository Contents

- `backlog_ide_dados.md` — full backlog (38 tasks across 13 epics) with DoR/DoD and SpecDrive specs
- `backlog_ide_dados.csv` — same backlog in CSV format for spreadsheet import

## Architecture (Planned)

The system follows a multi-service architecture with these major domains:

- **IDE Shell & UX** — VS Code-like workbench with dark-mode-first design system, command palette, and extension support
- **Workspace & Runtime** — containerized workspace lifecycle management with templates
- **Identity & Access** — SSO/OIDC authentication, RBAC with tenant/squad scoping, multi-tenancy
- **AI Gateway** — multi-LLM orchestration with prompt policy enforcement, rate limiting, and cost attribution
- **Data Integrations** — BigQuery, Databricks, dbt/Dataform connectors with cost controls and data preview
- **Terminal & Policy Engine** — integrated terminal with deny-by-default command execution policies
- **Extension Catalog** — corporate extension marketplace with approval workflow
- **Observability** — OpenTelemetry tracing, immutable audit logs, product telemetry

Key architectural decisions: control plane separated from execution plane; no LLM or registry vendor lock-in; security-first with secret masking before persistence.

## Epic Dependency Order

Implementation follows this critical path:
1. Discovery & Architecture (1.1 → 1.2 → 1.3)
2. Identity & Tenant (2.1 → 2.2 → 2.3)
3. IDE Shell (3.1 → 3.2/3.3) and Workspaces (4.1 → 4.2 → 4.3) in parallel
4. Terminal & Policy (5.1 → 5.2), Extensions (6.1 → 6.2 → 6.3)
5. AI Gateway (7.1 → 7.2/7.3) then AI IDE Experience (8.1 → 8.2 → 8.3)
6. Data Integrations (9.1–9.4), Git & Templates (10.1–10.2)
7. Observability (11.1–11.3), Security (12.1–12.3), Delivery (13.1–13.3)

## Language & Conventions

- Documentation is written in **Brazilian Portuguese (pt-BR)**
- Each task uses the **SpecDrive** framework: Objetivo, Escopo, Entradas, Saídas, Interfaces, Regras, Observabilidade, Riscos, Testes
- Every task has explicit **Definition of Ready (DoR)** and **Definition of Done (DoD)**
