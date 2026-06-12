###############################################################################
# NEXUS-KSP — S3 Module
# Buckets for models, exports, and audit archive with encryption and lifecycle.
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
  buckets = {
    models        = "${var.project}-models"
    exports       = "${var.project}-exports"
    audit_archive = "${var.project}-audit-archive"
  }
}

# ---------------------------------------------------------------------------
# S3 Buckets
# ---------------------------------------------------------------------------
resource "aws_s3_bucket" "main" {
  for_each = local.buckets
  bucket   = each.value

  tags = merge(var.tags, {
    Name = each.value
  })
}

# Versioning
resource "aws_s3_bucket_versioning" "main" {
  for_each = local.buckets
  bucket   = aws_s3_bucket.main[each.key].id

  versioning_configuration {
    status = "Enabled"
  }
}

# Server-side encryption (SSE-KMS)
resource "aws_s3_bucket_server_side_encryption_configuration" "main" {
  for_each = local.buckets
  bucket   = aws_s3_bucket.main[each.key].id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = var.kms_key_arn
    }
    bucket_key_enabled = true
  }
}

# Block all public access
resource "aws_s3_bucket_public_access_block" "main" {
  for_each = local.buckets
  bucket   = aws_s3_bucket.main[each.key].id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Lifecycle — move to Glacier after 90 days
resource "aws_s3_bucket_lifecycle_configuration" "main" {
  for_each = local.buckets
  bucket   = aws_s3_bucket.main[each.key].id

  rule {
    id     = "glacier-transition"
    status = "Enabled"

    transition {
      days          = 90
      storage_class = "GLACIER"
    }

    noncurrent_version_transition {
      noncurrent_days = 30
      storage_class   = "GLACIER"
    }

    noncurrent_version_expiration {
      noncurrent_days = 365
    }
  }
}

# Bucket policy — enforce SSL
resource "aws_s3_bucket_policy" "main" {
  for_each = local.buckets
  bucket   = aws_s3_bucket.main[each.key].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "EnforceSSL"
        Effect    = "Deny"
        Principal = "*"
        Action    = "s3:*"
        Resource = [
          aws_s3_bucket.main[each.key].arn,
          "${aws_s3_bucket.main[each.key].arn}/*"
        ]
        Condition = {
          Bool = {
            "aws:SecureTransport" = "false"
          }
        }
      }
    ]
  })
}
