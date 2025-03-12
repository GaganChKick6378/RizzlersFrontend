variable "project" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment (dev or qa)"
  type        = string
  validation {
    condition     = contains(["dev", "qa"], var.environment)
    error_message = "Environment must be either 'dev' or 'qa'"
  }
}

variable "backend_api_endpoint" {
  description = "Endpoint for the backend API"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-south-1"
}

variable "frontend_bucket_name" {
  description = "Name of the S3 bucket for frontend static files"
  type        = string
  default     = "rizzlers-frontend"
}

variable "cloudfront_price_class" {
  description = "CloudFront price class"
  type        = string
  default     = "PriceClass_200"
}

variable "domain_name" {
  description = "Domain name for the frontend application"
  type        = string
}

variable "github_repository" {
  description = "GitHub repository name"
  type        = string
  default     = "RizzlersFrontend"
}

variable "github_branch" {
  description = "GitHub branch to track"
  type        = string
}

variable "terraform_state_bucket" {
  description = "Name of the S3 bucket for storing Terraform state"
  type        = string
  default     = "rizzlers-terraform-state"
} 