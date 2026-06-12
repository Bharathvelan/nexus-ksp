output "rds_key_arn" {
  description = "KMS key ARN for RDS"
  value       = aws_kms_key.rds.arn
}

output "s3_key_arn" {
  description = "KMS key ARN for S3"
  value       = aws_kms_key.s3.arn
}

output "eks_key_arn" {
  description = "KMS key ARN for EKS secrets"
  value       = aws_kms_key.eks.arn
}

output "rds_key_id" {
  description = "KMS key ID for RDS"
  value       = aws_kms_key.rds.key_id
}

output "s3_key_id" {
  description = "KMS key ID for S3"
  value       = aws_kms_key.s3.key_id
}

output "eks_key_id" {
  description = "KMS key ID for EKS"
  value       = aws_kms_key.eks.key_id
}
