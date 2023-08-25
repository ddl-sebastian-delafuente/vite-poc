import * as React from 'react';
import { CheckCircleFilled } from '@ant-design/icons';
import { colors } from '../../styled';
import styled from 'styled-components';

const Icon = styled.div`
  height: 1.2rem;
  width: 1.2rem;
  border-radius: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IconNumber = styled.div`
  height: 1.6rem;
  width: 1.6rem;
  border-radius: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
`;

const StepCircle = styled.div`
  display: flex;
  align-items: center;
`;

const Line = styled.div`
  height: 1px;
  width: 4.3rem;
  background: ${colors.dividerColor};
  margin: 0 0.2rem;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
`;

interface MetricsProps {
  count: number | undefined;
}

export interface MonitoringStepsProps {
  steps: MetricsProps[];
}

const MonitoringSteps: React.FC<MonitoringStepsProps> = ({ steps }) => {
  const selectLogo = (phase?: number) => {
    let logo;
    switch (phase) {
      case 0:
        logo = (
          <Icon>
            <CheckCircleFilled style={{ fontSize: '22px', color: colors.mantis }}/>
          </Icon>
        );
        break;
      case undefined:
        logo = <Icon style={{ background: `${colors.silverGrayLighter}` }}/>;
        break;
      default:
        logo = <IconNumber style={{ background: `${colors.error}`, color: `${colors.white}` }}>{phase}</IconNumber>;
    }
    return logo;
  };

  return (
    <StepCircle>
      {steps.map((step, i, item) => (
        <div key={`step-model-quality-id-${i}`}>
          <Container>
            <div>{selectLogo(step.count)}</div>
            {i + 1 !== item.length && <Line />}
          </Container>
        </div>
      ))}
    </StepCircle>
  );
};

export default MonitoringSteps;
