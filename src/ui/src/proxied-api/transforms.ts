import {
  DominoCommonGatewaySearchFeatureViewSearchResultDto as FeatureViewSearchResultDto,
  DominoFeaturestoreApiFeatureViewDto as FeatureViewDto,
} from '@domino/api/dist/types';

export const featureViewDto2FeatureViewSearchResultDto = ({
  author,
  createdAtMillis,
  entities,
  features,
  id,
  lastUpdatedMillis,
  name,
  projectsInfo,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  status,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ttl,
  ...rest
}: FeatureViewDto): FeatureViewSearchResultDto => ({
  ...rest,
  author: author || '',
  created: createdAtMillis,
  entities: entities.map(({ name }) => name),
  featureViewId: id,
  featureViewName: name,
  features: features.map(({ name }) => name),
  highlightInfo: {
    maybeHighlightedFeatureViewName: '',
    maybeHighlightedDescription: '',
    highlightedEntities: [],
    highlightedFeatures: [],
    highlightedTagKeys: [],
    highlightedTagValues: [],
    maybeHighlightedModelAuthor: ''
  },
  lastUpdated: lastUpdatedMillis,
  projectIds: projectsInfo.map(({ projectId }) => projectId),
})
