# CLAUDE.md

## Project Overview

Dify (v1.11.1) is an open-source platform for developing LLM applications with an intuitive interface combining agentic AI workflows, RAG pipelines, agent capabilities, model management, and a plugin system supporting 50+ LLM providers.

The codebase is split into three main parts:

- **Backend API** (`/api`): Python 3.11+ Flask application using Domain-Driven Design and Clean Architecture
- **Frontend Web** (`/web`): Next.js 15 application with TypeScript 5.9 and React 19
- **Docker deployment** (`/docker`): Containerized deployment with PostgreSQL, Redis, Weaviate, Nginx, and plugin daemon

## Backend (API)

### Tech Stack

- **Framework**: Flask 3.1 with Gevent, Gunicorn
- **ORM**: SQLAlchemy 2.0 with Flask-SQLAlchemy
- **Task Queue**: Celery 5.5 with Redis broker
- **Database**: PostgreSQL (primary), MySQL supported
- **Type Checking**: basedpyright (strict mode)
- **Linting**: ruff (format + check), import-linter
- **Package Manager**: uv
- **Validation**: Pydantic 2.11

### Directory Layout

```
api/
├── app.py / app_factory.py     # Flask app entry point and factory
├── celery_entrypoint.py        # Celery worker entry
├── core/                       # Domain logic (DDD core layer)
│   ├── agent/                  # Agent execution engine
│   ├── app/                    # Application orchestration
│   ├── model_runtime/          # LLM provider runtime (50+ providers)
│   ├── plugin/                 # Plugin system with daemon
│   ├── rag/                    # RAG pipeline (extract → split → embed → index → retrieve → rerank)
│   ├── tools/                  # Tool system (builtin, custom, MCP, plugin, workflow-as-tool)
│   ├── workflow/               # Workflow engine
│   │   ├── graph_engine/       # Execution engine with layered architecture
│   │   ├── nodes/              # 28 node types (llm, code, http_request, knowledge_retrieval, etc.)
│   │   ├── graph/              # Graph structure and traversal
│   │   ├── runtime/            # Runtime state management
│   │   └── entities/           # Workflow domain entities
│   ├── moderation/             # Content moderation
│   ├── ops/                    # Observability integrations
│   └── provider_manager.py     # LLM provider orchestration
├── controllers/                # HTTP endpoint layer
│   ├── console/                # Console API (app/, auth/, datasets/, workspace/, etc.)
│   ├── service_api/            # External service API
│   ├── inner_api/              # Internal API
│   ├── web/                    # Web-facing API
│   └── files/                  # File handling
├── services/                   # Business logic layer (~57 service files)
├── models/                     # SQLAlchemy ORM models
├── repositories/               # Data access abstractions
├── migrations/                 # Alembic DB migrations
├── tasks/                      # Celery async tasks (~40 task files)
├── extensions/                 # Flask extensions (database, redis, celery, otel, storage)
├── configs/                    # Configuration (app, deploy, middleware, feature flags, observability)
├── constants/                  # Constants and enums
├── libs/                       # Internal utility libraries
├── schedule/                   # Scheduled jobs (APScheduler)
└── tests/
    ├── unit_tests/             # Unit tests (run locally)
    ├── integration_tests/      # Integration tests (CI only)
    └── fixtures/               # Shared test fixtures
```

### Architecture Enforcement

Import boundaries are enforced via `.importlinter` with contracts that ensure:
- Workflow engine follows strict layered architecture: `graph_engine → nodes → runtime → entities`
- Graph engine internal layers: `orchestration → command_processing → event_management → error_handler → graph_traversal → worker_management → domain`
- Domain model isolation: domain layer cannot import implementation details
- Command channel independence: in-memory and Redis channels are independent

### Backend Commands

```bash
# All commands use uv to run in the api project context
uv run --project api <command>

# Development setup
make dev-setup          # Full setup: docker middleware + web + api
make prepare-api        # Install deps, run DB migrations

# Code quality (REQUIRED before submission)
make lint               # ruff format + ruff check --fix + import-linter
make type-check         # basedpyright strict mode
make test               # Unit tests via pytest

# Individual commands
make format             # ruff format only
make check              # ruff check only

# Database migrations
uv run --project api flask db upgrade    # Apply migrations
```

### Backend Testing

- **Runner**: pytest 8.3 with pytest-cov, pytest-mock
- **Unit tests**: `api/tests/unit_tests/` — run locally, required before submission
- **Integration tests**: `api/tests/integration_tests/` — CI-only, not expected locally
- **Test env**: `pytest.ini` sets `MOCK_SWITCH=true` and provides mock API keys
- **Pattern**: Arrange-Act-Assert structure
- **Run**: `uv run --project api --dev dev/pytest/pytest_unit_tests.sh`

## Frontend (Web)

### Tech Stack

- **Framework**: Next.js 15.5 with App Router and Turbopack
- **Language**: TypeScript 5.9 (strict), React 19.2
- **Package Manager**: pnpm 10.25 (enforced via `preinstall` script)
- **Node**: >=22.11.0
- **State**: Zustand 5, TanStack React Query 5, SWR
- **Styling**: Tailwind CSS 3.4
- **UI**: Headless UI, Heroicons, Remixicon
- **Editors**: Monaco Editor, Lexical
- **Workflow**: React Flow for visual workflow editor
- **Charts**: ECharts
- **Testing**: Jest 29, React Testing Library
- **Linting**: ESLint 9 + Oxlint
- **Type Check**: tsgo (native TypeScript checker)

### Directory Layout

```
web/
├── app/                        # Next.js App Router
│   ├── (commonLayout)/         # Main app layout group
│   │   ├── apps/               # App management pages
│   │   ├── datasets/           # Dataset management
│   │   ├── plugins/            # Plugin marketplace
│   │   ├── tools/              # Tool management
│   │   └── explore/            # Explore/discover
│   ├── (shareLayout)/          # Public sharing layout
│   │   ├── chat/               # Shared chat interface
│   │   ├── workflow/           # Shared workflow
│   │   └── chatbot/            # Chatbot embed
│   ├── account/                # Account settings
│   ├── signin/ & signup/       # Authentication
│   ├── install/                # Initial setup
│   └── components/             # Shared components
│       ├── base/               # Base UI primitives
│       ├── workflow/           # Workflow editor components
│       ├── datasets/           # Dataset UI
│       ├── app/                # App-specific components
│       ├── tools/              # Tool components
│       ├── plugins/            # Plugin components
│       ├── header/             # Navigation header
│       └── share/              # Sharing components
├── i18n/                       # 22 languages
│   ├── en-US/                  # English (source of truth, ~20 namespace files)
│   ├── zh-Hans/                # Chinese Simplified
│   └── ...                     # 20 other languages
├── service/                    # API client layer
│   ├── base.ts                 # Base HTTP service
│   └── modules/                # Feature-specific API clients
├── hooks/                      # Custom React hooks
├── utils/                      # Utility functions
├── types/                      # TypeScript type definitions
├── models/                     # Frontend data models
├── context/                    # React context providers
├── testing/                    # Test utilities and guide
└── __tests__/                  # Test files
```

### Frontend Commands

```bash
cd web

# Development
pnpm install            # Install dependencies
pnpm dev                # Dev server with Turbopack + inspector

# Code quality (REQUIRED before submission)
pnpm lint:fix           # Oxlint + ESLint with auto-fix
pnpm type-check:tsgo    # Type checking with native TS checker
pnpm test               # Jest test suite

# Other
pnpm build              # Production build
pnpm storybook          # Component development (port 6006)
pnpm check-i18n         # Validate i18n completeness
pnpm knip               # Dead code detection
```

### Internationalization

- All user-facing strings go in `web/i18n/en-US/` namespace files
- Never hardcode display text in components
- 22 languages supported; English is the source of truth
- Run `pnpm check-i18n` to validate translations
- Run `pnpm auto-gen-i18n` to auto-generate missing translations

## Docker Deployment

```
docker/
├── docker-compose.yaml              # Full production stack
├── docker-compose.middleware.yaml   # Middleware-only (for dev)
├── .env.example                     # Configuration (~51KB, all options)
├── middleware.env.example           # Middleware config
├── nginx/                           # Reverse proxy config
├── ssrf_proxy/                      # SSRF protection proxy
└── volumes/                         # Persistent data (db, redis, weaviate, plugin_daemon)
```

**Core services**: API server, Web server, Celery worker, PostgreSQL, Redis, Weaviate (vector DB), Nginx, Plugin daemon, SSRF proxy

## Quality Gates (Pre-Submission Checklist)

### Backend — all must pass:
1. `make lint` — ruff format + ruff check + import-linter
2. `make type-check` — basedpyright strict
3. `make test` — pytest unit tests

### Frontend — all must pass:
1. `pnpm lint:fix` — oxlint + eslint
2. `pnpm type-check:tsgo` — TypeScript type check
3. `pnpm test` — Jest tests

## Coding Conventions

### Python
- Strong typing everywhere; avoid `Any`, prefer explicit type annotations
- Type hints on all function signatures and class attributes
- Implement `__repr__` / `__str__` where meaningful
- Domain-specific exceptions at the correct architectural layer
- DDD and Clean Architecture: controllers → services → core logic → models
- Dependencies injected through constructors
- Async work goes through Celery tasks (never block the request thread)
- New dependencies in `pyproject.toml` in alphabetical order within the appropriate group

### TypeScript
- Strict mode; avoid `any` types
- ESLint + Oxlint rules enforced
- All user-facing text through i18n (`en-US/` namespace files)
- React components use functional style with hooks
- State management via Zustand stores and React Query

### General
- Follow TDD: red → green → refactor
- Write self-documenting code; comments only for intent, not what
- Prefer editing existing files over creating new ones
- Keep changes minimal and focused; no over-engineering
- No unnecessary abstractions for one-time operations

## Key Architectural Patterns

- **Workflow Engine**: Graph-based execution with 28 node types, layered internal architecture enforced by import-linter
- **RAG Pipeline**: Modular pipeline — extract → clean → split → embed → index → retrieve → rerank
- **Plugin System**: Separate FastAPI daemon process; plugins communicate via API
- **Model Runtime**: Provider-based abstraction over 50+ LLM providers
- **Tool System**: Unified interface for builtin, custom, MCP protocol, plugin, and workflow-as-tool
- **Observability**: OpenTelemetry instrumentation for Flask, Celery, Redis, SQLAlchemy, httpx
