import * as React from 'react';
import styled from 'styled-components';
import * as R from 'ramda';
// eslint-disable-next-line no-restricted-imports
import { Tag, Menu, Dropdown } from 'antd';
import type { MenuInfo, MenuItemType } from 'rc-menu/lib/interface';
import moment from 'moment';
import { DownOutlined } from '@ant-design/icons';
import {
  DominoEnvironmentsApiEnvironmentDetails as UserEnvironments,
  DominoEnvironmentsApiRevisionSummary as EnvRevisionSummaryDto
} from '@domino/api/dist/types';
import * as colors from '@domino/ui/dist/styled/colors';
import { DDFormItem } from './ValidatedForm';
import Link from './Link/Link';
import FlexLayout from './Layouts/FlexLayout';
import { themeHelper } from '..';
import {
  EnvRevision, fetchEnvironmentRevisions, fetchEnvironmentById,
  getFormattedRevision, getSelectedRevision, ACTIVE_REVISION
} from './utils/envUtils';
import { fontWeights } from '../styled';
import tooltipRenderer from './renderers/TooltipRenderer';

const Wrapper = styled.div`
  .ant-legacy-form-item-label > label > span {
    width: 100% !important;
  }
`;
const StyledIcon = styled(DownOutlined)`
  svg {
    height: 15px;
  }
`;
const LabelLayout = styled(FlexLayout)`
  cursor: pointer;
  width: 100%;
  .ant-legacy-form-item {
    margin: 0;
  }
`;
const RevisionWrapper = styled.div`
  width: 20%;
  margin: 0;
  padding-left: 0;
  .ant-row {
    padding:  0 0 0 5px !important;
  }
`;
const StyledDropdown = styled(Dropdown)`
  height: 36px;
  color: ${colors.lightBlackTwo};
  transition: border-color .3s;
`;
const GroupList = styled.span`
  color: ${colors.mediumGrey};
  font-size: ${themeHelper('fontSizes.tiny')};
`;
const RevisionStyle = styled.div`
  background: ${colors.white};
  border: 1px solid ${colors.pinkishGrey};
  height: 36px;
  border-radius: ${themeHelper('borderRadius.standard')};
  padding: 0 ${themeHelper('paddings.small')};
  color: ${colors.greyishBrown};
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  :hover, :focus, :focus-visible {
    outline: 0;
    border-color: ${colors.lightDodgerBlue};
  }
`;
const StyledText = styled.div`
  color: ${colors.mediumGrey};
  font-size: ${themeHelper('fontSizes.tiny')};
  font-weight: ${themeHelper('fontWeights.normal')};
`;
const StyledLink = styled(Link)`
  font-size: ${themeHelper('fontSizes.tiny')};
  font-weight: ${themeHelper('fontWeights.normal')};
`;
const StyledInfo = styled.li`
  padding: 0;
  line-height: 16px;
  font-size: ${themeHelper('fontSizes.tiny')};
  color: ${colors.mediumGrey};
`;
const EnvironmentWrapper = styled.div<{ showRevisions?: boolean, forWorkspaces?: boolean, enableEnvironmentRevisions?: boolean }>`
  width: ${({ showRevisions }) => showRevisions ? '80%' : '100%'};
  margin: 0;
  .ant-row {
    padding: ${({ showRevisions, forWorkspaces }) => forWorkspaces ? (showRevisions ? '0 5px 0 0' : '0 ') :
    (showRevisions ? '0 5px 0 0' : 0)} !important;
  }
  .ant-legacy-form-item-no-colon {
    ${({ enableEnvironmentRevisions }) => enableEnvironmentRevisions ? 'width: 100%' : 'display: inline-block'
  }
`;
const EnvText = styled.div<{ dashedUnderline?: boolean, forWorkspaces?: boolean }>`
  border-bottom: ${({ dashedUnderline }) => dashedUnderline ? '1px dashed #525252' : 0};
  line-height: ${({ forWorkspaces }) => forWorkspaces ? '14' : '18'}px;
  margin-bottom: ${({ forWorkspaces }) => forWorkspaces ? 0 : '6'}px;
`;
const StyledMenu = styled(Menu)`
  ul {
    margin: 0;
  }
`;

const selectedStyled = { backgroundColor: colors.zumthor, fontWeight: fontWeights.MEDIUM };

const renderRevisionMenuItems = (revisions: EnvRevisionSummaryDto[],
  environment: UserEnvironments,
  onRevisionChange: (clickParam: MenuInfo) => void,
  selectedRevision?: string) => {
  const activeRevisionId = R.pathOr(undefined, ['selectedRevision', 'id'], environment);
  const activeRevision: EnvRevisionSummaryDto[] = R.filter((revision) => R.equals(revision.id, activeRevisionId), revisions);
  const nonActiveRevisions: EnvRevisionSummaryDto[] = R.filter((revision) => !R.equals(revision.id, activeRevisionId), revisions);
  const restrictedRevisionId = environment.restrictedRevision?.id;
  const isRestricted = environment.restrictedRevision?.isRestricted;
  return (
    <StyledMenu
      style={{ maxHeight: '245px', overflow: 'auto' }}
      onClick={onRevisionChange} data-test="environment-revision-menu"
      items={[
        {
          key: 'recommended revision',
          label: <GroupList>Recommended revision</GroupList>,
          type: 'group',
          children: R.map(revision => ({
            key: ACTIVE_REVISION,
            'data-test': 'active-revision',
            style: (R.equals(selectedRevision, ACTIVE_REVISION) || R.equals(selectedRevision, revision.id)) ? selectedStyled : {},
            label: <>#{revision.number}: {moment(revision.created).format('ll')} {R.equals(activeRevisionId, revision.id) &&
              <Tag color={colors.successDark}>Active</Tag>} {(R.equals(restrictedRevisionId, revision.id) && isRestricted) && <Tag data-test="restricted-tag" color={colors.red200}>Restricted</Tag>}</>
          }), activeRevision)
        },
        ...!R.isEmpty(nonActiveRevisions) ? [{
          key: 'available revisions',
          label: <GroupList>Available revisions</GroupList>,
          type: 'group',
          children: R.map(revision => ({
            key: revision.id,
            style: R.equals(selectedRevision, revision.id) ? selectedStyled : {},
            className: `revision-${revision.number}`,
            'data-test': `${revision.id}-revision`,
            label: <>#{revision.number}: {moment(revision.created).format('ll')} {(R.equals(restrictedRevisionId, revision.id) && isRestricted) && <Tag data-test="restricted-tag" color={colors.red200}>Restricted</Tag>}</>
          }), nonActiveRevisions)
        } as MenuItemType] : []
      ]}
    />
  );
};

interface EnvironmentLabelProps {
  label?: any;
  isRevisionEditable: boolean;
  onClickRevisionChange: () => void;
  tooltip?: string;
  dashedUnderline?: boolean;
  forWorkspaces?: boolean;
  revisionNumber?: number
}

const EnvironmentLabel = (props: EnvironmentLabelProps) => {
  const { label, isRevisionEditable, onClickRevisionChange, dashedUnderline, forWorkspaces, revisionNumber, tooltip } = props;
  return (
    <LabelLayout justifyContent="space-between">
      {tooltipRenderer(
        tooltip,
        <EnvText dashedUnderline={dashedUnderline} forWorkspaces={forWorkspaces}>{label}</EnvText>,
        'topLeft'
      )}
      {!isRevisionEditable &&
        <StyledText>
          {revisionNumber ? `Using Revision #${revisionNumber} ` : 'Always Use Active Revision '}
          <StyledLink onClick={onClickRevisionChange}>Change</StyledLink>
        </StyledText>}
    </LabelLayout>);
}

interface ComputeEnvironmentRevisionFormItemProps {
  label?: any;
  dashedUnderline?: boolean;
  tooltip?: string;
  error?: any;
  key?: any;
  formItem: typeof DDFormItem;
  enableEnvironmentRevisions?: boolean;
  revTestId?: string;
  onChangeRevision?: (revision: EnvRevision) => void;
  revisionSpec?: string;
  environmentId?: string;
  children?: React.ReactNode;
  isRestrictedProject?: boolean;
}

const ComputeEnvironmentRevisionFormItem: React.FC<ComputeEnvironmentRevisionFormItemProps> = (props) => {
  const { label, tooltip, error, key, children, enableEnvironmentRevisions, dashedUnderline,
    revTestId, environmentId, onChangeRevision, revisionSpec } = props;
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [isRevisionEditable, setIsRevisionEditable] = React.useState<boolean>(false);
  const [environmentInfo, setEnvironmentInfo] = React.useState<UserEnvironments>();
  const [revisions, setRevisions] = React.useState<EnvRevisionSummaryDto[]>([]);
  const [selectedRevision, setSelectedRevision] = React.useState<string | undefined>();
  const [revisionNumber, setRevisionNumber] = React.useState<number>();

  React.useEffect(() => {
    setSelectedRevision(revisionSpec);
  }, [revisionSpec]);

  React.useEffect(() => {
    if (environmentId) {
      fetchEnvironmentRevisions(environmentId, setRevisions);
      fetchEnvironmentById(environmentId, setEnvironmentInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (enableEnvironmentRevisions && environmentId) {
      fetchEnvironmentRevisions(environmentId, setRevisions);
      fetchEnvironmentById(environmentId, setEnvironmentInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [environmentId]);

  React.useEffect(() => {
    const revision = R.find((rev) => R.equals(rev.id, selectedRevision), revisions);
    setRevisionNumber(revision?.number);

  }, [selectedRevision, revisions]);

  const handleRevisionOnLoad = (revision: string) => {
    setSelectedRevision(revision);
    if (onChangeRevision) {
      onChangeRevision(getFormattedRevision(revision));
    }
  }

  const onRevisionChange = (clickParam: MenuInfo) => {
    setSelectedRevision(clickParam.key);
    if (onChangeRevision) {
      onChangeRevision(getFormattedRevision(clickParam.key));
    }
  }

  const onClickRevisionChange = () => {
    setIsRevisionEditable(true);
    if (R.isNil(selectedRevision)) {
      handleRevisionOnLoad('ActiveRevision');
    }
  }

  return (
    <Wrapper>
      <FlexLayout justifyContent="flex-start" alignItems="baseline">
        <EnvironmentWrapper
          showRevisions={Boolean(isRevisionEditable && enableEnvironmentRevisions && environmentInfo)}
          forWorkspaces={R.equals(label, 'Workspace Environment')}
          enableEnvironmentRevisions={enableEnvironmentRevisions}
        >
          <DDFormItem
            dashedUnderline={!enableEnvironmentRevisions}
            label={enableEnvironmentRevisions ? <EnvironmentLabel
              label={label}
              tooltip={tooltip}
              isRevisionEditable={isRevisionEditable}
              onClickRevisionChange={onClickRevisionChange}
              dashedUnderline={dashedUnderline}
              forWorkspaces={R.equals(label, 'Workspace Environment')}
              revisionNumber={revisionNumber}
            /> : label}
            tooltip={tooltip}
            error={error}
            key={key}
            colon={false}
          >
            {children}
          </DDFormItem>
        </EnvironmentWrapper>
        {isRevisionEditable && enableEnvironmentRevisions && environmentInfo &&
          <RevisionWrapper>
            <DDFormItem
              label="Revision"
              colon={false}
            >
              <StyledDropdown
                overlay={renderRevisionMenuItems(revisions, environmentInfo, onRevisionChange, selectedRevision)}
                trigger={['click']}
                data-test={revTestId || 'env-revision-dropdown'}
                className="env-revision-dropdown"
                getPopupContainer={() => (containerRef && containerRef.current) || document.body}
              >
                <RevisionStyle
                  tabIndex={0}
                  data-test={revTestId || 'environment-revision-dropdown'}
                >
                  {selectedRevision ? getSelectedRevision(revisions, selectedRevision) : ''}
                  <StyledIcon type="down" style={{ color: colors.shadowGrey }} />
                </RevisionStyle>
              </StyledDropdown>
              {!R.equals(selectedRevision, ACTIVE_REVISION) && <StyledInfo>Not Recommended</StyledInfo>}
            </DDFormItem>
          </RevisionWrapper>
        }
      </FlexLayout>
    </Wrapper>
  )
}
export default ComputeEnvironmentRevisionFormItem;
