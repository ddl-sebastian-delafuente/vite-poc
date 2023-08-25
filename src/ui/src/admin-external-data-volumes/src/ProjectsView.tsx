import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import {
  DominoProjectsApiProjectSummary as Project
} from '@domino/api/dist/types';
import { projectBase } from '../../core/routes';
import Link from '../../components/Link/Link';

const StyledLink = styled(Link)`
  && {
    display: inline;
  }
`;
const filterProjects = (allProjects: Project[], projectIds: string[]) =>
  R.filter(R.complement(R.isNil), R.map((id: string) => R.find(R.propEq('id', id))(allProjects))(projectIds));

export interface Props {
  allProjects: Project[];
  projectIds?: string[];
}

const ProjectsView: React.FunctionComponent<Props> = props => {

  const { allProjects, projectIds } = props;
  const filteredProjects = filterProjects(allProjects, R.defaultTo([])(projectIds));
  return (
    <div>
      {
        (R.isNil(projectIds) || R.isEmpty(projectIds)) ? '--' :
          R.intersperse(', ',  R.map<Project, React.ReactNode>(
            (project: Project) => (
              <StyledLink
                key={project.id}
                href={projectBase(project.ownerUsername, project.name)}
              >
                {project.name}
              </StyledLink>
            )
          )(filteredProjects))
      }
    </div>
  );
};

export default ProjectsView;
