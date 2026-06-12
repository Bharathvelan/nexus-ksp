###############################################################################
# NEXUS-KSP — CI/CD IAM for GitHub Actions OIDC
# Allows GitHub Actions to push to ECR, deploy to EKS, and access S3 state.
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

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# ---------------------------------------------------------------------------
# GitHub OIDC Provider
# ---------------------------------------------------------------------------
resource "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"

  client_id_list = ["sts.amazonaws.com"]

  thumbprint_list = [
    "6938fd4d98bab03faadb97b34396831e3780aea1",
    "1c58a3a8518e8759bf075b76b750d4f2df264fcd"
  ]

  tags = var.tags
}

# ---------------------------------------------------------------------------
# GitHub Actions IAM Role
# ---------------------------------------------------------------------------
resource "aws_iam_role" "github_actions" {
  name = "${var.project}-github-actions-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Federated = aws_iam_openid_connect_provider.github.arn
      }
      Action = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringLike = {
          "token.actions.githubusercontent.com:sub" = "repo:${var.github_org}/${var.github_repo}:*"
        }
        StringEquals = {
          "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
        }
      }
    }]
  })

  tags = var.tags
}

# ---------------------------------------------------------------------------
# ECR Push Policy
# ---------------------------------------------------------------------------
resource "aws_iam_role_policy" "ecr_push" {
  name = "${var.project}-ecr-push"
  role = aws_iam_role.github_actions.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:GetRepositoryPolicy",
          "ecr:DescribeRepositories",
          "ecr:ListImages",
          "ecr:DescribeImages",
          "ecr:BatchGetImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload",
          "ecr:PutImage"
        ]
        Resource = "arn:aws:ecr:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:repository/${var.project}/*"
      }
    ]
  })
}

# ---------------------------------------------------------------------------
# EKS Deploy Policy
# ---------------------------------------------------------------------------
resource "aws_iam_role_policy" "eks_deploy" {
  name = "${var.project}-eks-deploy"
  role = aws_iam_role.github_actions.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "eks:DescribeCluster",
          "eks:ListClusters"
        ]
        Resource = "*"
      }
    ]
  })
}

# ---------------------------------------------------------------------------
# S3 State Access Policy
# ---------------------------------------------------------------------------
resource "aws_iam_role_policy" "s3_state" {
  name = "${var.project}-s3-state"
  role = aws_iam_role.github_actions.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:ListBucket"
        ]
        Resource = [
          "arn:aws:s3:::${var.project}-terraform-state",
          "arn:aws:s3:::${var.project}-terraform-state/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:DeleteItem"
        ]
        Resource = "arn:aws:dynamodb:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:table/${var.project}-terraform-lock"
      }
    ]
  })
}

# ---------------------------------------------------------------------------
# Variables
# ---------------------------------------------------------------------------
variable "project" {
  description = "Project name prefix"
  type        = string
  default     = "nexus-ksp"
}

variable "github_org" {
  description = "GitHub organization"
  type        = string
  default     = "karnataka-police"
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
  default     = "nexus-ksp"
}

variable "tags" {
  description = "Common tags"
  type        = map(string)
  default     = {}
}

# ---------------------------------------------------------------------------
# Outputs
# ---------------------------------------------------------------------------
output "github_actions_role_arn" {
  description = "IAM role ARN for GitHub Actions"
  value       = aws_iam_role.github_actions.arn
}
