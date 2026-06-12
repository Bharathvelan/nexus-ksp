variable "project" {
  description = "Project name prefix"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "private_subnet_ids" {
  description = "Private subnet IDs for DB subnet group"
  type        = list(string)
}

variable "eks_node_security_group_id" {
  description = "EKS node security group ID (allowed to connect on 5432)"
  type        = string
}

variable "instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.r6g.large"
}

variable "allocated_storage" {
  description = "Initial storage in GB"
  type        = number
  default     = 500
}

variable "max_allocated_storage" {
  description = "Max storage autoscaling limit in GB"
  type        = number
  default     = 2000
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "nexus_ksp"
}

variable "db_username" {
  description = "Master username"
  type        = string
  default     = "nexus_admin"
  sensitive   = true
}

variable "db_password" {
  description = "Master password"
  type        = string
  sensitive   = true
}

variable "backup_retention_period" {
  description = "Backup retention in days"
  type        = number
  default     = 7
}

variable "kms_key_arn" {
  description = "KMS key ARN for encryption"
  type        = string
}

variable "tags" {
  description = "Common tags"
  type        = map(string)
  default     = {}
}
