import * as React from 'react';
import Icon, { IconProps, generateId } from './Icon';

const [id, idRef] = generateId();

class StopIcon extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    fill: 'currentColor',
    height: 19,
    width: 20,
    viewBox: '0 0 20 19',
    primaryColor: 'currentColor',
    secondaryColor: 'currentColor',
  };

  renderContent() {
    const {
      primaryColor,
    } = this.props;

    return (
      <g>
        <defs>
          <path
            d="M9.5477849,0.291000009 C4.27844628,0.291000009 0,4.46248513 0,9.60009028 C0,14.7449704 4.27844628,18.9164556 9.5477849,18.9164556 C14.8245851,18.9164556 19.1030313,14.7449704 19.1030313,9.60009028 C19.1030313,4.46248513 14.8245851,0.291000009 9.5477849,0.291000009 Z M9.5477849,17.7510005 C4.94252322,17.7510005 1.1953385,14.0960404 1.1953385,9.60009028 C1.1953385,5.10996015 4.94252322,1.45645504 9.5477849,1.45645504 C14.1590158,1.45645504 17.9076928,5.10996015 17.9076928,9.60009028 C17.9076928,14.0960404 14.1590158,17.7510005 9.5477849,17.7510005 Z M11.9384619,6.11100018 L7.16456944,6.11100018 C6.50496942,6.11100018 5.96923095,6.6333452 5.96923095,7.27645521 L5.96923095,11.9310004 C5.96923095,12.5726554 6.50496942,13.0964554 7.16456944,13.0964554 L11.9384619,13.0964554 C12.5965696,13.0964554 13.1338004,12.5726554 13.1338004,11.9310004 L13.1338004,7.27645521 C13.1338004,6.6333452 12.5965696,6.11100018 11.9384619,6.11100018 Z"
            id={id}
          />
        </defs>
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g transform="translate(-300.000000, -155.000000)">
            <g transform="translate(299.000000, 152.000000)">
              <g transform="translate(0.000000, 2.000000)">
                <g transform="translate(1.503500, 1.021053)">
                  <g>
                    <mask fill="white">
                      <use xlinkHref={idRef}/>
                    </mask>
                    <use fill={primaryColor} xlinkHref={idRef}/>
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

export default StopIcon;
