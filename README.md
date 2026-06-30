# IASA — Intelligent API Security Assessment

> Automated API security testing and vulnerability detection platform.
> "Trivy for APIs" — scan REST APIs against OWASP API Security Top 10 in minutes.

[![CI](https://github.com/your-org/iasa/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/iasa/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-violet.svg)](LICENSE)
[![Bun](https://img.shields.io/badge/runtime-Bun-f472b6?logo=bun)](https://bun.sh)

---

## Quick Start

```bash
git clone https://github.com/your-org/iasa
cd iasa
cp .env.example .env
bun i
docker compose up -d
bun run db:migrate
bun run db:seed
bun dev
```

Open **http://localhost:3000** and sign in:

| Role     | Email                  | Password      |
|----------|------------------------|---------------|
| Admin    | admin@iasa.local       | Admin@123!    |
| Analyst  | analyst@iasa.local     | Analyst@123!  |

---

## What It Does

IASA automatically assesses REST API security by:

1. **Parsing** OpenAPI/Swagger specifications (URL or file upload)
2. **Discovering** all endpoints, methods, parameters, and schemas
3. **Running** 10 OWASP API Security Top 10 plugin checks
4. **Analyzing** results with AI (OpenAI / Amazon Bedrock)
5. **Generating** professional reports in HTML, JSON, SARIF, Markdown

---

## OWASP API Security Top 10 Coverage

| ID         | Category                                | Plugin                            |
|------------|-----------------------------------------|-----------------------------------|
| API1:2023  | Broken Object Level Authorization       | `bola`                            |
| API2:2023  | Broken Authentication                   | `broken-auth` + `jwt-analysis`    |
| API3:2023  | Broken Object Property Level Auth       | `mass-assignment` + `sensitive-data` |
| API4:2023  | Unrestricted Resource Consumption       | `rate-limit`                      |
| API5:2023  | Broken Function Level Authorization     | `bfla`                            |
| API7:2023  | Server Side Request Forgery             | `ssrf`                            |
| API8:2023  | Security Misconfiguration               | `cors` + `security-headers`       |

---

## Architecture

```
iasa/
├── apps/
│   ├── api/                    # NestJS backend (Port 4000)
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/           # JWT authentication
│   │   │   │   ├── projects/       # Project + OpenAPI management
│   │   │   │   ├── assessments/    # Assessment orchestration + SSE
│   │   │   │   ├── findings/       # Vulnerability findings
│   │   │   │   ├── reports/        # HTML/JSON/SARIF/Markdown reports
│   │   │   │   └── scanner/        # Security scanner engine (BullMQ)
│   │   │   │       └── plugins/
│   │   │   │           ├── authentication/  # Broken Auth (API2)
│   │   │   │           ├── authorization/   # BOLA (API1) + BFLA (API5)
│   │   │   │           ├── jwt/             # JWT Analysis
│   │   │   │           ├── rate-limit/      # Rate Limiting (API4)
│   │   │   │           ├── cors/            # CORS Analysis (API8)
│   │   │   │           ├── headers/         # Security Headers (API8)
│   │   │   │           ├── sensitive-data/  # Data Exposure (API3)
│   │   │   │           ├── mass-assignment/ # Mass Assignment (API3)
│   │   │   │           ├── ssrf/            # SSRF (API7)
│   │   │   │           └── ai-analysis/     # OpenAI enrichment
│   │   │   └── prisma/          # Prisma ORM service
│   │   └── prisma/
│   │       └── schema.prisma    # Complete database schema
│   └── web/                     # Next.js 15 frontend (Port 3000)
│       └── src/
│           ├── app/
│           │   ├── (auth)/          # Login, Register
│           │   └── (dashboard)/     # Dashboard, Projects, Assessments, Findings, Reports
│           ├── components/          # Sidebar, badges, charts
│           ├── lib/                 # API client, utilities
│           └── types/               # Shared TypeScript types
├── docker-compose.yml           # Full stack + observability profiles
├── .env.example                 # All environment variables documented
└── .github/
    └── workflows/
        ├── ci.yml               # Lint, test, build Docker images
        └── security.yml         # Security gate + SARIF to GitHub Security
```

---

## Tech Stack

| Layer       | Technology                    |
|-------------|-------------------------------|
| Runtime     | **Bun 1.x**                   |
| Frontend    | Next.js 15, TypeScript, React 19 |
| UI          | Tailwind CSS, Shadcn/UI, Recharts |
| Backend     | NestJS 10, TypeScript         |
| Database    | PostgreSQL 16 + Prisma ORM    |
| Queue       | Redis 7 + BullMQ              |
| Auth        | JWT (HS256), Passport.js      |
| AI Analysis | OpenAI GPT-4o-mini            |
| Container   | Docker Compose                |
| CI/CD       | GitHub Actions                |

---

## Environment Variables

Copy `.env.example` to `.env`:

```bash
# Required
DATABASE_URL=postgresql://iasa:password@localhost:5432/iasa
REDIS_URL=redis://:password@localhost:6379
JWT_SECRET=your-32-char-minimum-secret-here
ENCRYPTION_KEY=your-32-char-encryption-key-here

# Optional — enables AI-powered vulnerability analysis
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

---

## Development

```bash
bun i                     # Install all dependencies
docker compose up -d      # Start PostgreSQL + Redis
bun run db:migrate        # Apply database migrations
bun run db:seed           # Create demo users and project
bun dev                   # Start API (4000) + Web (3000)

# Individual
bun dev:api               # NestJS API only
bun dev:web               # Next.js Web only
bun run db:studio         # Prisma Studio UI
```

---

## CI/CD Security Gate

Block PRs with security issues using IASA GitHub Actions:

```yaml
- name: IASA API Security Gate
  uses: your-org/iasa/.github/workflows/security.yml@main
  with:
    target_url: https://api.yourapp.com
    fail_on: HIGH          # CRITICAL | HIGH | MEDIUM
  secrets:
    IASA_API_KEY: ${{ secrets.IASA_API_KEY }}
```

Results are uploaded to **GitHub Security** as SARIF.

---

## Adding Custom Plugins

```typescript
// apps/api/src/modules/scanner/plugins/my-check/my-check.plugin.ts
import { BasePlugin, ScanContext, PluginResult } from '../../types/scanner.types';

export class MyCheckPlugin extends BasePlugin {
  readonly id = 'my-custom-check';
  readonly name = 'My Security Check';
  readonly description = 'Description of what this checks';
  readonly owaspCategories = ['API8:2023'];

  async run(context: ScanContext): Promise<PluginResult> {
    const findings = [];
    // Implement detection logic using context.endpoints, context.auth, context.baseUrl
    return { pluginId: this.id, pluginName: this.name, findings, scanDuration: 0, endpointsTested: 0 };
  }
}
```

Register it in `scanner.service.ts` — it runs automatically in every assessment.

---

## Security Notice

> **IASA is designed for authorized security testing only.**
> Only use it against APIs you own or have explicit written permission to test.
> Unauthorized API testing may violate computer fraud laws and regulations.

---

*IASA v0.1.0 — Intelligent System for API Security Assessment Based on Automated Testing and Vulnerability Detection*
*University Cybersecurity Capstone Project*