import * as React from 'react';
import * as R from 'ramda';
import { findProjectByOwnerAndName } from '@domino/api/dist/Gateway';
import {
  DominoServerProjectsApiProjectGatewayOverview as Project,
} from '@domino/api/dist/types';
import { StaticContext, RouteComponentProps } from 'react-router';

const getOwnername: (ps: OuterProps) => string | undefined = R.path(['match', 'params', 'ownerName']);
const getProjectname: (ps: OuterProps) => string | undefined = R.path(['match', 'params', 'projectName']);

type RouteMatcherProps = RouteComponentProps<{
  ownerName?: string;
  projectName?: string;
}>;
type OuterProps = { onStateChange?: (state: any) => void; } & RouteMatcherProps;
type ChildProps = {
  onStateChange?: (state: any) => void;
  project?: Project;
  projectId?: string;
  projectFetchFailure?: any;
};

const projectSectionProjectFetcher = <T extends object>(Component: React.ComponentType<T>) => 
(props: T & OuterProps) => {
  const [project, setProject] = React.useState<Project>();
  const [projectFetchFailure, setProjectFetchFailure] = React.useState<any>();

  React.useEffect(() => {
    async function findProjectByOwnerAndProjectName() {
      const ownerName = getOwnername(props);
      const projectName = getProjectname(props);
      try {
        if (!!projectName && !!ownerName) {
          const projectInfo = await findProjectByOwnerAndName({ ownerName, projectName });
          setProject(projectInfo);
        }
      } catch (error) {
        console.error(error);
        setProjectFetchFailure(error);
      }
    }
    findProjectByOwnerAndProjectName();
  }, []);

  return (
    <Component 
      {...props as T}
      project={project}
      projectFetchFailure={projectFetchFailure}
    />
  );
};

function withProjectToMapping<Out extends {}>(
    projectMapper: (project: Project) => Out
  ): (Component: any) => (props: { project?: Project }) => JSX.Element {
  return Component => ({ project, ...props }) => {
    const mappedToProps = project ? projectMapper(project) : {};
    return (
      <Component
        {...props}
        {...mappedToProps}
      />
    );
  };
}

export {
  withProjectToMapping,
  RouteMatcherProps,
  StaticContext,
  ChildProps,
  OuterProps,
};

export default projectSectionProjectFetcher;
