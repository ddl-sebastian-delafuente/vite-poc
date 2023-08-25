import * as React from 'react';
import Icon, { IconProps } from './Icon';

class TimelineEmptyState extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    height: 95,
    width: 199,
    viewBox: '0 0 199 95',
  };

  renderContent() {
    return (
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-1320.000000, -77.000000)">
          <g>
            <g transform="translate(1140.000000, 77.000000)">
              <g transform="translate(181.000000, 0.000000)">
                <g>
                  <g>
                    <rect fill="#F4F5F7" fillRule="nonzero" opacity="0.699999988" x="1.59872116e-13" y="0" width="40.6030534" height="95"></rect>
                    <rect fill="#F4F5F7" fillRule="nonzero" opacity="0.699999988" x="78.1984733" y="0" width="40.6030534" height="95"></rect>
                    <rect fill="#F4F5F7" fillRule="nonzero" opacity="0.699999988" x="156.396947" y="0" width="40.6030534" height="95"></rect>
                    <rect stroke="#E8E8E8" strokeWidth="1.5" x="0.75" y="0.75" width="195.5" height="93.5"></rect>
                    <path d="M20.3015267,88.2142857 L20.3015267,93.4920635" stroke="#6DD400" strokeWidth="1.5" strokeLinecap="square"></path>
                    <path d="M59.4007634,88.2142857 L59.4007634,93.4920635" stroke="#6DD400" strokeWidth="1.5" strokeLinecap="square"></path>
                    <path d="M98.5,88.2142857 L98.5,93.4920635" stroke="#6DD400" strokeWidth="1.5" strokeLinecap="square"></path>
                    <path d="M137.599237,88.2142857 L137.599237,93.4920635" stroke="#6DD400" strokeWidth="1.5" strokeLinecap="square"></path>
                    <path d="M176.698473,88.2142857 L176.698473,93.4920635" stroke="#6DD400" strokeWidth="1.5" strokeLinecap="square"></path>
                    <polyline stroke="#FA53B6" strokeWidth="1.5" points="0 54.2857143 16.5419847 30.1587302 40.6030534 54.2857143 66.1679389 42.2222222 99.2519084 30.1587302 118.801527 37.6984127 156.396947 54.2857143 171.435115 37.6984127 197 42.2222222"></polyline>
                    <polyline stroke="#E7CA1E" strokeWidth="1.5" points="0 67.8571429 21.0534351 54.2857143 40.6030534 25.6349206 66.1679389 16.5873016 78.1984733 30.1587302 97.7480916 54.2857143 118.801527 58.8095238 144.366412 30.1587302 197 58.8095238"></polyline>
                    <polyline stroke="#00B2E0" strokeWidth="1.5" points="0 67.8571429 21.0534351 46.7460317 40.6030534 67.8571429 78.1984733 42.2222222 118.801527 51.2698413 156.396947 60.3174603 197 42.2222222"></polyline>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    );
  }
}

export default TimelineEmptyState;
