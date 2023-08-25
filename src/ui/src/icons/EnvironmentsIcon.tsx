import * as React from 'react';
import Icon, { IconProps } from './Icon';

class EnvironmentsIcon extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    height: 15,
    width: 15,
    viewBox: '0 0 360 360',
    primaryColor: 'currentColor',
    secondaryColor: 'currentColor',
    transform: 'scale(1.1, 1)',
  };

  renderContent() {
    const {
      primaryColor,
    } = this.props;

    return (
      <g>
        <path fill={primaryColor} d="M351.088,93.337c0-6.029-3.408-11.54-8.805-14.231L187.1,1.673c-4.47-2.231-9.729-2.231-14.2,0L17.715,79.106  c-5.394,2.691-8.803,7.887-8.803,14.422c0,6.534,0,172.21,0,172.21c0,6.001,3.38,11.491,8.736,14.196l155.184,78.358  c2.259,1.142,4.715,1.707,7.166,1.707c3.862,0,7.814-2.042,7.813-2.032l154.541-78.034c5.357-2.705,8.736-8.195,8.736-14.196  C351.088,265.739,351.088,93.491,351.088,93.337z M180,33.678l119.562,59.659L180,152.995L60.438,93.337L180,33.678z M40.72,119.046  l123.376,61.561V318.25L40.72,255.953V119.046z M319.28,255.953L195.904,318.25V180.607l123.377-61.561V255.953z"/>
      </g>
    );
  }
}

export default EnvironmentsIcon;
