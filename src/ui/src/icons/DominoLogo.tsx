import * as React from 'react';
import Icon, { IconProps } from './Icon';

class DominoLogo extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    height: 25,
    width: 25,
    viewBox: '0 0 31.1 31.1',
    primaryColor: 'white',
    secondaryColor: '#4473FF',
  };

  renderContent() {
    const {
      primaryColor,
      secondaryColor,
    } = this.props;

    return (
      <g>
        <path d="M14.651871,5.82193548 C14.8314839,5.82193548 15.008,5.77341935 15.163871,5.6836129 L20.9806452,2.32670968 C21.4689032,2.04387097 21.6392258,1.41522581 21.3553548,0.925935484 C21.1736774,0.609032258 20.8309677,0.412903226 20.4676129,0.412903226 C20.288,0.412903226 20.1114839,0.461419355 19.9556129,0.554322581 L14.139871,3.90916129 C13.9024516,4.04645161 13.732129,4.26735484 13.6619355,4.53264516 C13.5896774,4.79896774 13.6258065,5.07354839 13.7630968,5.31096774 C13.9458065,5.62787097 14.2864516,5.82296774 14.6508387,5.82296774" fill={secondaryColor}/>
        <path d="M8.84645161,7.7316129 C9.00129032,7.81935484 9.17677419,7.86580645 9.35535484,7.86580645 C9.72180645,7.86580645 10.0624516,7.67277419 10.2451613,7.35587097 L13.6051613,1.53806452 C13.7393548,1.30064516 13.7765161,1.02606452 13.7063226,0.760774194 C13.636129,0.495483871 13.4658065,0.275612903 13.2294194,0.137290323 C13.0725161,0.047483871 12.8949677,0 12.7153548,0 C12.3509677,0 12.0103226,0.196129032 11.8276129,0.513032258 L8.47277419,6.33083871 C8.18683871,6.81909677 8.35612903,7.44567742 8.84645161,7.73058065 L8.84645161,7.7316129 Z M25.2830968,18.9770323 C24.7174194,18.9770323 24.2580645,19.4384516 24.2580645,20.0030968 L24.2580645,26.7230968 C24.2580645,27.2877419 24.7174194,27.7450323 25.2830968,27.7450323 C25.5576774,27.7450323 25.8167742,27.6376774 26.0098065,27.4456774 C26.2018065,27.2526452 26.3091613,26.9956129 26.3070968,26.7230968 L26.3091613,20.0030968 C26.3091613,19.4394839 25.8487742,18.9770323 25.2830968,18.9770323 Z M17.4554839,25.6929032 C17.2738065,25.3770323 16.9341935,25.1767742 16.5677419,25.1767742 C16.388129,25.1767742 16.2105806,25.2263226 16.0557419,25.3150968 L10.24,28.6730323 C9.75174194,28.9579355 9.58141935,29.5845161 9.86322581,30.0748387 C10.0469677,30.3917419 10.3855484,30.5858065 10.7509677,30.5858065 C10.9316129,30.5858065 11.108129,30.5372903 11.264,30.4474839 L17.0797419,27.0885161 C17.3150968,26.9543226 17.4854194,26.7354839 17.5576774,26.4691613 C17.6299355,26.2049032 17.5927742,25.9292903 17.4544516,25.691871 L17.4554839,25.6929032 Z M22.267871,23.3847742 C22.1109677,23.296 21.9354839,23.2464516 21.7579355,23.2464516 C21.3904516,23.2464516 21.0498065,23.4467097 20.8701935,23.7625806 L17.5091613,29.5762581 C17.2283871,30.0655484 17.3976774,30.6910968 17.883871,30.976 C18.0387097,31.0658065 18.2172903,31.1143226 18.3979355,31.1143226 C18.7623226,31.1143226 19.1029677,30.9150968 19.2836129,30.6023226 L22.6425806,24.7845161 C22.9264516,24.2952258 22.7581935,23.6696774 22.267871,23.3837419 L22.267871,23.3847742 Z M27.0916129,14.0304516 C26.9099355,13.7166452 26.5692903,13.5215484 26.2018065,13.5215484 C26.0242581,13.5215484 25.8477419,13.5690323 25.6908387,13.6578065 C25.4534194,13.7950968 25.284129,14.016 25.2129032,14.2771613 C25.1427097,14.5455484 25.1788387,14.8211613 25.3140645,15.0544516 L28.6730323,20.8763871 C28.8557419,21.188129 29.1963871,21.3852903 29.5628387,21.3852903 C29.7383226,21.3852903 29.9138065,21.3357419 30.0727742,21.2510968 C30.3101935,21.1096774 30.4815484,20.8856774 30.5507097,20.6214194 C30.6188387,20.356129 30.5837419,20.0846452 30.4474839,19.8503226 L27.0895484,14.0304516 L27.0916129,14.0304516 Z M30.5992258,11.8286452 L24.7845161,8.46864516 C24.6296774,8.37987097 24.4541935,8.33135484 24.2745806,8.33135484 C23.908129,8.33135484 23.5674839,8.52748387 23.3837419,8.8443871 C23.2474839,9.08180645 23.2123871,9.3563871 23.2825806,9.62167742 C23.3527742,9.88593548 23.5230968,10.1068387 23.7605161,10.244129 L29.5762581,13.6020645 C29.7331613,13.6898065 29.9086452,13.7383226 30.0892903,13.7383226 C30.4526452,13.7383226 30.7932903,13.5421935 30.9770323,13.2252903 C31.2588387,12.7329032 31.0905806,12.1073548 30.5992258,11.8255484 L30.5992258,11.8286452 Z M20.0030968,6.85419355 L26.7210323,6.85419355 C27.2867097,6.85419355 27.748129,6.39587097 27.748129,5.82812903 C27.748129,5.26451613 27.2887742,4.80619355 26.724129,4.80619355 L20.004129,4.80619355 C19.4405161,4.80619355 18.980129,5.26348387 18.980129,5.82812903 C18.980129,6.39587097 19.4394839,6.85316129 20.004129,6.85316129 L20.0030968,6.85419355 Z M5.83225806,12.1331613 C6.39690323,12.1331613 6.85625806,11.6727742 6.85625806,11.108129 L6.85625806,4.38812903 C6.85625806,3.82451613 6.39690323,3.36619355 5.83225806,3.36619355 C5.26658065,3.36619355 4.80722581,3.82451613 4.80722581,4.38812903 L4.80722581,11.108129 C4.80722581,11.6727742 5.26658065,12.1331613 5.83225806,12.1331613 Z M6.84387097,22.7778065 C7.20825806,22.7778065 7.54787097,22.5847742 7.7316129,22.2689032 C8.01341935,21.7775484 7.84516129,21.1499355 7.35587097,20.8650323 L1.53806452,17.5070968 C1.38322581,17.4183226 1.20567742,17.3729032 1.02812903,17.3729032 C0.662709677,17.3729032 0.321032258,17.5659355 0.137290323,17.8818065 C-4.58400679e-16,18.1223226 -0.0350967742,18.3979355 0.0371612903,18.6663226 C0.107354839,18.9274839 0.278709677,19.1494194 0.514064516,19.2825806 L6.32980645,22.6405161 C6.48464516,22.7334194 6.66219355,22.7778065 6.84283871,22.7778065 L6.84387097,22.7778065 Z M4.02580645,17.0776774 C4.20645161,17.3945806 4.54709677,17.5938065 4.91354839,17.5938065 C5.09109677,17.5938065 5.2676129,17.5463226 5.42451613,17.4554839 C5.91380645,17.1695484 6.08206452,16.544 5.79922581,16.0557419 L2.44025806,10.2379355 C2.25858065,9.92103226 1.92,9.72490323 1.55251613,9.72490323 C1.37393548,9.72490323 1.19845161,9.77445161 1.04258065,9.86425806 C0.80516129,10.0015484 0.633806452,10.2224516 0.563612903,10.4877419 C0.493419355,10.7509677 0.529548387,11.0296774 0.66683871,11.264 L4.02580645,17.0776774 Z M11.835871,26.0067097 C12.0299355,25.8105806 12.1352258,25.5556129 12.1352258,25.2820645 C12.1352258,24.7184516 11.6748387,24.260129 11.1091613,24.260129 L4.39225806,24.260129 C3.8276129,24.260129 3.36825806,24.7184516 3.36825806,25.2820645 C3.36825806,25.8467097 3.8276129,26.304 4.39225806,26.304 L11.1091613,26.304 C11.3847742,26.304 11.6428387,26.1976774 11.835871,26.0046452 L11.835871,26.0067097 Z" fill={primaryColor} />
      </g>
    );
  }
}

export default DominoLogo;
