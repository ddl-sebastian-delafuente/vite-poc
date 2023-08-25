import React, { useCallback } from 'react';
import styled from 'styled-components';
import { themeHelper } from '../../../styled/themeUtils';
import Button from '../../Button/Button';
import Popover, { PopoverProps } from '../Popover';

export const Container = styled.div`
  max-width: 168px;
  font-size: ${themeHelper('fontSizes.tiny')};
`;

const Wrapper = styled.div`
  padding: 150px 300px;
`;

const PopoverWrapper = ({title, content, ...rest}: PopoverProps) => {

  const getContent = useCallback(() => <Container>{content as React.ReactNode}</Container>, [content]);

  return (
    <Wrapper>
      <Popover {...rest} content={getContent()} title={title} trigger="focus">
        <Button>Click or focus me</Button>
      </Popover>
    </Wrapper>
  );
};

export default PopoverWrapper;
