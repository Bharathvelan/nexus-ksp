# NEXUS-KSP AWS EKS Deployment Guide

## Prerequisites
- Terraform CLI
- AWS CLI configured with admin rights
- kubectl

## Steps

1. **Provision Infrastructure**
   Navigate to `infra/terraform/` and run:
   ```bash
   terraform init
   terraform apply -auto-approve
   ```
   This provisions the EKS cluster, managed RDS (PostgreSQL), and Managed Kafka (MSK).

2. **Configure kubectl**
   ```bash
   aws eks update-kubeconfig --region ap-south-1 --name nexus-ksp-prod
   ```

3. **Deploy Kubernetes Manifests**
   Navigate to `infra/k8s/` and apply namespaces, configmaps, and secrets:
   ```bash
   kubectl apply -f namespace.yaml
   kubectl apply -f secrets.yaml
   ```

4. **Deploy Data Stores**
   Apply stateful sets for Neo4j and Qdrant (or use managed services if preferred).
   ```bash
   kubectl apply -f neo4j.yaml
   kubectl apply -f qdrant.yaml
   ```

5. **Deploy Microservices**
   ```bash
   kubectl apply -f llm-orchestrator.yaml
   kubectl apply -f graph-service.yaml
   ...
   ```

6. **Verify**
   Check that Kong Ingress Controller is routing traffic and all pods are `Running`.
