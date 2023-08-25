import { ProjectDetailsHelper } from '../core/routes'

type Route = string
export type Tab = 'overview' | 'model-card' | 'version-history' | 'model-apis'

/**
 * Routes helper for model registry routes.
 * Since the same pages exist at both the global (not inside a project) scope
 * and project scope, this file holds the logic to build appropriate routes
 * for those views to link between each other
 * 
 */
export interface ModelRegistryRouteProvider {
  listPage(pageNumber?: string): Route
  detailsPage(modelName: string, tab?: Tab): Route
  overviewTab(modelName: string): Route
  modelCardTab(modelName: string, version?: number): Route
  modelApisTab(modelName: string): Route
  versionHistoryTab(modelName: string): Route
}

abstract class AbstractModelRegistryRouteProvider implements ModelRegistryRouteProvider {
  protected abstract readonly baseUrl: Route

  listPage(pageNumber?: string): Route {
    return pageNumber ? `${this.baseUrl}?pageNum=${pageNumber}` : this.baseUrl
  }

  detailsPage(modelName: string, tab?: Tab): Route {
    const baseUrl = `${this.baseUrl}/${modelName}`
    return tab ? `${baseUrl}/${tab}` : baseUrl
  }

  overviewTab(modelName: string): Route {
    return this.detailsPage(modelName, 'overview')
  }

  modelCardTab(modelName: string, version?: number): Route {
    const baseUrl = this.detailsPage(modelName, 'model-card')
    return version ? `${baseUrl}?version=${version}` : baseUrl
  }

  modelApisTab(modelName: string): Route {
    return this.detailsPage(modelName, 'model-apis')
  }

  versionHistoryTab(modelName: string): Route {
    return this.detailsPage(modelName, 'version-history')
  }
}

export class ModelRegistryGlobalRouteProvider extends AbstractModelRegistryRouteProvider implements ModelRegistryRouteProvider {
  // this should be marked 'override', but we use a version of typescript older than the dead sea scrolls
  protected readonly baseUrl: Route = '/model-registry'
}

export class ModelRegistryProjectRouteProvider extends AbstractModelRegistryRouteProvider implements ModelRegistryRouteProvider {
  protected readonly baseUrl: Route
  
  constructor(projectOwner: string, projectName: string) {
    super()
    this.baseUrl = `/u/${projectOwner}/${projectName}/model-registry`
  }
}

/**
 * A ProjectDetailsHelper helper function for the nav builder
 */
export const modelRegistryListViewProjectRouteHelper: ProjectDetailsHelper =
  (ownerName = ':ownerName', projectName = ':projectName') => new ModelRegistryProjectRouteProvider(ownerName, projectName).listPage()

/**
 * A string for the nav builder in the form of
 * /u/:projectOwner/:projectName/model-registry
 */
export const modelRegistryListViewProjectRoutePattern: string = modelRegistryListViewProjectRouteHelper()

/**
 * A string for the nav builder for the global path to model registry in the form of
 * /model-registry
 */
export const modelRegistryListViewGlobalRoutePattern: string = new ModelRegistryGlobalRouteProvider().listPage()
