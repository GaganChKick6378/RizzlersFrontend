# Terraform Configuration for Rizzlers Frontend

This Terraform configuration provisions the necessary AWS resources for deploying the Rizzlers Frontend application.

## Directory Structure

- `backend.tf`: Contains the common S3 backend configuration
- `main.tf`: A wrapper that can load environment-specific configurations
- `environments/`: Contains environment-specific configurations
  - `dev/`: Development environment configuration (self-contained)
  - `qa/`: QA environment configuration (self-contained)
- `modules/`: Reusable Terraform modules
  - `s3/`: S3 bucket configuration
  - `cloudfront/`: CloudFront distribution
  - `iam/`: IAM roles and policies
  - `state/`: Terraform state resources

## Usage

### Option 1: Using environment directories directly (recommended for CI/CD)

```bash
# Navigate to the specific environment
cd environments/dev

# Initialize and apply
terraform init
terraform apply
```

### Option 2: Using the root wrapper (for local development)

```bash
# From the root terraform directory
terraform init
terraform apply -var="environment=dev"
```

## State Management

The Terraform state is stored in an S3 bucket named "rizzlers-ibe-dev-tfstate" in the "frontend/{env}" folder. 
A DynamoDB table named "rizzlers-terraform-locks" is used for state locking.

## Outputs

- `website_url`: The CloudFront URL of the website
- `s3_bucket_name`: The name of the S3 bucket hosting the website content
- `cloudfront_distribution_id`: The ID of the CloudFront distribution
- `state_bucket_name`: The name of the S3 bucket for terraform state (dev only)
- `terraform_locks_table`: The name of the DynamoDB table for terraform locks (dev only) 