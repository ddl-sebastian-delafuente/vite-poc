import * as React from 'react';
import Icon from './Icon';

class DirectoryIcon extends Icon<{}> {
  static defaultProps = {
    primaryColor: 'currentColor',
    width: 10,
    height: 14,
    viewBox: '0 0 24 24',
    className: 'directory-icon',
  };

  renderContent() {
    const {
      primaryColor,
    } = this.props;

    return (
      <path fill={primaryColor} d="M11,0H0v7v2v15h24V9V7V3H11V0z M22,22H2V9h20V22z M22,5v2H2V2h7v3H22z" />
    );
  }
}

export default DirectoryIcon;
