import * as React from 'react';
import Icon, { IconProps } from './Icon';

class CodeFile extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    height: 19,
    width: 15,
    viewBox: '0 0 15 19',
    primaryColor: 'currentColor'
  };

  renderContent() {
    const {
      primaryColor,
    } = this.props;
    return (
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-115.000000, -272.000000)" fill={primaryColor} fillRule="nonzero">
          <g transform="translate(115.000000, 272.000000)">
            <g transform="translate(0.000000, 0.000000)">
              <g transform="translate(0.031771, 0.000000)">
                <path d="M2.19626676,18.1007445 L12.6291049,18.1007445 C13.8172895,18.1007445 14.7839555,17.1340785 14.7839555,15.945894 L14.7839555,5.17612337 C14.7839555,5.05777898 14.7352989,4.94464933 14.6493635,4.86323908 L9.64006865,0.118085809 C9.5600375,0.0422350705 9.45397575,0 9.3436905,0 L2.19626676,0 C1.00808218,0 0.0414162273,0.96666595 0.0414162273,2.15485054 L0.0414162273,15.945894 C0.0414162273,17.1340785 1.00808218,18.1007445 2.19626676,18.1007445 Z M9.84176266,1.49641441 L13.2429356,4.71826073 L10.2727328,4.71826073 C10.0350958,4.71826073 9.84176266,4.52492754 9.84176266,4.28729062 L9.84176266,1.49641441 Z M0.903356441,2.15485054 C0.903356441,1.44193978 1.48335601,0.861940214 2.19626676,0.861940214 L8.97982244,0.861940214 L8.97982244,4.28729062 C8.97982244,5.00020138 9.55982201,5.58020095 10.2727328,5.58020095 L13.9220152,5.58020095 L13.9220152,15.945894 C13.9220152,16.6588047 13.3420157,17.2388043 12.6291049,17.2388043 L2.19626676,17.2388043 C1.48335601,17.2388043 0.903356441,16.6588047 0.903356441,15.945894 L0.903356441,2.15485054 Z" />
                <path d="M9.03253009,13.4807019 C9.11325079,13.5484504 9.21155507,13.5815489 9.30934219,13.5815489 C9.43234105,13.5815489 9.55447798,13.529186 9.63968077,13.4276063 L10.984092,11.8253888 C11.1185547,11.6651541 11.1185547,11.4315683 10.984092,11.2713336 L9.63968077,9.66911603 C9.48668638,9.48677258 9.21483044,9.46302613 9.03253009,9.61602051 C8.85022973,9.7690149 8.82639708,10.0408277 8.97943457,10.2231712 L10.0914236,11.5483612 L8.97943457,12.8735512 C8.82639708,13.0558946 8.85018663,13.3277075 9.03253009,13.4807019 Z" />
                <path d="M5.18569091,13.4276063 C5.2709368,13.529186 5.39307373,13.581592 5.5160295,13.5815489 C5.61381661,13.5815489 5.7121209,13.5484504 5.7928416,13.4807019 C5.97514195,13.3277075 5.9989746,13.0558946 5.84593711,12.8735512 L4.73394804,11.5483612 L5.84593711,10.2231712 C5.9989746,10.0408277 5.97514195,9.7690149 5.7928416,9.61602051 C5.61054124,9.46302613 5.3386422,9.48681568 5.18569091,9.66911603 L3.84127966,11.2713336 C3.70681699,11.4315683 3.70681699,11.6651541 3.84127966,11.8253888 L5.18569091,13.4276063 Z" />
                <path d="M6.94288533,14.6447952 C6.96482171,14.6481137 6.9865857,14.6497514 7.0080911,14.6497514 C7.21749948,14.6497514 7.40126513,14.496757 7.43363099,14.2833837 L8.24394098,8.94262972 C8.27966841,8.70732004 8.11783913,8.48761148 7.88248635,8.45188406 C7.64717668,8.41611354 7.42742502,8.57798591 7.39174069,8.81329559 L6.5813876,14.1540495 C6.54570328,14.3894023 6.70753255,14.6091109 6.94288533,14.6447952 Z" />
              </g>
            </g>
          </g>
        </g>
      </g>
    );
  }
}
export default CodeFile;
