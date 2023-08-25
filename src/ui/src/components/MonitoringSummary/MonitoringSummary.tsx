import * as React from 'react';
import { colors } from '../../styled';
import styled from 'styled-components';
import MonitoringSteps from './MonitoringSteps';

const MainContainer = styled.div`
  color: ${colors.mineShaft};
  padding: 1rem;
  width: 40rem;
`;

const Title = styled.span`
  color: ${colors.mineShaft};
  font-size: 1.2rem;
  font-weight: 500;
`;

const Description = styled.span`
  color: ${colors.mediumGrey};
  font-style: italic;
  font-size: 1rem;
  padding-left: 1.2rem;
`;

const Subtitle = styled.p`
  color: ${colors.mineShaft};
`;

const ModuleContainer = styled.p`
  margin: 1.2rem 0 1.8rem 0;
`;

const StepsMargin = styled.div`
  margin-left: 0.6rem;
`;

const EmptyState = styled.div`
  background: ${colors.greylight3};
  width: 23rem;
  height: 6rem;
  text-align: center;
  line-height: 6rem;
  border-radius: 4px;
  font-family: 'Roboto', sans-serif;
  font-size: 0.875rem;
 `;

export interface MetricsProps {
  count: number | undefined;
}

export interface MonitoringType {
  modelQuality: MetricsProps[];
  dataDrift: MetricsProps[];
  isEnabled: boolean;
}

export interface MonitoringProjectProps {
  data: MonitoringType;
}

const MonitoringSummary: React.FC<MonitoringProjectProps> = ({ data }) => {
  return (
    <MainContainer>
      <Title>Monitoring Summary</Title>

          <Description>Last 7 days</Description>
          <ModuleContainer>
            {!data.isEnabled ?
              <>
                <Subtitle>Monitoring</Subtitle>
                <EmptyState>
                  <div>Monitoring not enabled</div>
                </EmptyState>
              </> : <>
                <Subtitle>Model Quality</Subtitle>
                <StepsMargin>
                  <MonitoringSteps steps={data.modelQuality} />
                </StepsMargin>
              </>
            }
          </ModuleContainer>
          <ModuleContainer>
            {!data.isEnabled ?
              <>
                <Subtitle>Traffic</Subtitle>
                <EmptyState>
                  No traffic
                </EmptyState>
              </> : <>
                <Subtitle>Data Drift</Subtitle>
                <StepsMargin>
                  <MonitoringSteps steps={data.dataDrift} />
                </StepsMargin>
              </>
            }
          </ModuleContainer>
    </MainContainer>
  );
};

export default MonitoringSummary;
