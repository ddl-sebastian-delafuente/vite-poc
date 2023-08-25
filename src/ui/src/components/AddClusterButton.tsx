import * as React from 'react';
import * as R from 'ramda';
import { withRouter, RouteComponentProps } from 'react-router';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
// eslint-disable-next-line no-restricted-imports
import { Button } from 'antd';
import styled from 'styled-components';
import { ClusterIcon } from './Icons';
import { colors } from '../styled';
import Link from './Link/Link';
import { projectRoutes } from '../navbar/routes';
import { getProjectSettings } from '@domino/api/dist/Projects';
import { themeHelper } from '../styled/themeUtils';

const DashButton = styled((props) => <Button {...props} />)`
  width: 100%;
  margin: 0;
  color: ${colors.btnDarkBlue} !important;
  border-color: ${colors.btnDarkBlue} !important;
  background: ${colors.transparent} !important;
  border-radius: ${themeHelper('borderRadius.standard')};
`;

const ActionButtonWrapper = styled.div`
  display: flex;

  .anticon svg {
    height: 25px;
    width: 25px;
    padding: 0 2px;
    cursor: pointer;
  }
`;

const Wrapper = styled.div`
  line-height: 25px;
  margin: 0 20px 0 10px;
`;

const TextWrapper = styled.span`
  border-bottom: 1px dashed ${colors.logColor};
  padding-bottom: 2px;
`;

const FlexWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const InfoWrapper = styled.div`
  font-size: ${themeHelper('fontSizes.SMALL')};
  margin-top: 5px;
  margin-left: 30px;
  line-height: 18px;

  a {
    font-size: ${themeHelper('fontSizes.SMALL')};
    margin-left: 10px;
  }
`;

export interface Props extends RouteComponentProps<MatchParams> {
  projectId: string;
  clusterAdded: boolean;
  workerCount?: number;
  onClick: () => void;
  onEditCluster: () => void;
  onDeleteCluster: () => void;
}

export interface State {
  sparkClusterMode?: 'Local' | 'Standalone' | 'Yarn' | 'OnDemand';
}

export interface MatchParams {
  ownerName: string;
  projectName: string;
}

class AddClusterButton extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const { projectId } = this.props;
    const projectSettings = await getProjectSettings({ projectId });
    if (projectSettings) {
      this.setState({
        sparkClusterMode: projectSettings.sparkClusterMode
      });
    }
  }

  render() {
    const { clusterAdded, workerCount, onClick, onEditCluster,
      onDeleteCluster, match } = this.props;
    const { sparkClusterMode } = this.state;
    const ownerName = match.params.ownerName;
    const projectName = match.params.projectName;
    return clusterAdded ?
  (
    <FlexWrapper className="spark-cluster-container">
      <ClusterIcon height={20} width={20} />
      <Wrapper>
        <TextWrapper>
          {`Spark Cluster: ${workerCount} workers`}
        </TextWrapper>
      </Wrapper>
      <ActionButtonWrapper>
        <EditOutlined onClick={onEditCluster} />
        <DeleteOutlined onClick={onDeleteCluster} />
      </ActionButtonWrapper>
    </FlexWrapper>
  ) :
  (sparkClusterMode === 'OnDemand') || (R.isNil(sparkClusterMode)) ?
    (
      <DashButton
        onClick={onClick}
        icon={'plus'}
        type={'dashed'}
        data-test={'add-cluster-button'}
      >
        Attach Cluster
      </DashButton>
    ) :
    (
      <div className="spark-cluster-container">
        <FlexWrapper>
          <ClusterIcon height={20} width={20} />
          <Wrapper>
            <TextWrapper>
              {`Spark Cluster: ${sparkClusterMode} mode`}
            </TextWrapper>
          </Wrapper>
        </FlexWrapper>
        <InfoWrapper>This setting can be change under
          <Link href={`${projectRoutes.children.SETTINGS_INTEGRATION.path(ownerName, projectName)}`}>
            Project Settings
          </Link>
        </InfoWrapper>
      </div>
    );
  }
}

export default withRouter(AddClusterButton);
