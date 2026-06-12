# NEXUS-KSP (Karnataka State Police AI Intelligence System)

NEXUS-KSP is a next-generation predictive policing and intelligence orchestration platform designed specifically for the Karnataka State Police. It unifies voice capture, natural language processing, financial graph analysis, and cryptographic auditing into a single seamless microservice architecture.

## 🚀 Architecture
The system is built on a highly resilient, polyglot microservice stack:

- **Web Dashboard**: Next.js 14 (App Router) with custom React components.
- **Field Mobile App**: React Native (Expo) for field officer intelligence gathering.
- **Core AI Engines**: Python (FastAPI)
  - `llm-orchestrator`: Routes intelligence to Language Models for translation and case extraction.
  - `pattern-engine`: Evaluates real-time recidivism forecasting and spatial anomaly detection.
  - `graph-service`: Traces financial money trails and maps suspect associations.
  - `profiling-service`: Entity and behavioral profiling logic.
- **Support Microservices**: Go (Fiber)
  - `audit-logger`: Tamper-proof audit trails validated cryptographically (HMAC SHA-256).
  - `alert-service`: High-throughput WebSocket alert rule evaluation.
- **Utility**: Node.js `report-exporter`.

## 📦 Deployment (Docker)
The entire platform is containerized for a smooth, single-command startup.

```bash
# From the project root
docker compose build
docker compose up -d
```

## 📱 Field Officer App
The React Native app allows field officers to capture voice notes (Kannada/English) and lookup active FIRs securely.

```bash
cd apps/mobile
npm install
npm start
```
*Use the Expo Go app on iOS or Android to scan the generated QR code.*

## 🛡️ Security & Auditing
A core feature of NEXUS is its immutable ledger. All automated actions, rule adjustments, and LLM extractions are recorded by the `audit-logger`. The Dashboard UI enforces real-time integrity checks, verifying the SHA-256 hash against the payload. If any database record is altered directly, the system immediately flags a **TAMPERED** status.
