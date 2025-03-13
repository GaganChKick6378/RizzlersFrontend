# Rizzlers Frontend CI/CD Workflow

This repository contains the infrastructure as code (Terraform) and CI/CD workflows for deploying the Rizzlers Frontend application to AWS S3 and CloudFront.

## Architecture Overview

The frontend application is deployed with the following architecture:
- **S3 Bucket**: Hosts the static website files (React application)
- **CloudFront Distribution**: Serves the content with low latency globally
- **GitHub Actions**: Automates the deployment process

## CI/CD Workflow

The GitHub Actions workflow automates the entire deployment process:

1. When code is pushed to the `dev` or `QA` branch, the workflow is triggered
2. Terraform creates/updates the necessary AWS infrastructure:
   - S3 bucket for hosting the static files
   - CloudFront distribution for content delivery
3. The React application is built
4. The built files are uploaded to the S3 bucket
5. CloudFront cache is invalidated to ensure the latest content is served

### Branch-Based Deployments

- **dev branch**: Deploys to the development environment
- **QA branch**: Deploys to the QA environment

## Infrastructure as Code (Terraform)

The Terraform configurations are organized in a modular way:

```
terraform/
├── main.tf
├── modules/
    ├── frontend/
        ├── s3/
        │   └── main.tf
        └── cloudfront/
            ├── main.tf
            └── variables.tf
```

### State Management

Terraform state is stored in an S3 bucket:
- Bucket: `rizzlers-ibe-dev-tfstate`
- Key: `frontend/terraform.tfstate`

## Tagging Strategy

All resources are tagged with:
- **Name**: Rizzlers-[resource-name]
- **Creator**: RizzlersTeam
- **Purpose**: IBE

## Frontend Application

The frontend application is a React application built with:
- React
- TypeScript
- Vite

## Accessing the Application

After deployment, the application is available at:
- Development: https://[cloudfront-domain-dev]
- QA: https://[cloudfront-domain-qa]

## Setup Requirements

To use this workflow, you need to set up the following GitHub secrets:
- `AWS_ROLE_ARN`: The ARN of an AWS IAM role with permissions to:
  - Create/update S3 buckets
  - Create/update CloudFront distributions
  - Read/write to the S3 state bucket

## Local Development

For local development:

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```
