import * as React from 'react';
import styled from 'styled-components';
import { ColumnWrapper, RowWrapper, Section, SectionHeader, } from '../../components/QuotaStyles';
import InfoTooltipIcon from '../../icons/InfoTooltipIcon';
import { themeHelper } from '../../styled';
import { DefaultLimits } from './DefaultLimits';
import { BudgetOverrides } from './BudgetOverrides';
import AlertSettings from './AlertSettings';

export const StyledRowRapper = styled(RowWrapper)`
  min-width: 1000px;
`;

export const Column1Wrapper = styled(ColumnWrapper)`
  flex: 1 0 0;
  padding: ${themeHelper('margins.medium')};
`;

export const Column2Wrapper = styled(ColumnWrapper)`
  flex: 0.2 0 0;
  padding: ${themeHelper('margins.medium')};
`;

const SectionWithInfoIcon = styled(SectionHeader)`
  .anticon.anticon-info-circle {
    margin-left: ${themeHelper('margins.medium')};
  }

  svg {
    width: ${themeHelper('iconSizes.small')};
    height: ${themeHelper('iconSizes.small')}
  }
`;

const iconTooltipText = 'By default Project Owners and Org Owners are notified on Project Budget alerts, Org Owners are notified on Org alerts.';

export const CostBudgetsAndAlertsSection = () => {
  return (
    <StyledRowRapper>
      <Column1Wrapper>
        <Section>
          <SectionHeader>Default Limits (per month)</SectionHeader>
          <DefaultLimits/>
        </Section>
        <Section>
          <SectionHeader>Budget Overrides</SectionHeader>
          <BudgetOverrides/>
        </Section>
      </Column1Wrapper>
      <Column2Wrapper>
        <Section>
          <SectionWithInfoIcon>
            Alert Settings
            <InfoTooltipIcon title={iconTooltipText}/>
          </SectionWithInfoIcon>
          <AlertSettings/>
        </Section>
      </Column2Wrapper>
    </StyledRowRapper>
  );
};
