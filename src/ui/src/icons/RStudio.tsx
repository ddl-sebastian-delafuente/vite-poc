import * as React from 'react';
import Icon, { IconProps } from './Icon';

class RStudio extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    height: 16,
    width: 16,
    viewBox: '0 0 16 16',
    primaryColor: 'currentColor'
  };

  renderContent() {
    return (
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-49.000000, -114.000000)" fillRule="nonzero">
          <g transform="translate(46.000000, 110.000000)" fill="#75AADB">
            <circle transform="translate(11.099636, 11.998253) rotate(-45.000000) translate(-11.099636, -11.998253) " cx="11.0996359" cy="11.9982527" r="7.81475101"/>
          </g>
          <path d="M60.1605005,125.26836 L61.122363,125.26836 L61.122363,126.015521 L59.653805,126.015521 L57.2205219,122.368459 L55.9237251,122.368459 L55.9237251,125.26836 L57.191895,125.26836 L57.191895,126.015521 L54,126.015521 L54,125.26836 L55.0964088,125.26836 L55.0964088,118.84163 L54,118.707083 L54,118 C54.4150895,118.094469 54.7757879,118.16031 55.2280923,118.16031 C55.9094116,118.16031 56.6050443,118 57.2863636,118 C58.6089246,118 59.8370169,118.601164 59.8370169,120.069722 C59.8370169,121.206208 59.1556977,121.927605 58.0993665,122.233913 L60.1605005,125.26836 Z M55.9237251,121.647062 L56.6193578,121.661376 C58.3169306,121.68714 58.9696231,121.034447 58.9696231,120.164191 C58.9696231,119.147937 58.2339127,118.747161 57.3006771,118.747161 C56.8598234,118.747161 56.4046563,118.787239 55.9237251,118.84163 L55.9237251,121.647062 Z" fill="#FFFFFF"/>
        </g>
      </g>
    );
  }
}

export default RStudio;
