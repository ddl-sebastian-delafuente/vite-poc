import * as React from 'react';
import Icon, {IconProps} from './Icon';

class MonitoringEmptyStateIcon extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    height: 200,
    width: 342,
    viewBox: '0 0 342 200',
  };


  renderContent() {
    return (
      <React.Fragment>
        <path opacity="0.7"
              d="M248 178.5C260.5 187.5 336 199 341.1 199.9H331.9H275.8H274.9H219.7H185.5H157.6H96H78.8H0C36.5 199.9 53.9 173.5 86 173.5C102 173.5 95.5 156.5 116 158C122.5 159 132 142.4 134.6 133.3C150.5 77.9 160 0 182 0C198.754 0 212.243 71.0893 224.5 128C230.24 154.65 231.5 163.5 248 178.5Z"
              fill="#151F4D"/>
        <path opacity="0.6"
              d="M214.3 53.5C191.1 53.5 178.3 128 156.3 166C145.8 190 120.3 177 102.3 181.5C83.256 188.722 58.7163 187.086 51.8 183.5C22.3 172.5 20.2531 200 1.79999 200H80.7H100.3H155H194.1H257.1H288H338C326.5 198.5 294.5 191 279.5 175.5C250.01 145.027 243.4 53.5 214.3 53.5Z"
              fill="#9CABDB"/>
      </React.Fragment>
    );
  }
}

export default MonitoringEmptyStateIcon;
