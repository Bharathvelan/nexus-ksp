output "bucket_arns" {
  description = "Map of bucket name to ARN"
  value       = { for k, v in aws_s3_bucket.main : k => v.arn }
}

output "bucket_ids" {
  description = "Map of bucket name to ID"
  value       = { for k, v in aws_s3_bucket.main : k => v.id }
}

output "models_bucket_arn" {
  description = "Models bucket ARN"
  value       = aws_s3_bucket.main["models"].arn
}

output "exports_bucket_arn" {
  description = "Exports bucket ARN"
  value       = aws_s3_bucket.main["exports"].arn
}

output "audit_archive_bucket_arn" {
  description = "Audit archive bucket ARN"
  value       = aws_s3_bucket.main["audit_archive"].arn
}
