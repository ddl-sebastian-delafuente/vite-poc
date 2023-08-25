import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { connect, InferableComponentEnhancerWithProps } from 'react-redux';
import {
  DominoServerProjectsApiProjectGatewayOverview as Project,
  DominoProjectsApiProjectStageAndStatus as ProjectStageAndStatus
} from '@domino/api/dist/types';
import { CoreState } from './redux/reducer';
import { RootState } from './reducers/rootReducer';
import {
  setFetchFlagsRequested as setFetchFlagsRequestedAction,
  setProjectRequested as setProjectRequestedAction,
  setProject as setProjectAction,
  setProjectStageAndStatus as setProjectStageAndStatusAction,
  setWhiteLabelSettingsRequested as setWhiteLabelSettingsRequestedAction,
  setAreStagesStale as setAreStagesStaleAction,
  setGlobalSocket as setGlobalSocketAction,
  setCurrentUserRequested as setCurrentUserRequestedAction
} from './redux/actions';
import { getMatchResult } from './redux/fetchProject';

export interface DispatcherProps {
  setFetchFlagsRequested: () => void;
  setProjectRequested: () => void;
  setProjectAction: (p: Project) => void;
  setProjectStageAndStatusAction: (projectStageAndStatus: ProjectStageAndStatus) => void;
  setWhiteLabelSettingsRequested: () => void;
  setAreStagesStaleAction: (areStagesStale: boolean) => void;
  setGlobalSocket: (socket?: SocketIOClient.Socket) => void;
  setCurrentUserRequested: () => void;
}

export interface ComponentProps extends RouteComponentProps<any> {
  children: (state: CoreState) => JSX.Element;
}
export interface Params {
  ownerName: string;
  projectName: string;
}

export type FlagManagerProviderProps = DispatcherProps & CoreState & ComponentProps;

export const isFlagFetched = (coreState: CoreState) => coreState.fetched !== undefined;

export const isCurrentUserFetched = (coreState: CoreState) => coreState.fetchedCurrentUser !== undefined;

export const isProjectFetching = (coreState: CoreState) =>
  coreState.fetchedOps !== undefined && coreState.fetchedOps !== 'inflight';

/**
 * Fetches flags and passes them to the child component rendered by the children function prop
 * Only fetches flags if never fetched successfully
 * Is a container that is attached to central state (redux)
 */
class FlagManagerProvider extends React.PureComponent<FlagManagerProviderProps> {
  UNSAFE_componentWillMount() {
    // only fetch failed or it hasn't been fetched.
    if (!isFlagFetched(this.props)) {
      this.props.setFetchFlagsRequested();
    }
    if (!isProjectFetching(this.props)) {
      this.handleFetchProject()(this.props.setProjectRequested);
      if (this.props.fetchedWhitelabelConfig !== 'inflight') {
        this.props.setWhiteLabelSettingsRequested();
      }
    }
    if (!isCurrentUserFetched(this.props)) {
      this.props.setCurrentUserRequested();
    }
  }

  componentDidUpdate(prevProps: FlagManagerProviderProps) {
    this.handleFetchProject(prevProps)(this.props.setProjectRequested);
  }

  handleFetchProject = (prevProps?: FlagManagerProviderProps) => (projectFetcher: () => void) => {
    const defaultMatch = { params: { ownerName: '', projectName: '' } };
    // We have to use matchPath as we dont have any routes available at this level of the app
    // Each route comes in the tree below the flagprovider and also could have different patterns and unreliable
    const match = getMatchResult(this.props.history) || defaultMatch;
    const { ownerName, projectName } = match.params;
    if (prevProps) {
      const prevMatch =  getMatchResult(prevProps) || defaultMatch;
      const prevParams = prevMatch.params;
      if (!ownerName && !projectName) {
        // There are routes outside of project (eg: /launchpad) that need not wait for projectFetcher to complete,
        // basically these routes would not have ownerName or projectName
        return;
      } else if (ownerName !== prevParams.ownerName || projectName !== prevParams.projectName) {
        projectFetcher();
      }
    } else if (ownerName && projectName) {
      projectFetcher();
    }
  }

  render() {
    return this.props.children(this.props);
  }
}

function mapStateToProps(state: RootState): CoreState {
  return state.core;
}

function mapDispatchToProps(dispatch: any): DispatcherProps {
  return {
    setFetchFlagsRequested: () => {
      dispatch(setFetchFlagsRequestedAction());
    },
    setProjectRequested: () => {
      dispatch(setProjectRequestedAction());
    },
    setProjectAction: (project: Project) => {
      dispatch(setProjectAction(project));
    },
    setProjectStageAndStatusAction: (projectStageAndStatus: ProjectStageAndStatus) => {
      dispatch(setProjectStageAndStatusAction(projectStageAndStatus));
    },
    setWhiteLabelSettingsRequested: () => {
      dispatch(setWhiteLabelSettingsRequestedAction());
    },
    setAreStagesStaleAction: (areStagesStale: boolean) => {
      dispatch(setAreStagesStaleAction(areStagesStale));
    },
    setGlobalSocket: (socket?: SocketIOClient.Socket) => {
      dispatch(setGlobalSocketAction(socket));
    },
    setCurrentUserRequested: () => {
      dispatch(setCurrentUserRequestedAction());
    }
  };
}

export const withFlagManagerProvider: InferableComponentEnhancerWithProps<CoreState & DispatcherProps, ComponentProps> =
  connect<CoreState, DispatcherProps, ComponentProps>(
    mapStateToProps,
    mapDispatchToProps
  );

const theProvider: any = withFlagManagerProvider(withRouter(FlagManagerProvider));

export default theProvider;
