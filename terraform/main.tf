module "frontend" {
  source               = "./modules/frontend"
  project              = var.project
  environment          = var.environment
  backend_api_endpoint = module.backend.api_endpoint
  depends_on           = [module.backend]
} 