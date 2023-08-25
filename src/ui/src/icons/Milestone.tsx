import * as React from 'react';
import Icon, { IconProps } from './Icon';

class Milestone extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    width: 78,
    height: 96,
    viewBox: '0 0 78 96',
    primaryColor: 'currentColor',
    secondaryColor: '#9DADE4',
  };

  renderContent() {
    const {
      primaryColor, secondaryColor
    } = this.props;

    return (
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-462.000000, -435.000000)">
          <g transform="translate(287.000000, 218.000000)">
            <g transform="translate(143.000000, 217.000000)">
              <g>
                <g transform="translate(32.000000, 0.000000)">
                  <polygon fill={secondaryColor} points="40.5 7.376 41.0148321 25.92 68.5 25.92 62.1472014 16.648 68.5 7.376" />
                  <g fill={primaryColor} fillRule="nonzero">
                    <path d="M69.2189691,33.248 L66.742268,35.28 C76.9640153,47.6597523 77.4934437,65.3449595 68.0303632,78.3079727 C58.5672827,91.270986 41.4991793,96.2413045 26.5037993,90.4007193 C11.5084193,84.5601341 2.36901899,69.3821946 4.26770884,53.4729094 C6.1663987,37.5636241 18.6241491,24.9368232 34.5773196,22.752 L34.1430928,19.552 C16.7376225,21.9312598 3.14324999,35.7045039 1.0690996,53.0611731 C-1.00505079,70.4178423 8.96440719,86.9781957 25.323973,93.3511543 C41.6835388,99.7241129 60.3050783,94.3015394 70.6286509,80.1584779 C80.9522235,66.0154163 80.3728033,46.7206935 69.2189691,33.216 L69.2189691,33.248 Z" />
                    <path d="M13.5735963,57.6 C13.5661316,71.0975161 24.0566992,82.3001156 37.5903759,83.2468704 C51.1240525,84.1936252 63.0871677,74.5617837 64.9783463,61.1960429 C66.869525,47.830302 58.0440588,35.2870824 44.7736082,32.48 L44.1142268,35.6 C55.431284,37.9989654 63.1019063,48.5106785 61.8895682,59.9590785 C60.6772301,71.4074784 50.9731595,80.0981061 39.4020619,80.0981061 C27.8309642,80.0981061 18.1268936,71.4074784 16.9145555,59.9590785 C15.7022174,48.5106785 23.3728397,37.9989654 34.6898969,35.6 L34.0305155,32.48 C22.1315354,35.0403993 13.5810849,44.1024839 13.5735963,57.6 Z" strokeLinejoin="round" />
                    <path d="M30.2350322,57.6 C30.2251751,62.4310993 34.003835,66.4316914 38.8510678,66.7220609 C43.6983006,67.0124305 47.9321688,63.4918225 48.5050398,58.6944489 C49.0779108,53.8970753 45.7910045,49.487573 41.0103093,48.64 L41.0103093,29.12 L71.3418557,29.12 C71.9398371,29.1190221 72.487899,28.7880485 72.764736,28.2607251 C73.041573,27.7334017 73.0014693,27.0968088 72.6606186,26.608 L65.6969072,16.656 L72.6606186,6.688 C73.0014693,6.19919125 73.041573,5.56259827 72.764736,5.03527487 C72.487899,4.50795147 71.9398371,4.1769779 71.3418557,4.176 L41.0103093,4.176 L41.0103093,1.6 C41.0103093,0.7163444 40.2902724,0 39.4020619,0 C38.5138513,0 37.7938144,0.7163444 37.7938144,1.6 L37.7938144,48.64 C33.4272329,49.4141357 30.2440758,53.1873838 30.2350322,57.6 Z M45.3525773,57.6 C45.3525773,60.8695257 42.6884408,63.52 39.4020619,63.52 C36.1156829,63.52 33.4515464,60.8695257 33.4515464,57.6 C33.4515464,54.3304743 36.1156829,51.68 39.4020619,51.68 C42.6884408,51.68 45.3525773,54.3304743 45.3525773,57.6 L45.3525773,57.6 Z M62.4160825,15.728 C62.0261434,16.2799895 62.0261434,17.0160105 62.4160825,17.568 L68.2540206,25.92 L41.0103093,25.92 L41.0103093,7.376 L68.2540206,7.376 L62.4160825,15.728 Z" />
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

export default Milestone;