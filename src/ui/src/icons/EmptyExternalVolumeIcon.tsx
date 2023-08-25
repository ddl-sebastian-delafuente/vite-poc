import * as React from 'react';
import Icon, { IconProps } from './Icon';

class EmptyExternalVolumeIcon extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    height: 180,
    width: 284,
    viewBox: '0 0 284 180',
    primaryColor: 'currentColor',
  };

  renderContent() {
    return (
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" opacity="0.9">
        <g>
          <path d="M124,0 C166.116251,0 201.475784,28.9289513 211.291765,68.000021 L243,68 C247.970563,68 252,72.0294373 252,77 L252,83 C252,87.9705627 247.970563,92 243,92 L210,92 C201.820593,92 195.17027,98.5467864 195.003218,106.686172 L195,107 L195,111 C195,118.139652 199.98814,124.114261 206.669551,125.62896 L206.664,125.639 L222,125.63998 C226.970563,125.63998 231,129.669417 231,134.63998 L231,141 C231,145.970563 226.970563,150 222,150 L191.081103,150.001023 C174.602427,168.413038 150.654353,180 124,180 C79.7550006,180 42.9670126,148.072739 35.4179998,106.000181 L9,106 C4.02943725,106 0,101.970563 0,97 L0,86 C0,81.0294373 4.02943725,77 9,77 L46,77 C50.8818027,77 54.8557914,73.1131863 54.9961629,68.2653623 L55,68 L55,62 C55,57.1181973 51.1131863,53.1442086 46.2653623,53.0038371 L46,53 L29,53 C24.0294373,53 20,48.9705627 20,44 L20,38 C20,33.0294373 24.0294373,29 29,29 L57.8260344,28.9992674 C74.2710036,11.1686439 97.8312135,0 124,0 Z M275,126 C279.970563,126 284,130.029437 284,135 L284,141 C284,145.970563 279.970563,150 275,150 L251,150 C246.029437,150 242,145.970563 242,141 L242,135 C242,130.029437 246.029437,126 251,126 L275,126 Z" fill="#F5F5F5" />
          <path d="M172.528178,51.980159 C172.68625,52.7933656 172.155158,53.580742 171.341951,53.7388133 L162.507307,55.4560943 C161.6941,55.6141656 160.906724,55.0830736 160.748652,54.269867 C160.590581,53.4566604 161.121673,52.6692841 161.93488,52.5112127 L170.769524,50.7939318 C171.582731,50.6358604 172.370107,51.1669525 172.528178,51.980159 Z M163.993573,39.1507876 C164.68037,39.6140382 164.86159,40.5463361 164.39834,41.2331333 L159.365604,48.6944714 C158.902353,49.3812687 157.970055,49.562489 157.283258,49.0992385 C156.596461,48.6359879 156.41524,47.70369 156.878491,47.0168927 L161.911227,39.5555546 C162.374478,38.8687574 163.306776,38.687537 163.993573,39.1507876 Z M148.343461,38.3907758 L151.714921,46.7354305 C152.025255,47.5035347 151.654159,48.3777819 150.886055,48.6881161 C150.117951,48.9984504 149.243703,48.6273545 148.933369,47.8592503 L145.56191,39.5145956 C145.251576,38.7464913 145.622672,37.8722442 146.390776,37.5619099 C147.15888,37.2515756 148.033127,37.6226715 148.343461,38.3907758 Z" fill="#151F4D" />
          <g transform="translate(75.000000, 53.000000)" fillRule="nonzero">
            <path d="M10.4668565,17 L12.1981357,10.4317245 C13.8185702,4.28398142 19.3780491,0 25.7357651,0 L72.5058976,0 C78.7504886,0 84.2400602,4.13570347 85.9626773,10.1379953 L87.9320262,17" fill="#151F4D" />
            <polygon fill="#293763" points="10.4668565 17 87.9320262 17 91.6856636 31.0065692 6.98343984 31" />
            <polygon fill="#3655D2" points="6.98343984 31 91.6856636 31.0122201 97.5166635 51.9600165 0.393689944 51.9600165" />
            <path d="M12,43 L86,43 C92.627417,43 98,48.372583 98,55 L98,61 C98,67.627417 92.627417,73 86,73 L12,73 C5.372583,73 0,67.627417 0,61 L0,55 C0,48.372583 5.372583,43 12,43 Z" fill="#9CABDB" />
            <path d="M78.1,58.6 C78.1,59.6 77.3,60.4 76.3,60.4 L48,60.4 C47,60.4 46.2,59.6 46.2,58.6 C46.2,57.6 47,56.8 48,56.8 L76.3,56.8 C77.3,56.9 78.1,57.7 78.1,58.6 Z" fill="#151F4D" />
            <path d="M16.825,56.7 C15.725,57.8 15.725,59.5 16.825,60.6 C17.925,61.7 19.625,61.7 20.725,60.6 C21.825,59.5 21.825,57.8 20.725,56.7 C19.625,55.6 17.925,55.6 16.825,56.7 Z" fill="#151F4D" />
            <path d="M27.825,56.7 C26.725,57.8 26.725,59.5 27.825,60.6 C28.925,61.7 30.625,61.7 31.725,60.6 C32.825,59.5 32.825,57.8 31.725,56.7 C30.625,55.6 28.925,55.6 27.825,56.7 Z" fill="#151F4D" />
          </g>
        </g>
      </g>
    );
  }
}

export default EmptyExternalVolumeIcon;