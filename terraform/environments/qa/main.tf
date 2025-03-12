provider "aws" {
  region = "ap-south-1"
}

locals {
  environment = "qa"
  common_tags = {
    Name    = "Rizzlers-${local.environment}"
    Creator = "Rizzlers Team"
    Purpose = "IBE"
  }
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