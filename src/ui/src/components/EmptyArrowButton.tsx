import * as React from 'react';
import { DownOutlined, LeftOutlined, RightOutlined, UpOutlined } from '@ant-design/icons';
import styled, { css } from 'styled-components';
import { cond, equals, T } from 'ramda';

export enum Direction {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right'
}

const StyledArrow = styled.button`
  border: 0;
  padding: 0;
  line-height: 0;
  background: transparent;
  &:focus, &:active, &:visited {
    outline: 0;
  }
`;

const commonCSS = css`
  &&& {
    vertical-align: 0;
    svg {
      vertical-align: 0;
    }
  }
`;
const StyledDownOutlined = styled(DownOutlined)`${commonCSS}`;
const StyledUpOutlined = styled(UpOutlined)`${commonCSS}`;
const StyledLeftOutlined = styled(LeftOutlined)`${commonCSS}`;
const StyledRightOutline = styled(RightOutlined)`${commonCSS}`;

export interface EmptyArrowButtonProps {
  direction?: Direction;
  size?: number;
  primaryColor?: string;
  onClick?: (event: any) => void;
}

const EmptyArrowButton: React.FC<EmptyArrowButtonProps> = ({
    onClick,
    size = 10,
    direction = Direction.Up,
    ...rest
  }) => {

  const styles = {
    fontSize: size,
    color: rest.primaryColor
  };

  return (
    <StyledArrow
      type={'button'}
      onClick={onClick}
    >
      {cond([
        [() => equals(direction, Direction.Up), () => <StyledUpOutlined style={styles} {...rest}/>],
        [() => equals(direction, Direction.Left), () => <StyledLeftOutlined style={styles} {...rest}/>],
        [() => equals(direction, Direction.Right), () => <StyledRightOutline style={styles} {...rest}/>],
        [T, () => <StyledDownOutlined style={styles} {...rest}/>]
      ])()}
    </StyledArrow>
  );
};

export default EmptyArrowButton;
