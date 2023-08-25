import * as React from 'react';
import Icon, { IconProps } from './Icon';

class CommentText extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    height: 24,
    width: 24,
    viewBox: '0 0 24 24',
    primaryColor: 'currentColor',
  };

  renderContent() {
    const {
      primaryColor
    } = this.props;
    return (
      <g>
        <path fill={primaryColor} fillRule="evenodd" clipRule="evenodd" d="M6 21.8042L12.0868 18H20C21.1046 18 22 17.1046 22 16V4C22 2.89543 21.1046 2 20 2H4C2.89543 2 2 2.89543 2 4V16C2 17.1046 2.89543 18 4 18H6V21.8042ZM11.5132 16L8 18.1958V16H4V4H20V16H11.5132ZM7 13V11H14V13H7ZM7 7V9H16V7H7Z"/>
      </g>
    );
  }
}

export default CommentText;
