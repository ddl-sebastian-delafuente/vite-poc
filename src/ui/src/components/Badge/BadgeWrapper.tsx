import React from 'react';
import styled from 'styled-components';
import Badge, { BadgeComponentProps } from './Badge';

const BadgeContainer = styled.span`
  cursor: pointer;
`;

export const BadgeWrapper = (props: BadgeComponentProps) => <BadgeContainer><Badge {...props}/></BadgeContainer>;
