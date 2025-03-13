provider "aws" {
  region = "ap-south-1"
}

# Use environment variable or set a default
variable "environment" {
  description = "Environment (dev or qa)"
  type        = string
  default     = "dev"
}

# Include the appropriate environment configuration
module "environment_config" {
  source = "./environments/${var.environment}"
}

# Output all the outputs from the environment module
output "website_url" {
  value       = module.environment_config.website_url
  description = "The CloudFront URL of the website"
}

output "frontend_s3_bucket_name" {
  value       = module.environment_config.s3_bucket_name
  description = "The name of the S3 bucket hosting the website content"
}

output "frontend_cloudfront_distribution_id" {
  value       = module.environment_config.cloudfront_distribution_id
  description = "The ID of the CloudFront distribution"
}

output "terraform_state_bucket_name" {
  value       = module.environment_config.state_bucket_name
  description = "The name of the S3 bucket for terraform state"
}

output "terraform_locks_table_name" {
  value       = module.environment_config.terraform_locks_table
  description = "The name of the DynamoDB table for terraform locks"
} 