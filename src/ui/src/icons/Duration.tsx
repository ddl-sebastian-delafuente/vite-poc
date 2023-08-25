import * as React from 'react';
import Icon, { IconProps, generateId } from './Icon';

const [id, idRef] = generateId();

class DurationIcon extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    height: 22,
    width: 22,
    viewBox: '0 0 22 14',
    primaryColor: 'currentColor',
  };

  renderContent() {
    const {
      primaryColor,
    } = this.props;

    return (
      <>
        <defs>
          <path d="M8.49985833,0 C3.80572593,0 0,3.80572593 0,8.49985833 C0,13.1940616 3.80572593,17 8.49985833,17 C13.1940616,17 17,13.1940616 17,8.49985833 C17,3.80572593 13.1940616,0 8.49985833,0 Z M12.1746821,10.1165853 L8.57097618,10.1165853 C8.55879265,10.1165853 8.54745912,10.1135394 8.53527559,10.1130436 C8.52337539,10.1135394 8.51204187,10.1165853 8.49985833,10.1165853 C8.17501125,10.1165853 7.91186103,9.85322255 7.91186103,9.52865881 L7.91186103,3.52762963 C7.91186103,3.20278255 8.17501125,2.93963233 8.49985833,2.93963233 C8.82442207,2.93963233 9.08757229,3.20278255 9.08757229,3.52762963 L9.08757229,8.94094485 L12.1743987,8.94094485 C12.4989625,8.94094485 12.7621127,9.20402423 12.7621127,9.52865881 C12.7621127,9.85322255 12.4992458,10.1165853 12.1746821,10.1165853 Z" id={id}></path>
        </defs>
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g transform="translate(-671.000000, -213.000000)">
            <g transform="translate(299.000000, 197.000000)">
              <g transform="translate(365.000000, 16.000000)">
                <g transform="translate(7.000000, 0.000000)">
                  <mask fill="white">
                    <use xlinkHref={idRef} />
                  </mask>
                  <use fill={primaryColor} xlinkHref={idRef} />
                </g>
              </g>
            </g>
          </g>
        </g>
      </>
    );
  }
}

export default DurationIcon;
