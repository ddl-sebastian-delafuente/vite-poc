import * as React from 'react';
import Icon from './Icon';

class GitCommit extends Icon<{}> {
  static defaultProps = {
    primaryColor: 'currentColor',
    width: 14,
    height: 16,
    viewBox: '0 0 14 16',
    className: 'git-commit-icon',
  };

  renderContent() {
    const {
      primaryColor,
    } = this.props;

    return (
      <g stroke="none" strokeWidth="2" fill="none" fillRule="evenodd">
        <g fill={primaryColor}>
          <path
            d="M10.86,7 C10.41,5.28 8.86,4 7,4 C5.14,4 3.59,5.28 3.14,7 L0,7 L0,9 L3.14,9 C3.59,10.72 5.14,12 7,12 C8.86,12 10.41,10.72 10.86,9 L14,9 L14,7 L10.86,7 L10.86,7 Z M7,10.2 C5.78,10.2 4.8,9.22 4.8,8 C4.8,6.78 5.78,5.8 7,5.8 C8.22,5.8 9.2,6.78 9.2,8 C9.2,9.22 8.22,10.2 7,10.2 L7,10.2 Z"
          />
        </g>
      </g>
    );
  }
}

export default GitCommit;
