import React from 'react';
import styled from "styled-components";
import FlexLayout from "@domino/ui/dist/components/Layouts/FlexLayout";
import {aliceBlueLightest} from '@domino/ui/dist/styled/colors';

const Container = styled.div`
  min-height: 300px;
  background-color: ${aliceBlueLightest};
  width: 100%;
`;

const IconContainer = styled(FlexLayout)`
  margin-top: 64px;
  margin-bottom: 48px;
  width: 100%;
`;

const Title = styled(FlexLayout)`
  margin-top: 48px;
  width: 100%;
  margin-bottom: 16px;
  font-size: 20px;
  font-weight: 500;
`;

const Description = styled.div`
  margin-top: 16px;
  text-align: center;
  width: 100%;
  margin-bottom: 32px;
`;

const ActionsContainer = styled(FlexLayout)`
  margin-bottom: 32px;
`;

interface Props {
  icon: React.ReactElement;
  title: string;
  description: React.ReactElement;
  actions: React.ReactElement
}

const NotMonitoredState: React.FC<Props> = ({icon, title, description, actions}) => {
  return <Container data-test="not-monitored-state">
    <IconContainer>
      {icon}
    </IconContainer>
    <Title>
      {title}
    </Title>
    <Description>
      {description}
    </Description>
    <ActionsContainer>
      {actions}
    </ActionsContainer>
  </Container>
}

export default NotMonitoredState;
