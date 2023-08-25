import * as React from 'react';
import {
  getProviderList
} from '@domino/api/dist/Accounts';
import {
  DominoProjectsApiRepositoriesGitProviderDto as GitProviderDto
} from '@domino/api/dist/types';

type WrapperStateProps = {
  gitServiceProviders: GitProviderDto[]
};

const GitServiceProviderWrapper = (WrappedComponent: React.ComponentType<any>) =>
  class ProvidersWrapper extends React.Component<any, WrapperStateProps> {
    constructor(props: any) {
      super(props);
      this.state = {gitServiceProviders: []};
    }

    async componentDidMount() {
      this.setState({gitServiceProviders: (await getProviderList({})).providers});
    }

    render() {
      return (
        <React.Fragment>
          <WrappedComponent
            {...this.props}
            gitServiceProviders={this.state.gitServiceProviders}
          />
        </React.Fragment>
      );
    }
  };

  export default GitServiceProviderWrapper;
