#!/bin/bash
echo "============================================="
echo " NEXUS-KSP - System Startup Script"
echo "============================================="

# 1. Check Docker
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is not installed. Please install Docker and try again."
    exit 1
fi

# 2. Check/Create .env
if [ ! -f ".env" ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
fi

# 3. Start Infrastructure
echo "Starting infrastructure containers..."
docker-compose up -d postgres neo4j redis qdrant zookeeper broker keycloak

# 4. Wait for health
echo "Waiting for services to become healthy..."
sleep 15 # Give it some initial time
docker-compose ps

# 5. Run Database Migrations (Simulated via script for now, or Flyway container)
echo "Running PostgreSQL migrations..."
# docker run --rm -v $(pwd)/data/migrations:/flyway/sql flyway/flyway ...

# 6. Run Neo4j seeds
echo "Running Neo4j Graph Seeds..."
# cat ./data/graph-seeds/schema.cypher | docker exec -i nexus-neo4j cypher-shell -u neo4j -p nexus_secure_pass

# 7. Generate Mock Data
echo "Generating and Loading Mock Data..."
# python3 ./data/mock-data/generator.py

# 8. Start Services
echo "Starting Microservices and Frontend..."
# In a real environment, we would build and start them here
echo "Running: turbo run dev"

echo "============================================="
echo " NEXUS-KSP IS RUNNING"
echo "============================================="
echo "Frontend Dashboard:  http://localhost:3000"
echo "Keycloak Admin:      http://localhost:8080 (admin/admin)"
echo "Neo4j Browser:       http://localhost:7474"
echo ""
echo "Test Accounts:"
echo "- Investigator: demo@ksp.gov.in / Demo@1234"
echo "- Supervisor:   super@ksp.gov.in / Super@1234"
echo "============================================="
