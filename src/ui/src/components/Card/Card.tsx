import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { Card as AntCard, CardProps as AntCardProps } from 'antd';
import styled from 'styled-components';
import { btnGrey, cardShadowLighter } from '../../styled/colors';
import { themeHelper } from '../../styled/themeUtils';

const defaultWidth = 300;

const Wrapper = styled.div`
  .ant-card-body {
    padding: 20px 24px;
  }
  .ant-card-bordered {
    border: 1px solid ${btnGrey};
    box-sizing: border-box;
    box-shadow: 0px 4px 6px ${cardShadowLighter};
  }
`;

const Title = styled.div`
  margin-bottom: 10px;
  font-size: ${themeHelper('fontSizes.medium')};
  font-weight: ${themeHelper('fontWeights.medium')};
  line-height: 1;
`;

const Content = styled.div`
  font-size: ${themeHelper('fontSizes.small')};
`;

export interface CardProps extends AntCardProps {
  width?: number | string;
  showTitleSeparator?: boolean;
  /**
   * test attribute
   * @default 'domino-card'
   */
  'data-test'?: string;
}

const Card = ({
  title,
  width,
  showTitleSeparator = false,
  children,
  ...rest
}: CardProps) => {
  const props = showTitleSeparator ? { ...rest, title } : rest;
  const testId = rest['data-test'] ?? 'domino-card';
  return (
    <Wrapper data-test={`${testId}-wrapper`}>
      <AntCard {...props} data-test={testId} style={{ width: width || defaultWidth, ...props.style }}>
        {!showTitleSeparator && title && <Title className="card-title">{title}</Title>}
        <Content className="card-content">{children}</Content>
      </AntCard>
    </Wrapper>
  );
};

Card.Grid = AntCard.Grid;
Card.Meta = AntCard.Meta;

export default Card;
