import * as React from 'react';
import * as R from 'ramda';
import { findProjectByOwnerAndName } from '@domino/api/dist/Gateway';
import {
  DominoServerProjectsApiProjectGatewayOverview as Project
} from '@domino/api/dist/types';
import { RouteComponentProps } from 'react-router';

const getOwnername: (ps: OuterProps) => string | undefined = R.path(['match', 'params', 'ownerName']);
const getProjectname: (ps: OuterProps) => string | undefined = R.path(['match', 'params', 'projectName']);

export type RouteMatcherProps = RouteComponentProps<{
  ownerName?: string;
  projectName?: string;
}>;
export type OuterProps = { onStateChange?: (state: any) => void; } & RouteMatcherProps;
export type ChildProps<P> = P & {
  onStateChange?: (state: any) => void;
  project?: Project;
  projectId?: string;
  projectFetchFailure?: any;
};

export const withProjectFetching = <T extends ChildProps<OuterProps> & {}>(
  Component: React.FC<ChildProps<T>> | React.ComponentClass<ChildProps<T>> | React.ComponentType<ChildProps<T>>
) => (props: T) => {
  const [project, setProject] = React.useState<Project>();
  const [projectFetchFailure, setProjectFetchFailure] = React.useState<any>();

  const fetchProjectDetails = async () => {
    const ownerName = getOwnername(props);
    const projectName = getProjectname(props);
    try {
      if (R.isNil(props.project) || R.isNil(props.projectId)) {
        if (Boolean(projectName) && Boolean(ownerName)) {
          const response = await findProjectByOwnerAndName({ ownerName: ownerName!, projectName: projectName! });
          setProject(response);
        }
      }
    } catch (error) {
      console.error(error);
      setProjectFetchFailure(error);
    }
  };
  
  React.useEffect(() => {
    fetchProjectDetails();
  }, []);

  return (
    R.isNil(props.project) && Boolean(project) ? (
      <Component
        {...props}
        project={project}
        projectId={project!.id === props.projectId ? props.projectId : project!.id}
        projectFetchFailure={projectFetchFailure}
      />
    ) : (
      <Component {...props} />
    )
  );
};

export default withProjectFetching;
