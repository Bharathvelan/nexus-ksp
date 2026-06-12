variable "project" {
  description = "Project name prefix"
  type        = string
}

variable "alb_arn" {
  description = "ALB ARN to associate WAF with (empty string to skip)"
  type        = string
  default     = ""
}

variable "tags" {
  description = "Common tags"
  type        = map(string)
  default     = {}
}
