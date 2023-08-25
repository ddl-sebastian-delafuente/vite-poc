import * as React from 'react';
import styled from 'styled-components';
import { Col, Row, Tooltip } from 'antd';
import ExternalLink from '@domino/ui/dist/icons/ExternalLink';
import RepoCredentialsPicker, { OnSelectFn } from './RepoCredentialsPicker';
import LabelAndValue from '../../components/LabelAndValue';
import { colors } from '../../styled';
import { Repository } from '../types/filebrowserTypes';
import { useProjectCodeGitCredentialsContext } from './ProjectCodeGitCredentialsContextProvider';
import { success as toastrSuccess, error as toastrError } from '../../components/toastr';

const columnStyle: React.CSSProperties = { paddingRight: '20px' };
const valueStyles: React.CSSProperties = { color: colors.greyishBrown, lineHeight: '30px' };
const labelStyles: React.CSSProperties = { marginBottom: '4px' };
const tooltipLabelStyle: React.CSSProperties = {
  borderBottom: '1px dashed #a0a4a9',
  marginBottom: '4px'
};

export type RepoDetailsHeaderProps = {
  repository: Repository;
  serviceProvider: string;
};
const RepoDetailsHeader: React.FC<RepoDetailsHeaderProps> = ({ repository, serviceProvider }) => {
  const { setCredentialForRepo } = useProjectCodeGitCredentialsContext();
  const onCredentialSelect: OnSelectFn = async (newCredentialId: string) => {
    try {
      await setCredentialForRepo(repository.projectId, repository.id, newCredentialId);
      toastrSuccess(`Git credentials updated.`);
    } catch (e) {
      console.error('Failed to update git credentials.', e);
      toastrError('Failed to update git credentials.');
    }
  };

  return (
    <Wrapper>
      <Row gutter={16} style={{ display: 'flex' }}>
        <Col style={columnStyle}>
          <LabelAndValue
            labelStyles={labelStyles}
            valueStyles={valueStyles}
            label="Code Repository"
            // eslint-disable-next-line react/jsx-no-target-blank
            value={<a href={repository.url} target={'_blank'}>
              {repository.name}
              <LinkWrapper><ExternalLink /></LinkWrapper>
            </a>}
          />
        </Col>
        <Col style={columnStyle}>
          <LabelAndValue
            labelStyles={labelStyles}
            valueStyles={valueStyles}
            label="Mount Directory"
            value={repository.mountDir}
          />
        </Col>
        <Col style={columnStyle}>
          <LabelAndValue
            testId="credentials-picker"
            labelStyles={tooltipLabelStyle}
            label={<RepoCredentialsLabel />}
            value={<RepoCredentialsPicker
              onSelect={onCredentialSelect}
              repoId={repository.id}
              serviceProvider={serviceProvider}
            />}
          />
        </Col>
      </Row>
    </Wrapper>
  );
};
RepoDetailsHeader.displayName = 'RepoDetailsHeader';

export default RepoDetailsHeader;

const Wrapper = styled.div`
  &&& .ant-select-selector {
    color: rgb(72,72,72);
    box-shadow: none;
    .ant-select-selection-item {
      margin-top: 1px;
    }
  }
  .ant-select-open {
    box-shadow: 0 0 0 2px rgb(24 144 255 / 20%);
  }
  .ant-select-selection__rendered {
    // margin-left: 0px;
    line-height: 32px;
  }
  .warning-box {
    margin: 8px 0;
  }
`;

const LinkWrapper = styled.span`
padding-left: 6px;
position: relative;
top: 2px;
`;

const credentialsTooltipText =
  'Git credentials are user specified and not shared within a project. ' +
  'Git credential settings are declared in your user account settings area.';
const RepoCredentialsLabel: React.FC = () => (
  <Tooltip title={credentialsTooltipText}>{'Your Repo Credentials'}</Tooltip>
);
RepoCredentialsLabel.displayName = 'RepoCredentialsLabel';
