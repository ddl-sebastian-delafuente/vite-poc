import {
  DominoFeaturestoreApiFeatureViewProjectInfoDto as FeatureViewProjectInfoDto,
} from '@domino/api/dist/types';
import * as React from 'react';
import styled from 'styled-components';

import Link from '../../../components/Link/Link';
import Modal from '../../../components/Modal';
import { projectOverviewPage } from '../../../core/routes';

const TITLE_TEXT = 'Projects using this Feature View';

const ProjectList = styled.div`
 & > *:not(:last-child):after {
  content: ', ';
 }
`

export interface ProjectsUsingModalProps {
  projects: FeatureViewProjectInfoDto[];
}

export const ProjectsUsingModal = ({
  projects
}: ProjectsUsingModalProps) => {
  const [visible, setVisible] = React.useState(false);

  const showModal = React.useCallback(() => setVisible(true), [setVisible]);
  const hideModal = React.useCallback(() => setVisible(false), [setVisible]);

  const countText = React.useMemo(() => {
    if (projects.length === 0) {
      return '0 projects';
    }

    if (projects.length === 1) {
      return '1 project';
    }

    return `${projects.length} projects`;
  }, [projects])

  return (
    <>
      <Modal
        hideCancelButton
        okText="Close Window"
        onOk={hideModal}
        onCancel={hideModal}
        titleIconName="DataIcon"
        titleText={TITLE_TEXT}
        visible={visible}
      >
        <div>{TITLE_TEXT}</div>
        <ProjectList>
          {projects.map((project) => (
            <Link key={project.projectId} href={projectOverviewPage(project.ownerUsername, project.projectName)}>{project.projectName}</Link>
          ))}
        </ProjectList>
      </Modal>
      <span onClick={showModal}>{countText}</span>
    </>
  );
}
