import * as React from 'react';
import Icon, { IconProps } from './Icon';
import { getUniqueId } from '../utils/common';

class Github extends Icon<{}> {
  uniqueId = 0;
  constructor (props: IconProps) {
    super(props);
    this.uniqueId = getUniqueId();
  }
  public static defaultProps: IconProps = {
    className: '',
    height: 26,
    width: 27,
    viewBox: '0 0 27 26',
    primaryColor: 'currentColor',
    secondaryColor: 'currentColor'
  };

  renderContent() {
    const {
      primaryColor,
    } = this.props;
    return (
      <g>
        <defs>
          <path d="M13,0 C5.8175,0 0,5.96464693 0,13.32882 C0,19.2268228 3.72125,24.2084693 8.88875,25.9745379 C9.53875,26.0911651 9.7825,25.6913005 9.7825,25.3414189 C9.7825,25.0248595 9.76625,23.9752149 9.76625,22.8589262 C6.5,23.4753842 5.655,22.042536 5.395,21.2927899 C5.24875,20.9095863 4.615,19.7266535 4.0625,19.4100941 C3.6075,19.1601787 2.9575,18.5437208 4.04625,18.5270597 C5.07,18.5103987 5.80125,19.4933992 6.045,19.8932638 C7.215,21.9092478 9.08375,21.342773 9.83125,20.9928914 C9.945,20.1265181 10.28625,19.5433823 10.66,19.2101618 C7.7675,18.8769413 4.745,17.7273305 4.745,12.6290569 C4.745,11.1795477 5.24875,9.97995394 6.0775,9.04693655 C5.9475,8.71371605 5.4925,7.347512 6.2075,5.51479926 C6.2075,5.51479926 7.29625,5.16491773 9.7825,6.8810033 C10.8225,6.58110485 11.9275,6.43115563 13.0325,6.43115563 C14.1375,6.43115563 15.2425,6.58110485 16.2825,6.8810033 C18.76875,5.14825671 19.8575,5.51479926 19.8575,5.51479926 C20.5725,7.347512 20.1175,8.71371605 19.9875,9.04693655 C20.81625,9.97995394 21.32,11.1628867 21.32,12.6290569 C21.32,17.7439916 18.28125,18.8769413 15.38875,19.2101618 C15.86,19.6266874 16.26625,20.4264166 16.26625,21.6759935 C16.26625,23.4587231 16.25,24.8915713 16.25,25.3414189 C16.25,25.6913005 16.49375,26.1078261 17.14375,25.9745379 C22.435475,24.1429186 25.9985721,19.0552211 26,13.32882 C26,5.96464693 20.1825,0 13,0 Z" id={`github-path-${this.uniqueId}`}/>
        </defs>
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" opacity="0.674083891">
          <g transform="translate(-355.000000, -60.000000)">
            <g transform="translate(355.500000, 60.000000)">
              <g>
                <mask id={`github-mask-${this.uniqueId}`} fill="white">
                  <use xlinkHref={`#github-path-${this.uniqueId}`}/>
                </mask>
                <use fill="#A1A1A1" fillRule="nonzero" xlinkHref={`#github-path-${this.uniqueId}`}/>
                <g mask={`url(#github-mask-${this.uniqueId})`} fill={primaryColor}>
                  <rect x="0" y="0" width="26" height="26"/>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    );
  }
}

export default Github;
