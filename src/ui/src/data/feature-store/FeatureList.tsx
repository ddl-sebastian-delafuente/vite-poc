import {
  DominoCommonGatewaySearchFeatureViewSearchResultDto as FeatureViewSearchResultDto,
} from '@domino/api/dist/types';
import * as React from 'react';
import styled from 'styled-components';

import Card from '../../components/Card/Card';
import RouteLink from '../../components/Link/RouteLink';
import LabelAndValue, { Label, LabelValue } from '../../components/LabelAndValue';
import {
  globalFeatureStoreFeatureViewPath,
} from '../../core/routes';
import { themeHelper } from '../../styled/themeUtils';
import { UnionToMap } from '../../utils/typescriptUtils';
import { KeyValueTags } from '../KeyValueTags';
import { highlightText } from '../search.utils';
import { AddToProjectButton } from './FeatureList/AddToProjectButton';
import { humanizeDurationTimestamp } from './utils';

const CardContainer = styled.div`
  & > a {
    margin-bottom: 16px;
  }
`;

const FeatureMetadataTop = styled.div`
  display: flex;
  justify-content: space-between;
`;

const FeatureMetadataMid = styled.div`
  display: flex;
  justify-content: flex-start;

  // Added By
  & > .added-by {
    flex: 0 0 150px;
  }

  // last updated
  & > .last-updated {
    flex: 0 0 100px;
  }

  // created
  & > .created-at {
    flex: 0 0 100px;
  }

  // Project Count
  & > .project-count {
    flex: 0 0 100px;

    & > div {
      align-items: flex-end;
      display: flex;
      flex-diration: row;

      & > div:first-child {
        margin-right: 0;
      }
    }
  }

  // Features
  & > .feature-list {
    flex: 1;
  }

  // Add to project link
  & > .controls {
    align-items: flex-start;
    display: flex;
    flex: 0 0 110px;
    // No Margin matches this size
    margin-left: 10px;
    margin-top: ${themeHelper('margins.small')};
    width: 110px;
  }
`;

const FeatureMetadataBottom= styled.div`
  display: flex;
  flex-direction: column;

  & > div {
    display: flex;

    & > div:first-child {
      width: 150px;
    }

    & > div:last-child {
      flex: 1;
    }
  }
`;

const StyledRouteLink = styled(RouteLink)`
  display: block;

  &:hover {
    text-decoration: none;
  }
`;

export type VisibleMetadata =
  'addedBy' |
  'controls' |
  'createdAt' |
  'featureList' |
  'projectCount' |
  'updatedAt';
export const VisibleMetadata: UnionToMap<VisibleMetadata> = {
  addedBy: 'addedBy',
  controls: 'controls',
  createdAt: 'createdAt',
  featureList: 'featureList',
  projectCount: 'projectCount',
  updatedAt: 'updatedAt'
};

const GLOBAL_METADATA_TO_DISPLAY: VisibleMetadata[] = [
  VisibleMetadata.updatedAt,
  VisibleMetadata.createdAt,
  VisibleMetadata.projectCount,
  VisibleMetadata.featureList,
];

export const PROJECT_METADATA_TO_DISPLAY: VisibleMetadata[] = [
  VisibleMetadata.addedBy,
  VisibleMetadata.updatedAt,
  VisibleMetadata.createdAt,
  VisibleMetadata.projectCount,
  VisibleMetadata.featureList,
]

export interface FeatureCardProps {
  featureView: FeatureViewSearchResultDto;
  metadataToDisplay?: VisibleMetadata[];
  projectId?: string;
  searchTerm?: RegExp;
  shouldShowAddToProjectControl?: boolean;
}

const makeTruncatedList = (list: string[], cutoff = 3) => {
  if (list.length <= cutoff) {
    return list.join(', ');
  }

  const listSubset = list.slice(0, cutoff);
  return `${listSubset.join(', ')} and ${list.length - cutoff} more`;
}

export const FeatureCard = ({
  featureView,
  metadataToDisplay = [],
  projectId,
  searchTerm,
  shouldShowAddToProjectControl,
}: FeatureCardProps) => {
  const {
    created,
    description,
    entities,
    features,
    lastUpdated,
    featureViewId,
    featureViewName,
    projectIds,
    tags,
  } = featureView;

  const [showAddProjectLink, setShowAddProjectLink] = React.useState(false);
  const [holdControls, setHoldControls] = React.useState(false);

  const addedBy = '';

  const entityList = React.useMemo(() => makeTruncatedList(entities), [entities]);
  const featureList = React.useMemo(() => makeTruncatedList(features), [features]);

  const resolvedMetadataToDisplay = React.useMemo(() => {
    if (metadataToDisplay.length > 0) {
      return metadataToDisplay;
    }

    return !shouldShowAddToProjectControl ? PROJECT_METADATA_TO_DISPLAY : GLOBAL_METADATA_TO_DISPLAY;
  }, [ metadataToDisplay, shouldShowAddToProjectControl ]);

  const handleHideAddToProject = React.useCallback(() => {
    if (shouldShowAddToProjectControl && !holdControls) {
      setShowAddProjectLink(false);
    }
  }, [holdControls, setShowAddProjectLink, shouldShowAddToProjectControl]);

  const handleModalClosed = React.useCallback(() => {
    setHoldControls(false);
    setShowAddProjectLink(false);
  }, [setHoldControls, setShowAddProjectLink]);

  const handleModalRaised = React.useCallback(() => {
    setHoldControls(true);
  }, [setHoldControls]);

  const handleShowAddToProject = React.useCallback(() => {
    if (shouldShowAddToProjectControl) {
      setShowAddProjectLink(true);
    }
  }, [setShowAddProjectLink, shouldShowAddToProjectControl]);

  const uri = React.useMemo(() => {
    return globalFeatureStoreFeatureViewPath({ featureViewId });
  }, [
    featureViewId,
  ]);

  const visibleMetadata = React.useMemo(() => {
    return resolvedMetadataToDisplay.map((metadataId) => {
      switch(metadataId) {
        case VisibleMetadata.addedBy:
          return (
            <div className="added-by" key={metadataId}>
              <LabelAndValue label="Added By" value={addedBy}/>
            </div>
          );
        case VisibleMetadata.createdAt:
          return (
            <div className="created-at" key={metadataId}>
              <LabelAndValue label="Created" value={humanizeDurationTimestamp(created)}/>
            </div>
          );
        case VisibleMetadata.featureList:
          return (
            <div className="feature-list" key={metadataId}>
              <LabelAndValue label="Features" value={highlightText(featureList, searchTerm)}/>
            </div>
          );
        case VisibleMetadata.updatedAt:
          return (
            <div className="last-updated" key={metadataId}>
              <LabelAndValue label="Last Updated" value={humanizeDurationTimestamp(lastUpdated)}/>
            </div>
          );
        case VisibleMetadata.projectCount:
          return (
            <div className="project-count" key={metadataId}>
              <LabelAndValue label="# Projects" value={projectIds.length}/>
            </div>
          );
        default:
          return null;
      }
    }).filter(Boolean);
  }, [
    addedBy,
    created,
    featureList,
    lastUpdated,
    projectIds,
    resolvedMetadataToDisplay,
    searchTerm,
  ]);

  return (
    <StyledRouteLink to={uri}>
      <Card
        width="100%"
        onMouseEnter={handleShowAddToProject}
        onMouseLeave={handleHideAddToProject}
      >
        <FeatureMetadataTop>
          <div>{highlightText(featureViewName, searchTerm)}</div>
          <div><KeyValueTags searchTerm={searchTerm} tags={tags}/></div>
        </FeatureMetadataTop>
        <FeatureMetadataMid>
          {visibleMetadata}
          <div className="controls">{showAddProjectLink && (
            <AddToProjectButton
              featureViewId={featureView.featureViewId}
              onModalClosed={handleModalClosed}
              onModalRaised={handleModalRaised}
              projectId={projectId}
            />
          )}</div>
        </FeatureMetadataMid>
        <FeatureMetadataBottom>
          {description && (
            <div>
              <Label>Description</Label>
              <LabelValue>{highlightText(description, searchTerm)}</LabelValue>
            </div>
          )}
          {entities.length > 0 && (
            <div>
              <Label>Entities</Label>
              <LabelValue>{highlightText(entityList, searchTerm)}</LabelValue>
            </div>
          )}
        </FeatureMetadataBottom>
      </Card>
    </StyledRouteLink>
  );
}

export interface FeatureListProps extends
  Pick<FeatureCardProps, 'metadataToDisplay' | 'projectId' | 'shouldShowAddToProjectControl'> {
  featureViews: FeatureViewSearchResultDto[];
  searchTerm?: string;
}

export const FeatureList = ({
  featureViews,
  metadataToDisplay = [],
  projectId,
  shouldShowAddToProjectControl,
  ...props
}: FeatureListProps) => {
  const searchTerm = React.useMemo(() => {
    if (!props.searchTerm) {
      return undefined;
    }

    return new RegExp(`(${props.searchTerm})`, 'gi');
  }, [props.searchTerm])

  return (
    <CardContainer>
      {featureViews.map(featureView =>
        <FeatureCard
          featureView={featureView}
          key={featureView.featureViewId}
          metadataToDisplay={metadataToDisplay}
          projectId={projectId}
          searchTerm={searchTerm}
          shouldShowAddToProjectControl={shouldShowAddToProjectControl}
        />
      )}
    </CardContainer>
  )
}
