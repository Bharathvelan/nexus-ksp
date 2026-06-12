variable "project" {
  description = "Project name prefix"
  type        = string
}

variable "kms_key_arn" {
  description = "KMS key ARN for SSE-KMS"
  type        = string
}

variable "tags" {
  description = "Common tags"
  type        = map(string)
  default     = {}
}
