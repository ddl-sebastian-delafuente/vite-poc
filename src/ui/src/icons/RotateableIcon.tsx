import * as React from 'react';

import Icon from './Icon';

export const UP = 'up';
export const DOWN = 'down';
export const LEFT = 'left';
export const RIGHT = 'right';

export enum Direction {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right',
}

export type Props = {
  baseRotation?: number;
  height?: number;
  width?: number;
  direction?: Direction
  primaryColor?: string;
  viewBox?: string;
};

class RotateableIcon extends Icon<Props> {

  static defaultProps = {
    baseRotation: 0,
    height: 13,
    width: 13,
    direction: Direction.Up,
    primaryColor: 'currentColor',
    viewBox: '0 0 24 24',
  };

  rotateContent(): number {
    const { baseRotation, direction } = this.props;

    switch (direction) {
      case Direction.Up:
        return baseRotation! + 90;
      case Direction.Down:
        return baseRotation! + 270;
      case Direction.Left:
        return baseRotation! + 0;
      case Direction.Right:
        return baseRotation! + 180;
      default:
        return 0;
    }
  }

  getRotation(degreeRotation: number, height: number, width: number) {
    if (window.navigator.userAgent.indexOf('Firefox') > -1) {
      return `rotate(${degreeRotation}, ${width / 2}, ${height / 2})`;
    }
    return `rotate(${degreeRotation})`;

  }

  renderIcon() {
    const { className, viewBox, onClick, testId } = this.props;
    const degreeRotation = this.rotateContent();
    const width = this.getWidth();
    const height = this.getHeight();

    return (
      <svg
        onClick={onClick}
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox={viewBox}
        data-test={testId}
        transform={this.getRotation(degreeRotation, height!, width!)}
      >
        {this.renderContent()}
      </svg>
    );
  }
}

export default RotateableIcon;
