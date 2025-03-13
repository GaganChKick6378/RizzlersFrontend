# Terraform Configuration for Rizzlers Frontend

This Terraform configuration provisions the necessary AWS resources for deploying the Rizzlers Frontend application.

## Directory Structure

- `backend.tf`: Contains the S3 backend configuration for Terraform state
- `main.tf`: Main entry point that loads the environment-specific configuration
- `environments/`: Contains environment-specific configurations
  - `dev/`: Development environment configuration
  - `qa/`: QA environment configuration
- `modules/`: Reusable Terraform modules
  - `s3/`: S3 bucket configuration
  - `cloudfront/`: CloudFront distribution
  - `iam/`: IAM roles and policies
  - `state/`: Terraform state resources

## Usage

To deploy to a specific environment:

```bash
# Initialize Terraform with the S3 backend
terraform init

# Deploy to development environment (default)
terraform apply

# Or specify a different environment
terraform apply -var="environment=qa"
```

## State Management

The Terraform state is stored in an S3 bucket named "rizzlers-ibe-dev-tfstate" in the "frontend" folder. 
A DynamoDB table named "rizzlers-terraform-locks" is used for state locking.

## Outputs

- `website_url`: The CloudFront URL of the website
- `frontend_s3_bucket_name`: The name of the S3 bucket hosting the website content
- `frontend_cloudfront_distribution_id`: The ID of the CloudFront distribution
- `terraform_state_bucket_name`: The name of the S3 bucket for terraform state
- `terraform_locks_table_name`: The name of the DynamoDB table for terraform locks 