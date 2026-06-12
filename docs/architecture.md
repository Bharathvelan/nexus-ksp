# NEXUS-KSP System Architecture

NEXUS-KSP is a massive microservices-based intelligence platform for the Karnataka State Police.

## High-Level Architecture Diagram
```text
[ Investigators / Analysts ]
          │
          ▼
[ Next.js Frontend Web / Flutter Mobile ]
          │
          ▼
[ Kong API Gateway (Authentication via Keycloak) ]
          │
          ├──> [ LLM Orchestrator (FastAPI) ] ──> OpenAI/vLLM, IndicTrans2, Whisper
          │         │
          │         ├──> Queries -> PostgreSQL (Structured Data)
          │         ├──> Queries -> Neo4j (Graph Connections)
          │         └──> Queries -> Qdrant (Vector Embeddings)
          │
          ├──> [ Graph Service (FastAPI) ] ──> Neo4j (GDS algorithms)
          │
          ├──> [ Pattern Engine (FastAPI) ] ──> PostgreSQL, XGBoost, Scikit-learn
          │
          ├──> [ Profiling Service (FastAPI) ] ──> PostgreSQL, Qdrant
          │
          ├──> [ Alert Service (Go Fiber) ] <──> Kafka (nexus.fir.events)
          │         │
          │         └──> WebSockets -> Frontend
          │
          ├──> [ Audit Logger (Go) ] ──> PostgreSQL (audit_log table)
          │
          └──> [ Report Exporter (Node.js) ] ──> PDF Generation (Puppeteer)
```

## Core Technologies
- **Frontend**: Next.js 14, Tailwind CSS, Zustand, Deck.gl, Vis.js
- **Backend**: FastAPI (Python), Fiber (Go), Express (Node.js)
- **Data Layer**: PostgreSQL 16 (PostGIS, pg_trgm), Neo4j 5 (GDS), Qdrant
- **Event Streaming**: Kafka 7.5, Debezium CDC
- **AI/ML**: LangChain, OpenAI (stubbed/replaceable with vLLM), BGE-M3 Embeddings
- **Infrastructure**: Docker Compose, Kubernetes, Terraform
