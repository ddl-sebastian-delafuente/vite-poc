import * as React from 'react';
import { colors } from '../../styled';
import { HardwareBubble } from '../Icons';
import Select from '../Select/Select';
import styled from 'styled-components';

const Maincontainer = styled.div`
  width: 26rem;
`;

const Legend = styled.div`
  margin: 1rem 0 0.4rem 0;
  font-size: 0.9rem;

  .ant-switch-checked {
    background-color: ${colors.mantis};
  }
`;

const LabelContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0.1rem 0;
`;

const MainTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
`;

const Title = styled.div`
  max-height: 1.5rem;
  margin: 0;
`;

const LabelName = styled.div`
  line-height: 18px;
  margin: 0 0.2rem 0 0;
  font-size: 0.8rem;
`;

const DescriptionLabel = styled.div`
  line-height: 5px;
  margin: 0 0.2rem 0 0;
  font-size: 0.6rem;
  color: ${colors.silverGrayLighter};
`;

const LogoContainer = styled.div`
  margin-right: 0.6rem;git checkout 
`;

const Content = styled.div`
  width: 20rem;
`;

const TimeContainner = styled.div`
  font-size: 0.8rem;
  font-weight: 500;
  margin-right: 1rem;
  color: ${colors.mantis};
`;

interface HardwareLabelProps {
  label: string;
  description: string;
  time: string;
}

interface OptionsProps {
  value: string;
  label: JSX.Element | string;
}
export interface HardwareProps {
  instanceOptions?: OptionsProps[];
  hardwareOptions?: OptionsProps[];
}

export const HardwareLabel: React.FC<HardwareLabelProps> = ({ label, description, time }) => {
  return (
    <LabelContainer>
      <LogoContainer>
        <HardwareBubble />
      </LogoContainer>
      <Content>
        <Title>
          <LabelName>{label}</LabelName>
          <DescriptionLabel>{description}</DescriptionLabel>
        </Title>
      </Content>
      <TimeContainner>{time}</TimeContainner>
    </LabelContainer>
  );
};

const HardwareConfiguration: React.FC<HardwareProps> = ({ instanceOptions, hardwareOptions }) => {
  return (
    <Maincontainer>
      <MainTitle>Hardware Configuration</MainTitle>
      <Legend>No. of instances</Legend>
      <Select style={{ width: '100%' }} defaultValue="2" options={instanceOptions} />
      <Legend>Hardware</Legend>
      <Select style={{ width: '100%' }} defaultValue="Small" options={hardwareOptions} />
    </Maincontainer>
  );
};

export default HardwareConfiguration;
