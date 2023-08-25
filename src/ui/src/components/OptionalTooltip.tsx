import * as React from 'react';
import styled from 'styled-components';
import { AbstractTooltipProps } from 'antd/lib/tooltip';
// eslint-disable-next-line no-restricted-imports
import { Button, Tooltip } from 'antd';

const Container = styled.span`
  > button {
    border: 0;
    padding: 0;
    white-space: inherit;
    background: transparent;
  }
`;

export interface OptionalTooltipProps extends AbstractTooltipProps {
  shouldShowTooltip: boolean;
  children: JSX.Element;
  content: any;
}

const OptionalTooltip = ({
  shouldShowTooltip,
  children,
  content,
  placement = 'top'
}: OptionalTooltipProps) => {
  if (shouldShowTooltip) {
    return (
      <Container>
        <Tooltip trigger="hover" title={content} placement={placement}>
          <Button>
            {children}
          </Button>
        </Tooltip>
      </Container>
    );
  }
  return children;
};

export default OptionalTooltip;
