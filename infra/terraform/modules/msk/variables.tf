variable "project" {
  description = "Project name prefix"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "private_subnet_ids" {
  description = "Private subnet IDs"
  type        = list(string)
}

variable "eks_node_security_group_id" {
  description = "EKS node security group ID"
  type        = string
}

variable "kafka_version" {
  description = "Kafka version"
  type        = string
  default     = "3.5.1"
}

variable "broker_count" {
  description = "Number of Kafka brokers"
  type        = number
  default     = 3
}

variable "broker_instance_type" {
  description = "Broker instance type"
  type        = string
  default     = "kafka.m5.large"
}

variable "broker_storage_gb" {
  description = "Storage per broker in GB"
  type        = number
  default     = 1000
}

variable "kafka_username" {
  description = "SASL/SCRAM username"
  type        = string
  default     = "nexus-kafka-admin"
  sensitive   = true
}

variable "kafka_password" {
  description = "SASL/SCRAM password"
  type        = string
  sensitive   = true
}

variable "kms_key_arn" {
  description = "KMS key ARN"
  type        = string
}

variable "tags" {
  description = "Common tags"
  type        = map(string)
  default     = {}
}
