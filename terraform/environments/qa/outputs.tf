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