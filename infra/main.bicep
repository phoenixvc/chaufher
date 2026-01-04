// ChaufHER Azure Infrastructure
// Deploy with: az deployment sub create --location southafricanorth --template-file main.bicep --parameters environment=dev

targetScope = 'subscription'

@description('Environment name (dev, staging, prod)')
@allowed(['dev', 'staging', 'prod'])
param environment string = 'dev'

@description('Azure region for resources')
param location string = 'southafricanorth'

@description('SQL admin password')
@secure()
param sqlAdminPassword string

// Resource naming
var prefix = 'chaufher'
var resourceGroupName = 'rg-${prefix}-${environment}'
var tags = {
  project: 'ChaufHER'
  environment: environment
  managedBy: 'Bicep'
}

// Resource Group
resource rg 'Microsoft.Resources/resourceGroups@2023-07-01' = {
  name: resourceGroupName
  location: location
  tags: tags
}

// Core infrastructure module
module core 'modules/core.bicep' = {
  name: 'core-${environment}'
  scope: rg
  params: {
    prefix: prefix
    environment: environment
    location: location
    tags: tags
    sqlAdminPassword: sqlAdminPassword
  }
}

// Container Apps module
module containerApps 'modules/container-apps.bicep' = {
  name: 'container-apps-${environment}'
  scope: rg
  params: {
    prefix: prefix
    environment: environment
    location: location
    tags: tags
    containerRegistryName: core.outputs.containerRegistryName
    logAnalyticsWorkspaceId: core.outputs.logAnalyticsWorkspaceId
    appInsightsConnectionString: core.outputs.appInsightsConnectionString
  }
}

// Outputs
output resourceGroupName string = rg.name
output apiUrl string = containerApps.outputs.apiUrl
output containerRegistryLoginServer string = core.outputs.containerRegistryLoginServer
