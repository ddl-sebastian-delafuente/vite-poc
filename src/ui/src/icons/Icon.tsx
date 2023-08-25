import * as process from 'process';
import * as React from 'react';
import { isNil } from 'ramda';
import { v4 as uuidv4 } from 'uuid';

export interface FunctionalIconProps {
  height?: number;
  testId?: string;
  width?: number;
}

export interface IconProps {
  transform?: string;
  className?: string;
  height?: number | string;
  width?: number | string;
  viewBox?: string;
  fill?: string;
  primaryColor?: string;
  secondaryColor?: string;
  testId?: string;
  onClick?: () => void;
}

export const generateId = () => {
  // HACK to get UUID mocks working for snapshots in apps/web
  // Currently nested node_modules does not allow mocking of uuid
  // from apps/web.
  const id = process.env.NODE_ENV === 'test' ? '04e51a8d-febe-4b41-8bec-0a46ce98864b' : uuidv4();
  const ref = `#${id}`;
  const urlRef = `url(${ref})`;

  return [id, ref, urlRef];
}

class Icon<T> extends React.PureComponent<IconProps & T> {
  public static defaultProps: IconProps = {
    className: '',
    height: 10,
    width: 10,
    viewBox: '0 0 10 10'
  };

  constructor(props: IconProps & T) {
    super(props);
    if (true) {
      if (!isNil(props.fill)) {
        console.warn(`* DEPRECATION WARNING *
          Fill is a deprecated proptype on Icon.
          Please use primaryColor and secondaryColor instead and remove the fill prop
          wherever you see it.`);
      }
    }
  }

  getWidth() {
    const { width } = this.props;
    return width;
  }
  getHeight() {
    const { height } = this.props;
    return height;
  }
  renderContent(): JSX.Element | JSX.Element[] {
    return <i/>;
  }
  renderIcon() {
    const {transform, className, viewBox, fill, onClick, testId} = this.props;
    const comp = <svg
      transform={transform}
      onClick={onClick}
      xmlns="http://www.w3.org/svg/2000"
      className={className}
      width={this.getWidth()}
      height={this.getHeight()}
      viewBox={viewBox}
      fill={fill}
      version="1.1"
      data-test={testId}
    >
      {this.renderContent()}
    </svg>;
    return (
      <>
        {comp}
      </>);
  }
  render() {
    return this.renderIcon();
  }
}

export default Icon;
