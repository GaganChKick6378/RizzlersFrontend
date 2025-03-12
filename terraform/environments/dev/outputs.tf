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

output "state_bucket_name" {
  value       = var.create_state_resources ? module.state[0].bucket_id : var.state_bucket_name
  description = "The name of the S3 bucket for terraform state"
}

output "terraform_locks_table" {
  value       = var.create_state_resources ? aws_dynamodb_table.terraform_locks[0].name : var.dynamodb_table_name
  description = "The name of the DynamoDB table for terraform locks"
} 