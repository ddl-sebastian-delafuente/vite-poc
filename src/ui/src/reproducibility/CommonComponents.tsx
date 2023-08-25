import * as React from 'react';
import styled from 'styled-components';
import Card from '@domino/ui/dist/components/Card';
import InfoBox from '@domino/ui/dist/components/Callout/InfoBox';
import { DDFormItem } from '../components/ValidatedForm';
import LabelAndValue from '../components/LabelAndValue';
import { themeHelper } from '../styled';
import * as colors from '../styled/colors';

export const WorkspaceDefinitionSelectorWrapper = styled.div`
  .ant-legacy-form-item {
    margin-bottom: 5px;
  }
`;

export const StyledCard = styled(Card)`
  &.ant-card-bordered {
    border-radius: ${themeHelper('borderRadius.standard')};
    margin: 24px 0 12px 0;
  }
  .ant-card-body {
    padding: ${themeHelper('margins.small')};
    background-color: ${colors.backgroundWhite};
    max-height: 340px;
    overflow: auto;
  }
`;

export const StyledLabelAndValue = styled(LabelAndValue)`
  margin-top: ${themeHelper('margins.small')};
`;

export const Title = styled.div`
  color: ${colors.mineShaftColor};
  font-weight: ${themeHelper('fontWeights.medium')};
`;

export const BranchNameInfo = styled.div`
  margin-bottom: ${themeHelper('margins.small')};
  color: ${colors.mineShaftColor};
  font-weight: ${themeHelper('fontWeights.normal')};
  font-size: ${themeHelper('fontSizes.normal')};
`;

export const StyledDDFormItem = styled(DDFormItem)`
  margin-bottom: 5px;
`;

export const StyledInfoBox = styled(InfoBox)`
  margin: 4px 0 0 0;
  border-radius: ${themeHelper('borderRadius.standard')};
  border-left-width: 6px;
`;

export const DataSetInfoBox: React.FC = props => (
  <StyledInfoBox {...props}>
    Datasets and External Data Volumes will not be recreated in the new Workspace and branch.
  </StyledInfoBox>
);

export const BranchNameInformation: React.FC = props => (
  <BranchNameInfo {...props}>
    <div>The commit will need to be opened in a new Workspace and branch.</div>
    <div>Please give a unique name to the Workspace and branch.</div>
  </BranchNameInfo>
);
