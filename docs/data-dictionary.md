# NEXUS-KSP Data Dictionary

## PostgreSQL Tables

### `fir`
Stores all First Information Reports.
- `id` (UUID): Primary key.
- `fir_number` (VARCHAR): Unique official FIR number.
- `status` (VARCHAR): Current investigation status.
- `description_text` (TEXT): Full narrative of the incident (indexed in Qdrant).
- `geom` (Geometry): PostGIS point for spatial clustering.

### `accused`
Stores known offender profiles.
- `id` (UUID): Primary key.
- `name` (VARCHAR): Full name.
- `aadhaar_hash` (VARCHAR): Cryptographically hashed ID.
- `risk_score` (FLOAT): ML-computed risk out of 100.

## Neo4j Graph Nodes

### `(:Accused)`
- Represents an individual charged with a crime.
- Links to `(:Crime)` via `[:CHARGED_IN]`.

### `(:FinancialAccount)`
- Represents a bank account.
- Links to other accounts via `[:TRANSACTED_WITH]` to build AML trails.

## Qdrant Collections

### `fir_narratives` (1536 dims)
- Stores text embeddings of FIR descriptions for semantic similarity search.

### `accused_profiles` (1536 dims)
- Stores behavioral profile embeddings to match MOs.
