import * as React from 'react';
import Icon from './Icon';

/**
 * Octicon-clippy from the Octicons Icon set
 * https://iconify.design/icon-sets/octicon/clippy.html
 * License: Open Font License
 */
class OcticonClippy extends Icon<{}> {
  static defaultProps = {
    className: 'octicon-clippy',
    fill: 'currentColor',
    width: 14,
    height: 16,
    viewBox: '0 0 14 16',
    transform: 'rotate(360deg)'
  };

  renderContent() {
    const {
      fill,
    } = this.props;

    return (
      <path
        fill={fill}
        fillRule="evenodd"
        d="M2 13h4v1H2v-1zm5-6H2v1h5V7zm2 3V8l-3 3l3 3v-2h5v-2H9zM4.5 9H2v1h2.5V9zM2 12h2.5v-1H2v1zm9 1h1v2c-.02.28-.11.52-.3.7c-.19.18-.42.28-.7.3H1c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h3c0-1.11.89-2 2-2c1.11 0 2 .89 2 2h3c.55 0 1 .45 1 1v5h-1V6H1v9h10v-2zM2 5h8c0-.55-.45-1-1-1H8c-.55 0-1-.45-1-1s-.45-1-1-1s-1 .45-1 1s-.45 1-1 1H3c-.55 0-1 .45-1 1z"
      />
    );
  }
}

export default OcticonClippy;
