###############################################################################
# NEXUS-KSP — Root Outputs
###############################################################################

# --- EKS ---
output "eks_cluster_endpoint" {
  description = "EKS cluster API endpoint"
  value       = module.eks.cluster_endpoint
}

output "eks_cluster_name" {
  description = "EKS cluster name"
  value       = module.eks.cluster_name
}

output "eks_cluster_ca_certificate" {
  description = "EKS cluster CA certificate (base64)"
  value       = module.eks.cluster_ca_certificate
  sensitive   = true
}

# --- RDS ---
output "rds_endpoint" {
  description = "RDS PostgreSQL endpoint"
  value       = module.rds.endpoint
}

output "rds_address" {
  description = "RDS hostname"
  value       = module.rds.address
}

# --- ElastiCache ---
output "redis_primary_endpoint" {
  description = "Redis primary endpoint"
  value       = module.elasticache.primary_endpoint
}

output "redis_reader_endpoint" {
  description = "Redis reader endpoint"
  value       = module.elasticache.reader_endpoint
}

# --- MSK ---
output "kafka_bootstrap_brokers_tls" {
  description = "Kafka TLS bootstrap brokers"
  value       = module.msk.bootstrap_brokers_tls
}

output "kafka_bootstrap_brokers_sasl" {
  description = "Kafka SASL bootstrap brokers"
  value       = module.msk.bootstrap_brokers_sasl_scram
}

# --- ECR ---
output "ecr_repository_urls" {
  description = "ECR repository URLs per service"
  value       = module.ecr.repository_urls
}

# --- KMS ---
output "kms_rds_key_arn" {
  description = "KMS key ARN for RDS"
  value       = module.kms.rds_key_arn
}

output "kms_s3_key_arn" {
  description = "KMS key ARN for S3"
  value       = module.kms.s3_key_arn
}

output "kms_eks_key_arn" {
  description = "KMS key ARN for EKS"
  value       = module.kms.eks_key_arn
}

# --- VPC ---
output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "private_subnet_ids" {
  description = "Private subnet IDs"
  value       = module.vpc.private_subnet_ids
}

output "public_subnet_ids" {
  description = "Public subnet IDs"
  value       = module.vpc.public_subnet_ids
}

# --- WAF ---
output "waf_web_acl_arn" {
  description = "WAF WebACL ARN"
  value       = module.waf.web_acl_arn
}

# --- S3 ---
output "s3_bucket_arns" {
  description = "S3 bucket ARNs"
  value       = module.s3.bucket_arns
}
