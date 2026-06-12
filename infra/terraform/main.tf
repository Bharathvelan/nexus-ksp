###############################################################################
# NEXUS-KSP — Root Main Configuration
# Wires all modules together for production deployment.
###############################################################################

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

locals {
  common_tags = {
    Project     = var.project
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

# ═══════════════════════════════════════════════════════════════════════════
# KMS — Must be created first (other modules depend on keys)
# ═══════════════════════════════════════════════════════════════════════════
module "kms" {
  source  = "./modules/kms"
  project = var.project
  tags    = local.common_tags
}

# ═══════════════════════════════════════════════════════════════════════════
# VPC
# ═══════════════════════════════════════════════════════════════════════════
module "vpc" {
  source = "./modules/vpc"

  project              = var.project
  vpc_cidr             = var.vpc_cidr
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  availability_zones   = var.availability_zones
  cluster_name         = var.cluster_name
  tags                 = local.common_tags
}

# ═══════════════════════════════════════════════════════════════════════════
# EKS
# ═══════════════════════════════════════════════════════════════════════════
module "eks" {
  source = "./modules/eks"

  project                = var.project
  cluster_name           = var.cluster_name
  cluster_version        = var.cluster_version
  vpc_id                 = module.vpc.vpc_id
  private_subnet_ids     = module.vpc.private_subnet_ids
  public_subnet_ids      = module.vpc.public_subnet_ids
  endpoint_public_access = var.endpoint_public_access
  kms_key_arn            = module.kms.eks_key_arn
  ai_instance_types      = var.ai_instance_types
  tags                   = local.common_tags
}

# ═══════════════════════════════════════════════════════════════════════════
# RDS (PostgreSQL 16)
# ═══════════════════════════════════════════════════════════════════════════
module "rds" {
  source = "./modules/rds"

  project                    = var.project
  vpc_id                     = module.vpc.vpc_id
  private_subnet_ids         = module.vpc.private_subnet_ids
  eks_node_security_group_id = module.eks.node_security_group_id
  instance_class             = var.db_instance_class
  allocated_storage          = var.db_allocated_storage
  max_allocated_storage      = var.db_max_allocated_storage
  db_name                    = var.db_name
  db_username                = var.db_username
  db_password                = var.db_password
  kms_key_arn                = module.kms.rds_key_arn
  tags                       = local.common_tags
}

# ═══════════════════════════════════════════════════════════════════════════
# ElastiCache (Redis 7)
# ═══════════════════════════════════════════════════════════════════════════
module "elasticache" {
  source = "./modules/elasticache"

  project                    = var.project
  vpc_id                     = module.vpc.vpc_id
  private_subnet_ids         = module.vpc.private_subnet_ids
  eks_node_security_group_id = module.eks.node_security_group_id
  node_type                  = var.redis_node_type
  kms_key_arn                = module.kms.rds_key_arn
  tags                       = local.common_tags
}

# ═══════════════════════════════════════════════════════════════════════════
# MSK (Managed Kafka)
# ═══════════════════════════════════════════════════════════════════════════
module "msk" {
  source = "./modules/msk"

  project                    = var.project
  vpc_id                     = module.vpc.vpc_id
  private_subnet_ids         = module.vpc.private_subnet_ids
  eks_node_security_group_id = module.eks.node_security_group_id
  kafka_password             = var.kafka_password
  kms_key_arn                = module.kms.rds_key_arn
  tags                       = local.common_tags
}

# ═══════════════════════════════════════════════════════════════════════════
# S3 Buckets
# ═══════════════════════════════════════════════════════════════════════════
module "s3" {
  source = "./modules/s3"

  project     = var.project
  kms_key_arn = module.kms.s3_key_arn
  tags        = local.common_tags
}

# ═══════════════════════════════════════════════════════════════════════════
# ECR Repositories
# ═══════════════════════════════════════════════════════════════════════════
module "ecr" {
  source = "./modules/ecr"

  project     = var.project
  kms_key_arn = module.kms.s3_key_arn
  tags        = local.common_tags
}

# ═══════════════════════════════════════════════════════════════════════════
# WAF
# ═══════════════════════════════════════════════════════════════════════════
module "waf" {
  source = "./modules/waf"

  project = var.project
  alb_arn = "" # Set after ALB is created by AWS LB Controller in EKS
  tags    = local.common_tags
}
