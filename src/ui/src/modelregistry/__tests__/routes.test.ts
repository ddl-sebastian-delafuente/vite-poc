import { 
  ModelRegistryGlobalRouteProvider,
  ModelRegistryProjectRouteProvider,
  modelRegistryListViewProjectRouteHelper,
  modelRegistryListViewGlobalRoutePattern,
  modelRegistryListViewProjectRoutePattern
 } from '../routes'

describe('Model Registry Route Provider', () => {
  describe('Global Route Provider', () => {
    const provider = new ModelRegistryGlobalRouteProvider()

    test('Overview Page returns the correct URL with page number', () => {
      expect(provider.listPage('2')).toBe('/model-registry?pageNum=2')
    })

    test('Overview Page returns the correct URL without page number', () => {
      expect(provider.listPage()).toBe('/model-registry')
    })

    test('Details Page returns the correct URL with tab', () => {
      expect(provider.detailsPage('model-name', 'model-card')).toBe('/model-registry/model-name/model-card')
    })

    test('Details Page returns the correct URL without tab', () => {
      expect(provider.detailsPage('model-name')).toBe('/model-registry/model-name')
    })

    test('Model Card Tab returns the correct URL with version', () => {
      expect(provider.modelCardTab('model-name', 1)).toBe('/model-registry/model-name/model-card?version=1')
    })

    test('Model Card Tab returns the correct URL without version', () => {
      expect(provider.modelCardTab('model-name')).toBe('/model-registry/model-name/model-card')
    })

    test('Version History Tab returns the correct URL', () => {
      expect(provider.versionHistoryTab('model-name')).toBe('/model-registry/model-name/version-history')
    })
  })

  describe('Project Route Provider', () => {
    const provider = new ModelRegistryProjectRouteProvider('user', 'project')

    test('Overview Page returns the correct URL with page number', () => {
      expect(provider.listPage('2')).toBe('/u/user/project/model-registry?pageNum=2')
    })

    test('Overview Page returns the correct URL without page number', () => {
      expect(provider.listPage()).toBe('/u/user/project/model-registry')
    })

    test('Details Page returns the correct URL with tab', () => {
      expect(provider.detailsPage('model-name', 'model-card')).toBe('/u/user/project/model-registry/model-name/model-card')
    })

    test('Details Page returns the correct URL without tab', () => {
      expect(provider.detailsPage('model-name')).toBe('/u/user/project/model-registry/model-name')
    })

    test('Model Card Tab returns the correct URL with version', () => {
      expect(provider.modelCardTab('model-name', 2)).toBe('/u/user/project/model-registry/model-name/model-card?version=2')
    })

    test('Model Card Tab returns the correct URL without version', () => {
      expect(provider.modelCardTab('model-name')).toBe('/u/user/project/model-registry/model-name/model-card')
    })

    test('Version History Tab returns the correct URL', () => {
      expect(provider.versionHistoryTab('model-name')).toBe('/u/user/project/model-registry/model-name/version-history')
    })
  })
})

describe('model registry route helpers', () => {
  test('modelRegistryOverviewProjectRouteHelper generates the correct project route', () => {
    const result = modelRegistryListViewProjectRouteHelper('exampleOwner', 'exampleProject')
    expect(result).toBe('/u/exampleOwner/exampleProject/model-registry')
  })

  test('modelRegistryOverviewProjectRoutePattern generates the correct project route pattern', () => {
    const result = modelRegistryListViewProjectRoutePattern
    expect(result).toBe('/u/:ownerName/:projectName/model-registry')
  })

  test('modelRegistryOverviewGlobalRoutePattern generates the correct global route pattern', () => {
    const result = modelRegistryListViewGlobalRoutePattern
    expect(result).toBe('/model-registry')
  })
})
