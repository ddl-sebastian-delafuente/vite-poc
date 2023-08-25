import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import { projectBase } from '@domino/ui/dist/core/routes';
import Link from '@domino/ui/dist/components/Link/Link';
import { DominoDatasetrwApiDatasetRwDetailsDto,
  DominoDatasetrwApiDatasetRwSummaryDto } from '@domino/api/dist/types';
  import { themeHelper } from '@domino/ui/dist/styled';

  
const ModalText = styled.div`
  margin-bottom: 20px;
`;
const WrapperContent = styled.div`
  margin: 0 ${themeHelper('margins.large')};
`;


export interface Props {
  dataset?: DominoDatasetrwApiDatasetRwDetailsDto | DominoDatasetrwApiDatasetRwSummaryDto;
}
const DeleteSingleDatasetContent: React.FC<Props> = ({dataset}) => {
  return (
    <WrapperContent>
      <ModalText>
        Are you sure you want to delete this dataset? This will permanently delete the dataset along with its content and snapshots. The dataset may remain available in currently running executions, but once these terminate, the dataset will no longer be available.
      </ModalText>
      <ModalText>
        The dataset is currently available in the following projects where it might be in use:
      </ModalText>
      {!!dataset && dataset.projects && <Link href={projectBase(dataset.projects.sourceProjectOwnerUsername, dataset.projects.sourceProjectName)} openInNewTab={true}>
        {dataset.projects.sourceProjectName}
      </Link>}
      {
        !R.isNil(dataset) && dataset.projects && (R.isEmpty(dataset.projects.sharedProjectNames) ? '' :
          dataset.projects.sharedProjectNames.map(
            (projectname: string, index: number) => {
              return [
                ', ',
                <Link key={dataset.id} href={projectBase(dataset.projects.sharedProjectOwnerUsernames[index], projectname)} openInNewTab={true}>
                  {projectname}
                </Link>
              ];
            }
          )
        )
      }
  </WrapperContent> 
  )
}
export default DeleteSingleDatasetContent;
