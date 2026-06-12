###############################################################################
# NEXUS-KSP — Root Variables
# All configurable values for the production deployment.
###############################################################################

# ---------------------------------------------------------------------------
# General
# ---------------------------------------------------------------------------
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-south-1"
}

variable "project" {
  description = "Project name (used as prefix for all resources)"
  type        = string
  default     = "nexus-ksp"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

# ---------------------------------------------------------------------------
# VPC
# ---------------------------------------------------------------------------
variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones"
  type        = list(string)
  default     = ["ap-south-1a", "ap-south-1b"]
}

variable "public_subnet_cidrs" {
  description = "Public subnet CIDR blocks"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "Private subnet CIDR blocks"
  type        = list(string)
  default     = ["10.0.10.0/24", "10.0.11.0/24"]
}

# ---------------------------------------------------------------------------
# EKS
# ---------------------------------------------------------------------------
variable "cluster_name" {
  description = "EKS cluster name"
  type        = string
  default     = "nexus-ksp-cluster"
}

variable "cluster_version" {
  description = "Kubernetes version"
  type        = string
  default     = "1.29"
}

variable "endpoint_public_access" {
  description = "Allow public access to EKS API"
  type        = bool
  default     = false
}

variable "ai_instance_types" {
  description = "AI inference node instance types"
  type        = list(string)
  default     = ["c5.2xlarge"]
}

# ---------------------------------------------------------------------------
# RDS
# ---------------------------------------------------------------------------
variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.r6g.large"
}

variable "db_allocated_storage" {
  description = "RDS initial storage (GB)"
  type        = number
  default     = 500
}

variable "db_max_allocated_storage" {
  description = "RDS max autoscaling storage (GB)"
  type        = number
  default     = 2000
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "nexus_ksp"
}

variable "db_username" {
  description = "Database master username"
  type        = string
  default     = "nexus_admin"
  sensitive   = true
}

variable "db_password" {
  description = "Database master password"
  type        = string
  sensitive   = true
}

# ---------------------------------------------------------------------------
# ElastiCache
# ---------------------------------------------------------------------------
variable "redis_node_type" {
  description = "Redis node type"
  type        = string
  default     = "cache.r6g.large"
}

# ---------------------------------------------------------------------------
# MSK
# ---------------------------------------------------------------------------
variable "kafka_password" {
  description = "Kafka SASL/SCRAM password"
  type        = string
  sensitive   = true
}

# ---------------------------------------------------------------------------
# Domain / Certificate
# ---------------------------------------------------------------------------
variable "domain_name" {
  description = "Production domain name"
  type        = string
  default     = "nexus-ksp.karnataka.gov.in"
}

variable "acm_certificate_arn" {
  description = "ACM certificate ARN for TLS termination"
  type        = string
  default     = ""
}

# ---------------------------------------------------------------------------
# GitHub OIDC (for CI/CD)
# ---------------------------------------------------------------------------
variable "github_org" {
  description = "GitHub organization name"
  type        = string
  default     = "karnataka-police"
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
  default     = "nexus-ksp"
}
