# Rizzlers Frontend

Frontend application for Rizzlers IBE project. This repository includes CI/CD workflows for automated deployments to development and QA environments.

## CI/CD Setup

This project uses GitHub Actions for continuous integration and deployment. We have separate workflows for different environments:

### Dev Environment Workflow

- **Workflow File**: `.github/workflows/terraform-deploy.yml`
- **Trigger**: Automatically runs on pushes or pull requests to the `dev` branch
- **Process**:
  1. Sets up Terraform and creates necessary AWS resources (S3 bucket, CloudFront distribution)
  2. Builds the React frontend application
  3. Deploys the built assets to the S3 bucket
  4. Invalidates the CloudFront cache

### QA Environment Workflow

- **Workflow File**: `.github/workflows/terraform-deploy-qa.yml`
- **Trigger**: Runs on pushes or pull requests to the `QA` branch
- **Process**:
  1. Plans the Terraform changes without applying them
  2. Sends an email notification to reviewers
  3. Requires manual approval before proceeding
  4. After approval, applies the Terraform changes
  5. Builds and deploys the frontend to the QA environment
  6. Sends a success notification email

## Environment Separation

The project uses Terraform workspaces to maintain separate infrastructure for each environment:

- **Dev Environment**: Uses the `dev` workspace
- **QA Environment**: Uses the `qa` workspace

Resources are named with the environment suffix to ensure proper separation, e.g.:
- S3 buckets: `rizzlers-ibe-frontend-dev` and `rizzlers-ibe-frontend-qa`
- CloudFront distributions: Named with corresponding environment tags

## Required GitHub Secrets

The following secrets need to be configured in your GitHub repository:

- `AWS_ACCESS_KEY_ID`: AWS access key with permissions to create/modify S3 and CloudFront resources
- `AWS_SECRET_ACCESS_KEY`: Corresponding AWS secret key
- `MAIL_SERVER`: SMTP server address for sending email notifications
- `MAIL_PORT`: SMTP server port
- `MAIL_USERNAME`: Email account username
- `MAIL_PASSWORD`: Email account password
- `REVIEWER_EMAIL`: Email address for QA deployment reviewers
- `TEAM_EMAIL`: Email address for the team to receive deployment notifications

## GitHub Environment Configuration

To enable the manual approval process for QA deployments:

1. Go to your repository Settings > Environments
2. Create a new environment named `qa`
3. Enable "Required reviewers" and add the appropriate team members
4. (Optional) Set deployment branch policies to limit to the `QA` branch

## Local Development

To run the frontend locally:

```bash
cd frontend
npm install
npm run dev
```

## Deployment Workflow

### Development (Automatic)
1. Push changes to the `dev` branch
2. GitHub Actions automatically deploys to the development environment
3. Access the site at the CloudFront URL in the workflow output

### QA (Manual Approval)
1. Push changes to the `QA` branch
2. GitHub Actions runs the planning phase
3. Reviewers receive an email notification
4. Reviewers approve the deployment in GitHub
5. The application deploys to the QA environment
6. Team receives a deployment success notification
