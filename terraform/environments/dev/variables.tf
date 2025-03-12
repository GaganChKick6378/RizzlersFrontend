variable "create_state_resources" {
  description = "Whether to create state resources (should only be true once)"
  type        = bool
  default     = false
}

variable "state_bucket_name" {
  description = "Name of the S3 bucket to store Terraform state"
  type        = string
  default     = "rizzlers-terraform-state"
}

variable "frontend_bucket_name" {
  description = "Name of the S3 bucket for frontend deployment"
  type        = string
  default     = "rizzlers-frontend-dev"
}

variable "dynamodb_table_name" {
  description = "Name of the DynamoDB table for Terraform state locking"
  type        = string
  default     = "rizzlers-terraform-locks"
} 