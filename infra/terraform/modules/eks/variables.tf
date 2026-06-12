variable "project" {
  description = "Project name prefix"
  type        = string
}

variable "cluster_name" {
  description = "Name of the EKS cluster"
  type        = string
}

variable "cluster_version" {
  description = "Kubernetes version"
  type        = string
  default     = "1.29"
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "private_subnet_ids" {
  description = "Private subnet IDs for node groups"
  type        = list(string)
}

variable "public_subnet_ids" {
  description = "Public subnet IDs"
  type        = list(string)
}

variable "endpoint_public_access" {
  description = "Enable public access to the EKS API endpoint"
  type        = bool
  default     = false
}

variable "kms_key_arn" {
  description = "KMS key ARN for EKS secrets encryption"
  type        = string
}

# --- System Node Group ---
variable "system_node_min" {
  description = "Minimum nodes in system group"
  type        = number
  default     = 2
}

variable "system_node_max" {
  description = "Maximum nodes in system group"
  type        = number
  default     = 5
}

variable "system_node_desired" {
  description = "Desired nodes in system group"
  type        = number
  default     = 2
}

# --- AI Inference Node Group ---
variable "ai_instance_types" {
  description = "Instance types for AI inference (c5.2xlarge or g4dn.xlarge)"
  type        = list(string)
  default     = ["c5.2xlarge"]
}

variable "ai_node_min" {
  description = "Minimum nodes in AI inference group"
  type        = number
  default     = 1
}

variable "ai_node_max" {
  description = "Maximum nodes in AI inference group"
  type        = number
  default     = 4
}

variable "ai_node_desired" {
  description = "Desired nodes in AI inference group"
  type        = number
  default     = 1
}

# --- Data Node Group ---
variable "data_node_min" {
  description = "Minimum nodes in data group"
  type        = number
  default     = 2
}

variable "data_node_max" {
  description = "Maximum nodes in data group"
  type        = number
  default     = 6
}

variable "data_node_desired" {
  description = "Desired nodes in data group"
  type        = number
  default     = 2
}

variable "tags" {
  description = "Common tags"
  type        = map(string)
  default     = {}
}
