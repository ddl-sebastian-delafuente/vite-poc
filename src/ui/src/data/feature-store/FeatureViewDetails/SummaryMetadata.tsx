import {
  DominoFeaturestoreApiFeatureViewDto as FeatureViewDto
} from '@domino/api/dist/types';
import * as React from 'react';
import styled from 'styled-components';

import LabelAndValue from '../../../components/LabelAndValue';
import Link from '../../../components/Link/Link';
import { projectOverviewPage } from '../../../core/routes';
import { ProjectsUsingModal } from './ProjectsUsingModal';
import { humanizeDurationTimestamp } from '../utils';

const SummaryMetadataContainer = styled.div`
  display: flex;
`;

const SummaryMetadataColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 50%;
  justify-content: flex-start;
`;

type PickedFeatureViewProps =
  'createdAtMillis' |
  'entities' |
  'features' |
  'lastUpdatedMillis' |
  'projectsInfo'

export type SummaryMetadataProps = Pick<FeatureViewDto, PickedFeatureViewProps>

export const SummaryMetadata = ({
  createdAtMillis,
  entities,
  features,
  lastUpdatedMillis,
  projectsInfo,
}: SummaryMetadataProps) => {
  const entityList = React.useMemo(() => {
    if (entities.length === 0) {
      return '0';
    }

    return entities.map(({ name }) => name).join(', ');
  }, [entities]);

  const ownerProject = React.useMemo(() => {
    return projectsInfo?.find((project) => project.isOriginProject);
  }, [projectsInfo]);

  const otherProjects = React.useMemo(() => {
    return projectsInfo?.filter((project) => !project.isOriginProject) || [];
  }, [projectsInfo]);

  return (
    <SummaryMetadataContainer>
      <SummaryMetadataColumn>
        <LabelAndValue label="Last Updated" value={humanizeDurationTimestamp(lastUpdatedMillis)} />
        <LabelAndValue label="Origin Project" value={ownerProject && (
          <Link href={projectOverviewPage(ownerProject.ownerUsername, ownerProject.projectName)}>{ownerProject.projectName}</Link>
        )} />
        <LabelAndValue label="Features" value={features.length} />
        <LabelAndValue label="Other Projects Using" value={<ProjectsUsingModal projects={otherProjects} />} />
      </SummaryMetadataColumn>
      <SummaryMetadataColumn>
        <LabelAndValue label="Created" value={humanizeDurationTimestamp(createdAtMillis)} />
        <LabelAndValue label="Author" value={ownerProject && ownerProject.ownerUsername} />
        <LabelAndValue label="Entities" value={entityList} />
      </SummaryMetadataColumn>
    </SummaryMetadataContainer>
  )
}
