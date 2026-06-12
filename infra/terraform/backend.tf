###############################################################################
# NEXUS-KSP — Terraform Backend Configuration
# S3 state backend with DynamoDB lock table.
# NOTE: The S3 bucket and DynamoDB table must be created manually before
#       running terraform init. Use the bootstrap script in scripts/.
###############################################################################

terraform {
  backend "s3" {
    bucket         = "nexus-ksp-terraform-state"
    key            = "production/terraform.tfstate"
    region         = "ap-south-1"
    encrypt        = true
    dynamodb_table = "nexus-ksp-terraform-lock"
  }
}
