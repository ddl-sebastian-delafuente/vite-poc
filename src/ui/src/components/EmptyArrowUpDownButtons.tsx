import * as React from 'react';
import EmptyArrowButton, { Direction } from './EmptyArrowButton';
import styled from 'styled-components';

interface ContainerProps {
  height?: number;
  arrowSize: number;
}
const Container = styled.div<ContainerProps>`
  display: inline-flex;
  flex-direction: column;
  width: ${({ arrowSize }) => `${arrowSize + 2}`}px;
  height: ${({ height }) => `${height}`}px;
`;

export interface UpDownButtonsDefaultProps {
  size?: number;
  color?: string;
  selectedColor?: string;
}

export interface UpDownButtonsProps extends UpDownButtonsDefaultProps {
  height?: number;
  onClickUpButton: (event: any) => void;
  onClickDownButton: (event: any) => void;
  defaultSelected?: Direction;
  selected?: Direction;
  className?: string;
}

export interface UpDownButtonsState {
  selected?: Direction;
}

class UpDownButtons extends React.PureComponent<UpDownButtonsProps, UpDownButtonsState> {
  public static defaultProps: UpDownButtonsDefaultProps = {
    size: 10,
    color: '#BBC0D0',
    selectedColor: '#4D5673',
  };

  constructor(props: UpDownButtonsProps) {
    super(props);

    this.state = {
      selected: props.defaultSelected,
    };
  }

  UNSAFE_componentWillReceiveProps(newProps: UpDownButtonsProps) {
    if (newProps.selected !== this.props.selected) {
      // allows user to treat as a controlled component in a predictable way
      this.setState({ selected: newProps.selected });
    }
  }

  onClickButton = (buttonDirection: Direction, callback: (event: any) => void) => (event: any) => {
    this.setState({ selected: buttonDirection }, () => callback(event));
  }

  getArrowFill = (buttonDirection: Direction) => {
    const {
      color,
      selectedColor,
    } = this.props;
    const selectedDirection = this.props.selected || this.state.selected;

    if (selectedDirection === buttonDirection) {
      return selectedColor;
    }
    return color;
  }

  render() {
    const {
      onClickUpButton,
      onClickDownButton,
      size,
      height,
      className,
    } = this.props;

    return (
      <Container arrowSize={size!} height={Math.max(height || 0, size! * 2)} className={className}>
        <EmptyArrowButton
          onClick={this.onClickButton(Direction.Up, onClickUpButton)}
          direction={Direction.Up}
          size={size!}
          primaryColor={this.getArrowFill(Direction.Up)}
        />
        <EmptyArrowButton
          onClick={this.onClickButton(Direction.Down, onClickDownButton)}
          direction={Direction.Down}
          size={size!}
          primaryColor={this.getArrowFill(Direction.Down)}
        />
      </Container>
    );
  }
}

export default UpDownButtons;
