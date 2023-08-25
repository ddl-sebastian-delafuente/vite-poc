import * as React from 'react';
import Icon, { IconProps } from './Icon';

class SwitcherIcon extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    height: 15,
    width: 15,
    viewBox: '0 0 390 512',
    primaryColor: 'currentColor',
    secondaryColor: 'currentColor',
  };

  renderContent() {
    const {
      primaryColor,
    } = this.props;

    return (
      <path
        fill={primaryColor}
        d="M0,102h102V0H0V102z M153,408h102V306H153V408z M0,408h102V306H0V408z M0,255h102V153H0V255z M153,255h102V153H153V255z     M306,0v102h102V0H306z M153,102h102V0H153V102z M306,255h102V153H306V255z M306,408h102V306H306V408z" />
    );
  }
}

export default SwitcherIcon;
