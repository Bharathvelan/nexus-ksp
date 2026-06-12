###############################################################################
# NEXUS-KSP — ECR Module
# Container registries for all services with scanning and lifecycle.
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

locals {
  repositories = [
    "llm-orchestrator",
    "graph-service",
    "pattern-engine",
    "profiling-service",
    "alert-service",
    "audit-logger",
    "report-exporter",
    "api-gateway",
    "web",
  ]
}

# ---------------------------------------------------------------------------
# ECR Repositories
# ---------------------------------------------------------------------------
resource "aws_ecr_repository" "main" {
  for_each             = toset(local.repositories)
  name                 = "${var.project}/${each.key}"
  image_tag_mutability = "IMMUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  encryption_configuration {
    encryption_type = "KMS"
    kms_key         = var.kms_key_arn
  }

  tags = merge(var.tags, {
    Name = "${var.project}/${each.key}"
  })
}

# ---------------------------------------------------------------------------
# Lifecycle Policy — keep last 10 images
# ---------------------------------------------------------------------------
resource "aws_ecr_lifecycle_policy" "main" {
  for_each   = toset(local.repositories)
  repository = aws_ecr_repository.main[each.key].name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep last 10 tagged images"
        selection = {
          tagStatus     = "tagged"
          tagPrefixList = ["v", "sha-"]
          countType     = "imageCountMoreThan"
          countNumber   = 10
        }
        action = {
          type = "expire"
        }
      },
      {
        rulePriority = 2
        description  = "Remove untagged images after 7 days"
        selection = {
          tagStatus   = "untagged"
          countType   = "sinceImagePushed"
          countUnit   = "days"
          countNumber = 7
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}
