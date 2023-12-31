import * as React from 'react';
import Icon, { IconProps } from './Icon';

class AmazonS3Logo extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    width: 17,
    height: 19,
    viewBox: '0 0 17 19',
    fill: 'none',
  };
  renderContent() {
    return (
      <g>
        <path d="M1.83443 3.25L0.585938 3.87437V14.8326L1.83443 15.4533L1.84194 15.4443V3.2586L1.83443 3.25Z" fill="#8C3123"/>
        <path d="M8.51569 13.8628L1.83398 15.4533V3.25L8.51569 4.80583V13.8628Z" fill="#E05243"/>
        <path d="M5.5 11.3727L8.33417 11.7335L8.35197 11.6925L8.36789 7.04511L8.33417 7.00879L5.5 7.36438V11.3727Z" fill="#8C3123"/>
        <path d="M8.33398 13.8806L14.8338 15.4567L14.844 15.4404L14.8438 3.2609L14.8335 3.25L8.33398 4.82369V13.8806" fill="#8C3123"/>
        <path d="M11.1689 11.3727L8.33398 11.7335V7.00879L11.1689 7.36438V11.3727Z" fill="#E05243"/>
        <path d="M11.1691 5.42601L8.33417 5.94268L5.5 5.42601L8.3306 4.68408L11.1691 5.42601Z" fill="#5E1F18"/>
        <path d="M11.1691 13.3057L8.33417 12.7856L5.5 13.3057L8.33072 14.0959L11.1691 13.3057Z" fill="#F2B0A9"/>
        <path d="M5.5 5.42589L8.33417 4.72452L8.35711 4.71744V0.0189477L8.33417 0L5.5 1.41733V5.42589Z" fill="#8C3123"/>
        <path d="M11.1689 5.42589L8.33398 4.72452V0L11.1689 1.41733V5.42589Z" fill="#E05243"/>
        <path d="M8.33447 18.7315L5.5 17.3147V13.3062L8.33447 14.0073L8.37618 14.0547L8.36486 18.6497L8.33447 18.7315Z" fill="#8C3123"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M16.0828 3.87437L14.8338 3.25V15.4567L16.0828 14.8326V3.87437ZM11.1687 17.3147L8.33398 18.7316V14.0073L11.1687 13.3062V17.3147Z" fill="#E05243"/>
      </g>
    );
  }
}

export default AmazonS3Logo;
