import * as React from 'react';
import Icon, { IconProps } from './Icon';
import { tango } from '../styled/colors';

class SparkIcon extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    width: 57,
    height: 31,
    viewBox: '0 0 57 31',
    primaryColor: tango,
  };

  renderContent() {
    const {
      primaryColor,
    } = this.props;

    return (
      <g fill="none">
        <path fill={primaryColor} d="M45.4768519,3.44814815 C45.4416667,3.62407407 45.3888889,3.8 45.3712963,3.97592593 C45.2305556,4.75 45.0898148,5.52407407 44.9490741,6.29814815 C44.8259259,7.03703704 44.6851852,7.75833333 44.562037,8.49722222 C44.5444444,8.62037037 44.4916667,8.67314815 44.3685185,8.70833333 C43.2777778,9.04259259 42.2046296,9.39444444 41.1138889,9.7462963 C40.5685185,9.92222222 40.0231481,10.0805556 39.4601852,10.2564815 C39.4074074,10.2740741 39.3722222,10.3092593 39.2666667,10.362037 C40.6212963,10.9074074 41.9231481,11.4175926 43.2601852,11.962963 C43.0138889,12.1388889 42.8027778,12.2796296 42.5740741,12.4203704 C41.9583333,12.825 41.325,13.2296296 40.7092593,13.6342593 C40.6037037,13.7046296 40.4981481,13.7046296 40.375,13.6518519 C39.3722222,13.1944444 38.3518519,12.7546296 37.3490741,12.2796296 C36.662963,11.962963 36.1351852,11.5055556 35.9240741,10.7490741 C35.7833333,10.2564815 35.9416667,9.81666667 36.2759259,9.44722222 C36.6805556,9.00740741 37.1907407,8.7962963 37.7361111,8.62037037 C38.5981481,8.35648148 39.4425926,8.075 40.3046296,7.79351852 C41.0259259,7.56481481 41.7472222,7.3537037 42.4685185,7.10740741 C42.5564815,7.07222222 42.6268519,6.96666667 42.662037,6.86111111 C42.75,6.43888889 42.8203704,5.99907407 42.8907407,5.57685185 C43.0138889,4.83796296 43.1546296,4.09907407 43.2777778,3.36018519 C43.3657407,2.85 43.4361111,2.35740741 43.5768519,1.86481481 C43.7527778,1.21388889 44.0694444,0.650925926 44.6851852,0.281481481 C45.1777778,-1.28508315e-13 45.6351852,0.0527777778 46.0925926,0.334259259 C46.55,0.615740741 46.8138889,1.05555556 47.0777778,1.49537037 C47.7814815,2.65648148 48.4851852,3.81759259 49.1888889,4.9962963 C49.2768519,5.15462963 49.4,5.11944444 49.5231481,5.08425926 C49.8925926,4.9962963 50.262037,4.87314815 50.6314815,4.78518519 C51.3703704,4.59166667 52.1268519,4.39814815 52.8657407,4.18703704 C53.5342593,4.01111111 54.1851852,3.83518519 54.8537037,3.65925926 C55.2231481,3.5712963 55.6101852,3.53611111 55.9972222,3.64166667 C56.7537037,3.83518519 57.0527778,4.48611111 56.7537037,5.24259259 C56.5601852,5.71759259 56.2259259,6.08703704 55.9092593,6.45648148 C55.3990741,7.07222222 54.8888889,7.67037037 54.3787037,8.26851852 C53.7453704,9.00740741 53.112037,9.76388889 52.4787037,10.5203704 C52.4259259,10.5731481 52.4259259,10.7314815 52.4611111,10.8018519 C52.6194444,11.1361111 52.7953704,11.4527778 52.9537037,11.7694444 C53.3935185,12.5962963 53.8333333,13.4407407 54.2731481,14.2675926 C54.4138889,14.5490741 54.5898148,14.812963 54.712963,15.112037 C54.8361111,15.3935185 54.9592593,15.7101852 54.9944444,16.0092593 C55.0472222,16.3787037 54.9064815,16.7481481 54.6777778,17.0472222 C54.3083333,17.5574074 53.7805556,17.7861111 53.1648148,17.7861111 C52.7953704,17.7861111 52.4259259,17.662963 52.0564815,17.575 C51.1064815,17.2935185 50.1564815,16.9944444 49.2064815,16.6953704 C49.0657407,16.6425926 48.9074074,16.6074074 48.7666667,16.5546296 C48.7138889,16.537037 48.6611111,16.4842593 48.6435185,16.4314815 C48.5027778,15.6222222 48.362037,14.812963 48.2212963,13.9685185 C49.5055556,14.3203704 50.737037,14.6722222 51.9861111,15.0064815 C52.0037037,14.9888889 52.0037037,14.9712963 52.0212963,14.9537037 C51.8805556,14.6898148 51.7574074,14.4259259 51.6166667,14.162037 C51.3175926,13.5814815 51.0185185,13.0185185 50.7194444,12.4555556 C50.437963,11.9277778 50.1564815,11.4 49.875,10.8898148 C49.7166667,10.6083333 49.7166667,10.5907407 49.9453704,10.3444444 C50.2972222,9.95740741 50.6314815,9.55277778 50.9657407,9.14814815 C51.3351852,8.70833333 51.7046296,8.26851852 52.0740741,7.8287037 C52.4611111,7.3712963 52.8657407,6.8962963 53.2527778,6.43888889 C53.2703704,6.4037037 53.287963,6.36851852 53.3231481,6.29814815 C53.2175926,6.31574074 53.1472222,6.31574074 53.0768519,6.33333333 C51.4759259,6.75555556 49.8574074,7.17777778 48.2564815,7.61759259 C48.1157407,7.65277778 48.0453704,7.61759259 47.975,7.51203704 C47.3416667,6.43888889 46.7083333,5.38333333 46.0574074,4.32777778 C45.9166667,4.09907407 45.7935185,3.87037037 45.6527778,3.64166667 C45.6175926,3.58888889 45.5824074,3.5537037 45.5296296,3.50092593 C45.5296296,3.43055556 45.512037,3.43055556 45.4768519,3.44814815 Z"/>
        <path fill="#000" d="M11.9453704 26.0546296C11.8222222 26.9694444 11.6990741 27.8842593 11.5935185 28.7990741 11.5407407 29.1509259 11.5055556 29.5027778 11.4527778 29.8722222 11.4527778 29.925 11.3648148 30.012963 11.3296296 30.012963 10.6083333 30.0305556 9.88703704 30.012963 9.13055556 30.012963 9.18333333 29.5731481 9.23611111 29.1509259 9.28888889 28.7462963 9.41203704 27.8138889 9.53518519 26.8814815 9.65833333 25.9490741 9.81666667 24.7175926 9.99259259 23.5037037 10.1509259 22.2722222 10.2388889 21.5685185 10.3268519 20.8648148 10.5907407 20.1962963 11.5231481 17.7333333 14.0740741 15.8861111 16.8361111 16.0444444 19.1231481 16.1675926 21.0231481 17.9444444 21.2518519 20.1962963 21.4101852 21.85 20.9175926 23.3101852 19.8972222 24.5768519 18.8416667 25.8787037 17.487037 26.7055556 15.8333333 26.9518519 14.5314815 27.1453704 13.3175926 26.8990741 12.2268519 26.1601852 12.1740741 26.125 12.1037037 26.0898148 12.0509259 26.0546296 11.9981481 26.037037 11.9805556 26.037037 11.9453704 26.0546296zM16.1324074 18.3842593C16.0092593 18.3842593 15.8509259 18.3842593 15.7101852 18.4194444 14.1268519 18.6657407 12.9305556 19.8092593 12.6138889 21.3925926 12.262037 23.0990741 13.5111111 24.6472222 15.2527778 24.6648148 16.8888889 24.6824074 18.437037 23.4509259 18.8064815 21.85 19.2111111 19.9851852 17.9972222 18.4018519 16.1324074 18.3842593zM10.7490741 14.4962963C9.975 15.0768519 9.21851852 15.6398148 8.44444444 16.2027778 8.25092593 15.9388889 8.09259259 15.675 7.89907407 15.4287037 7.30092593 14.6898148 6.29814815 14.5490741 5.57685185 15.112037 5.08425926 15.4990741 4.96111111 16.062037 5.36574074 16.5546296 5.91111111 17.2055556 6.49166667 17.8212963 7.05462963 18.4546296 7.54722222 19 8.075 19.5101852 8.51481481 20.0907407 9.32407407 21.1287037 9.46481481 22.3074074 9.04259259 23.5388889 8.37407407 25.5092593 6.94907407 26.6351852 4.92592593 27.0222222 4.13425926 27.162963 3.325 27.1277778 2.55092593 26.8990741 1.60092593 26.6.932407407 25.9666667.510185185 25.0694444.351851852 24.7527778.246296296 24.4185185.105555556 24.0666667.967592593 23.6092593 1.79444444 23.1694444 2.6037037 22.7296296 2.77962963 23.0638889 2.92037037 23.3981481 3.11388889 23.7148148 3.88796296 24.9111111 5.18981481 24.7175926 5.9462963 24.1194444 6.70277778 23.5212963 6.80833333 22.712037 6.22777778 21.9555556 5.85833333 21.4805556 5.41851852 21.0583333 5.01388889 20.6009259 4.41574074 19.9148148 3.78240741 19.2638889 3.23703704 18.5601852 2.05833333 17.0296296 2.33981481 15.287963 3.51851852 13.9509259 4.29259259 13.0712963 5.26018519 12.4907407 6.4212963 12.2972222 7.51203704 12.1212963 8.55 12.262037 9.46481481 12.9657407 9.975 13.3703704 10.3796296 13.9157407 10.7490741 14.4962963zM32.5111111 26.7407407L30.2064815 26.7407407C30.2768519 26.2833333 30.3296296 25.8259259 30.3824074 25.3685185 30.5231481 24.2601852 30.6814815 23.1518519 30.8046296 22.0435185 30.875 21.4453704 30.8398148 20.8472222 30.6638889 20.2666667 30.2944444 19.0351852 29.45 18.3842593 28.1481481 18.3842593 26.5296296 18.3666667 24.9990741 19.5805556 24.6296296 21.1638889 24.4009259 22.1314815 24.5416667 23.0287037 25.2453704 23.7851852 26.0194444 24.612037 26.987037 24.8055556 28.0601852 24.5592593 28.7462963 24.4009259 29.3092593 24.0490741 29.837037 23.5212963L29.837037 23.75C29.7314815 24.612037 29.6083333 25.4564815 29.5027778 26.3185185 29.5027778 26.3712963 29.4324074 26.4592593 29.3796296 26.4768519 27.5148148 27.3212963 25.262963 27.2157407 23.6444444 25.7555556 22.8351852 25.0166667 22.3425926 24.0666667 22.2194444 22.9759259 21.9555556 20.7944444 22.7824074 19.0175926 24.4009259 17.575 25.2805556 16.7833333 26.3185185 16.2907407 27.4796296 16.0972222 29.537963 15.7453704 31.5611111 16.537037 32.6166667 18.3490741 33.2148148 19.3694444 33.337963 20.4777778 33.1796296 21.6388889 33.0037037 22.887963 32.8453704 24.137037 32.687037 25.4037037 32.6342593 25.8435185 32.5814815 26.2833333 32.5111111 26.7407407zM39.5481481 26.7231481C39.6009259 26.3537037 39.6361111 25.9842593 39.6888889 25.6148148 39.9175926 23.9083333 40.1287037 22.2018519 40.3574074 20.4953704 40.6212963 18.5425926 40.8675926 16.5898148 41.1314815 14.637037 41.1490741 14.5490741 41.2018519 14.4435185 41.2722222 14.3907407 42.1342593 13.8277778 42.9962963 13.2648148 43.8759259 12.7018519 43.8935185 12.6842593 43.9287037 12.6842593 43.9814815 12.6490741 43.7175926 14.725 43.4361111 16.7833333 43.1722222 18.8416667 43.1898148 18.8592593 43.2074074 18.8592593 43.2425926 18.8768519 44.65 17.3111111 46.0574074 15.7453704 47.5 14.162037 47.5527778 14.4962963 47.6055556 14.7777778 47.6583333 15.0768519 47.7462963 15.5518519 47.8166667 16.0268519 47.9046296 16.5018519 47.9222222 16.6425926 47.887037 16.7305556 47.7990741 16.8361111 46.9018519 17.7685185 46.0046296 18.7185185 45.1074074 19.6685185 44.9666667 19.8092593 44.9842593 19.8972222 45.0898148 20.0555556 46.637963 22.2194444 48.1685185 24.3833333 49.7166667 26.5296296 49.7518519 26.5824074 49.787037 26.6351852 49.8574074 26.7231481L49.1361111 26.7231481 46.937037 26.7231481C46.7962963 26.7231481 46.7259259 26.687963 46.6555556 26.5648148 45.4592593 24.7527778 44.262963 22.9231481 43.0666667 21.1111111 43.0314815 21.0583333 42.9962963 21.0231481 42.9259259 20.9351852 42.8907407 21.1814815 42.8555556 21.375 42.837963 21.5861111 42.662037 22.9583333 42.4685185 24.312963 42.2925926 25.6851852 42.2574074 25.9842593 42.2222222 26.2657407 42.187037 26.5648148 42.1694444 26.6703704 42.1518519 26.7231481 42.0287037 26.7231481L39.6712963 26.7231481C39.6009259 26.7407407 39.5833333 26.7407407 39.5481481 26.7231481zM39.7240741 16.2731481C39.6185185 17.1175926 39.512963 17.8916667 39.4074074 18.7009259L38.5981481 18.7009259 37.9824074 18.7009259C37.5074074 18.7009259 37.1027778 19.0175926 37.05 19.4925926 36.8916667 20.6537037 36.7509259 21.8148148 36.5925926 22.9759259 36.4342593 24.1722222 36.2759259 25.3685185 36.1175926 26.5648148 36.1175926 26.6175926 36.1 26.6703704 36.0824074 26.7407407L33.7074074 26.7407407C33.7425926 26.4064815 33.7777778 26.0898148 33.8305556 25.7555556 33.9537037 24.8231481 34.0768519 23.8731481 34.2 22.9407407 34.3759259 21.6212963 34.5342593 20.3018519 34.7453704 18.9824074 34.9388889 17.6981481 36.1175926 16.537037 37.4018519 16.3611111 38.1407407 16.2555556 38.9148148 16.2907407 39.7240741 16.2731481z"/>
      </g>
    );
  }
}

export default SparkIcon;
