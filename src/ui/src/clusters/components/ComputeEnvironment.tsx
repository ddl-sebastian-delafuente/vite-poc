import * as React from 'react';
import styled from 'styled-components';
import * as R from 'ramda';
import { InfoCircleOutlined } from '@ant-design/icons';
import {
  DominoProjectsApiProjectEnvironmentDto as Environment,
  DominoProjectsApiUseableProjectEnvironmentsDto as ProjectEnvironments
} from '@domino/api/dist/types';
import { DDFormItem } from '../../components/ValidatedForm';
import ComputeEnvironmentDropdown from '../../components/ComputeEnvironmentDropdown';
import ComputeEnvironmentRevisionFormItem from '../../components/ComputeEnvironmentRevisionFormItem';
import FlexLayout from '../../components/Layouts/FlexLayout';
import HelpLink from '../../components/HelpLink';
import { colors, fontSizes } from '../../styled';
import { themeHelper } from '../../styled/themeUtils';
import { CLUSTER_COMPUTE_ENVIRONMENT_HELP_TEXT } from '../../constants';
import { EnvRevision, getFormattedRevision } from '../../components/utils/envUtils';

const EnvironmentDropdownWrapper = styled.div`
  .ant-legacy-form-explain {
    padding: 10px 5px;
  }
  .ant-row {
    margin-bottom: 0 !important;
  }
`;

const StyledDDFormItem = styled(DDFormItem)`
  margin-bottom: 0 !important;

  & .select-compute-env {
    height: 36px;
  }
`;

const ComputeEnvironmentHelpTextWrap = styled(FlexLayout)`
  margin-top: ${themeHelper('margins.tiny')};
`;

const ComputeEnvironmentHelpText = styled.div`
  margin: 0 0 ${themeHelper('margins.tiny')} 13px;
  font-size: ${themeHelper('fontSizes.tiny')};
  line-height: 14px;
  color: ${colors.boulder};
  width: calc(100% - 35px);
`;

const ComputeEnvironmentErrorInfo = styled.span`
  color: ${colors.torchRed};
`;

const ComputeClusterHelpLink = styled(HelpLink)`
  margin-left: 4px;
  font-size: inherit;
`;

export interface ComputeEnvironmentProps {
  projectId: string;
  environmentId?: string;
  label: string;
  testId?: string;
  clusterType: string;
  clusterHelpLink: string;
  clusterEnvironments: Array<Environment>;
  projectEnvironments?: ProjectEnvironments;
  onChange: (newId: string) => void;
  getContainer?: () => HTMLElement;
  onClusterEnvRevisionChange: (revision: EnvRevision) => void;
  computeRevisionSpec?: string;
  enableEnvironmentRevisions?: boolean;
  revTestId?: string;
  hideDefaultRevisionOptions?: boolean;
  isRestrictedProject?: boolean;
}

const ComputeEnvironment = (props: ComputeEnvironmentProps) => {
  const [revision, setRevision] = React.useState<string | undefined>();

  React.useEffect(() => {
    setRevision(props.computeRevisionSpec);
  }, [props.computeRevisionSpec]);

  const handleEnvChange = (rev: string) => {
    setRevision(rev);
    if (props.onClusterEnvRevisionChange) {
      props.onClusterEnvRevisionChange(getFormattedRevision(rev));
    }
  }

  return (
    <EnvironmentDropdownWrapper>
      <ComputeEnvironmentRevisionFormItem
        label={props.label}
        dashedUnderline={true}
        tooltip={CLUSTER_COMPUTE_ENVIRONMENT_HELP_TEXT}
        formItem={StyledDDFormItem}
        enableEnvironmentRevisions={props.enableEnvironmentRevisions && !props.isRestrictedProject}
        onChangeRevision={props.onClusterEnvRevisionChange}
        revisionSpec={revision}
        revTestId={props.revTestId}
        environmentId={props.environmentId}
      >
        <ComputeEnvironmentDropdown
          getContainer={props.getContainer}
          projectId={props.projectId}
          updateProjectEnvironmentOnSelect={false}
          onChangeEnvironment={R.pipe(R.prop('id'), props.onChange)}
          canEditEnvironments={false}
          isControlled={!(R.isNil(props.environmentId) || R.isEmpty(props.environmentId))}
          canSelectEnvironment={true}
          shouldEnvironmentBeInSyncWithProject={false}
          testId={props.testId || 'cluster-environment'}
          environmentId={props.environmentId}
          clusterType={props.clusterType}
          clusterEnvironments={props.clusterEnvironments}
          projectEnvironments={props.projectEnvironments}
          handleEnvChange={handleEnvChange}
          isRestrictedProject={props.isRestrictedProject}
        />
      </ComputeEnvironmentRevisionFormItem>
      {
        !R.isEmpty(props.clusterEnvironments) &&
        <ComputeEnvironmentHelpTextWrap justifyContent="flex-start" alignItems="flex-start">
          <InfoCircleOutlined
            style={{
              fontSize: fontSizes.MEDIUM,
              color: R.isEmpty(props.clusterEnvironments) ? colors.torchRed : colors.boulder,
              marginRight: 0
            }} />
          <ComputeEnvironmentHelpText>
            {R.isEmpty(props.clusterEnvironments) ?
              <ComputeEnvironmentErrorInfo>
                There are no {props.clusterType} enabled Environments available. Please add one to continue.
              </ComputeEnvironmentErrorInfo> :
              <>
                Your workspace environment must have the correct {props.clusterType} Client libraries to interact
                with this cluster.
                <ComputeClusterHelpLink
                  text="Read more"
                  articlePath={props.clusterHelpLink}
                  showIcon={false}
                />
              </>
            }
          </ComputeEnvironmentHelpText>
        </ComputeEnvironmentHelpTextWrap>
      }
    </EnvironmentDropdownWrapper>
  );
};

export default ComputeEnvironment;
