terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    bucket = "rizzlers-ibe-dev-tfstate"
    key    = "frontend/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = "us-east-1"
  default_tags {
    tags = {
      Creator = "RizzlersTeam"
      Purpose = "IBE"
    }
  }
}

module "frontend_s3" {
  source = "./modules/frontend/s3"
}

module "frontend_cloudfront" {
  source = "./modules/frontend/cloudfront"
  bucket_name = module.frontend_s3.bucket_name
  bucket_regional_domain_name = module.frontend_s3.bucket_regional_domain_name
  depends_on = [module.frontend_s3]
}

output "cloudfront_distribution_domain" {
  value = module.frontend_cloudfront.cloudfront_distribution_domain
} 