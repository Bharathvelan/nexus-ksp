#!/bin/bash
# Wait for Kafka to be ready
echo "Waiting for Kafka to be ready..."
sleep 20

# Create topics
kafka-topics --create --if-not-exists --bootstrap-server broker:29092 --partitions 12 --replication-factor 1 --topic nexus.fir.events --config retention.ms=604800000
kafka-topics --create --if-not-exists --bootstrap-server broker:29092 --partitions 6 --replication-factor 1 --topic nexus.accused.events --config retention.ms=604800000
kafka-topics --create --if-not-exists --bootstrap-server broker:29092 --partitions 6 --replication-factor 1 --topic nexus.alerts --config retention.ms=2592000000
kafka-topics --create --if-not-exists --bootstrap-server broker:29092 --partitions 6 --replication-factor 1 --topic nexus.audit --config cleanup.policy=compact
kafka-topics --create --if-not-exists --bootstrap-server broker:29092 --partitions 3 --replication-factor 1 --topic nexus.embeddings.queue --config retention.ms=86400000

echo "Topics created successfully."
