# Rizzlers Frontend

This repository contains the frontend application for Rizzlers, along with the infrastructure as code (Terraform) and CI/CD pipeline configuration.

## Project Structure

```
├── frontend/                   # React frontend application
├── terraform/                  # Terraform infrastructure as code
│   ├── modules/                # Reusable Terraform modules
│   │   ├── cloudfront/         # CloudFront distribution module
│   │   ├── iam/                # IAM policies and roles module
│   │   ├── s3/                 # S3 bucket module
│   │   └── state/              # State management module
│   └── environments/           # Environment-specific configurations
│       ├── dev/                # Development environment
│       └── qa/                 # QA environment
└── buildspec.yml               # AWS CodeBuild configuration
```

## Infrastructure

The infrastructure is managed with Terraform and deployed on AWS. The following resources are provisioned:

- S3 buckets for:
  - Frontend static website hosting
  - Terraform state
- CloudFront distribution for content delivery
- IAM policies for CI/CD
- DynamoDB table for Terraform state locking

## CI/CD Pipeline

The CI/CD pipeline is implemented using AWS CodeBuild and triggered by GitHub webhooks. The pipeline:

1. Detects which branch triggered the build (dev or qa)
2. Runs Terraform to provision/update infrastructure
3. Builds the frontend application
4. Deploys the frontend to the corresponding S3 bucket
5. Invalidates the CloudFront cache

## Setup Instructions

### Prerequisites

- AWS Account
- GitHub Repository with dev and qa branches
- AWS Parameter Store entries for:
  - /rizzlers/aws/access_key_id
  - /rizzlers/aws/secret_access_key

### Initial Setup

1. **Create the Terraform state resources manually**:

```bash
cd terraform/environments/dev
terraform init
terraform apply -var="create_state_resources=true"
```

2. **Set up AWS CodeBuild**:
   - Create a CodeBuild project
   - Connect to your GitHub repository
   - Configure webhook to trigger builds on changes to dev and qa branches
   - Set buildspec location to buildspec.yml
   - Set up appropriate IAM roles with permissions to:
     - Access the parameter store
     - Create/update AWS resources
     - Deploy to S3
     - Invalidate CloudFront

### Deployment

The CI/CD pipeline automatically deploys changes:
- Commits to the `dev` branch deploy to the development environment
- Commits to the `qa` branch deploy to the QA environment

## Manual Deployment

If needed, you can manually deploy:

```bash
# For development
cd terraform/environments/dev
terraform init
terraform apply

# For QA
cd terraform/environments/qa
terraform init
terraform apply
```

## Frontend Build

To build the frontend locally:

```bash
cd frontend
npm install
npm run build
```
