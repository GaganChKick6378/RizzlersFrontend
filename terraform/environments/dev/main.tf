provider "aws" {
  region = "ap-south-1"
}

locals {
  environment = "dev"
  common_tags = {
    Name    = "Rizzlers-${local.environment}"
    Creator = "Rizzlers Team"
    Purpose = "IBE"
  }
}

# State Management Module (only needs to be created once, not per environment)
module "state" {
  count  = var.create_state_resources ? 1 : 0
  source = "../../modules/state"
  
  state_bucket_name = var.state_bucket_name
  tags              = local.common_tags
}

# S3 Website Bucket Module
module "s3_website" {
  source = "../../modules/s3"
  
  bucket_name               = var.frontend_bucket_name
  environment               = local.environment
  tags                      = local.common_tags
  cloudfront_distribution_arn = module.cloudfront.cloudfront_distribution_arn
}

# CloudFront Distribution Module
module "cloudfront" {
  source = "../../modules/cloudfront"
  
  s3_bucket_domain_name = "${module.s3_website.bucket_name}.s3.amazonaws.com"
  s3_bucket_arn         = module.s3_website.bucket_arn
  s3_bucket_id          = module.s3_website.bucket_name
  environment           = local.environment
  tags                  = local.common_tags
}

# IAM Module
module "iam" {
  source = "../../modules/iam"
  
  environment               = local.environment
  s3_bucket_arn             = module.s3_website.bucket_arn
  cloudfront_distribution_arn = module.cloudfront.cloudfront_distribution_arn
  tags                      = local.common_tags
}

# DynamoDB for Terraform state locking
resource "aws_dynamodb_table" "terraform_locks" {
  count        = var.create_state_resources ? 1 : 0
  name         = var.dynamodb_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"
  
  attribute {
    name = "LockID"
    type = "S"
  }
  
  tags = local.common_tags
}

variable "create_state_resources" {
  description = "Whether to create state resources (should only be true once)"
  type        = bool
  default     = false
}

output "website_url" {
  value       = "https://${module.cloudfront.cloudfront_domain_name}"
  description = "The CloudFront URL of the website"
}

output "s3_bucket_name" {
  value       = module.s3_website.bucket_name
  description = "The name of the S3 bucket hosting the website content"
}

output "cloudfront_distribution_id" {
  value       = module.cloudfront.cloudfront_distribution_id
  description = "The ID of the CloudFront distribution"
} 