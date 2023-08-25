import * as React from 'react';
import Icon, { IconProps } from './Icon';

class AdminShield extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    width: 24,
    height: 27,
    viewBox: '0 0 24 27',
    fill: 'none',
    primaryColor: 'currentColor',
  };
  renderContent() {
    const {
      primaryColor = '#383838',
    } = this.props;
    return (
      <g>
        <path d="M21.9349 3.50233C16.5488 2.97209 13.4791 0.572093 13.4791 0.544186C12.6419 -0.181395 11.386 -0.181395 10.5209 0.544186C10.493 0.572093 7.45116 2.97209 2.06512 3.50233C0.893023 3.61395 0 4.5907 0 5.7907C0 21.3349 10.6326 26.1349 11.0791 26.3302C11.3581 26.4698 11.693 26.5256 12 26.5256C12.307 26.5256 12.6419 26.4698 12.9209 26.3302C13.3674 26.1349 24 21.3349 24 5.7907C24 4.5907 23.107 3.61395 21.9349 3.50233ZM17.3302 19.6326L17.2186 18.6279C17.0791 17.2326 16.1581 16.0884 14.9302 15.5302C14.093 16.0326 13.0884 16.3395 12.0279 16.3395C10.9674 16.3395 9.9907 16.0326 9.12558 15.5302C7.89767 16.0884 7.00465 17.2326 6.83721 18.6279L6.72558 19.6605C4.49302 16.8419 2.4 12.4605 2.34419 5.90233C8.53954 5.28837 12 2.49767 11.9721 2.41395C12.1395 2.55349 15.5721 5.26046 21.6279 5.87442C21.5721 12.4326 19.507 16.814 17.3302 19.6326Z" fill={primaryColor}/>
        <path d="M12.0005 14.3565C14.0196 14.3565 15.6564 12.7198 15.6564 10.7007C15.6564 8.68169 14.0196 7.04492 12.0005 7.04492C9.98149 7.04492 8.34473 8.68169 8.34473 10.7007C8.34473 12.7198 9.98149 14.3565 12.0005 14.3565Z" fill={primaryColor}/>
      </g>
    );
  }
}

export default AdminShield;
