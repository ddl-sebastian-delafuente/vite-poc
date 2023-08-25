import * as React from 'react';
import Icon, { IconProps } from './Icon';

class EmptyOutputs extends Icon<{}> {
  public static defaultProps: IconProps = {
    className: '',
    height: 160,
    width: 201,
    viewBox: '0 0 201 160',
    primaryColor: 'currentColor',
  };

  renderContent() {
    return (
      <g fill="none">
        <rect x="1" y="0.5" width="199" height="159" rx="1.5" fill="#FAFBFC" stroke="#E0E0E0"/>
        <path d="M55.1875 41.8281H48.1758L45.8848 39.6367C45.8556 39.6094 45.8173 39.5941 45.7773 39.5938H40.8125C40.4668 39.5938 40.1875 39.873 40.1875 40.2188V51.7812C40.1875 52.127 40.4668 52.4062 40.8125 52.4062H55.1875C55.5332 52.4062 55.8125 52.127 55.8125 51.7812V42.4531C55.8125 42.1074 55.5332 41.8281 55.1875 41.8281ZM54.4062 51H41.5938V41H45.2754L47.6113 43.2344H54.4062V51Z" fill="#62719F"/>
        <rect x="61.25" y="42.25" width="65.5" height="7.5" rx="3.75" stroke="#62719F" strokeWidth="1.5"/>
        <path d="M66.8027 67.9434L65.2832 69.8809L64.4805 68.8574C64.4659 68.8387 64.4472 68.8236 64.4259 68.8133C64.4045 68.8029 64.3811 68.7975 64.3574 68.7975C64.3337 68.7975 64.3103 68.8029 64.289 68.8133C64.2677 68.8236 64.249 68.8387 64.2344 68.8574L62.2852 71.3418C62.2671 71.3648 62.2559 71.3925 62.2529 71.4216C62.2498 71.4506 62.255 71.48 62.2678 71.5063C62.2807 71.5326 62.3006 71.5547 62.3255 71.5702C62.3503 71.5856 62.379 71.5938 62.4082 71.5938H69.5938C69.7246 71.5938 69.7969 71.4434 69.7168 71.3418L67.0508 67.9434C67.036 67.9247 67.0171 67.9095 66.9956 67.8992C66.9742 67.8888 66.9506 67.8834 66.9268 67.8834C66.9029 67.8834 66.8794 67.8888 66.8579 67.8992C66.8364 67.9095 66.8175 67.9247 66.8027 67.9434ZM63.0312 66.6328C63.0312 66.84 63.1136 67.0387 63.2601 67.1852C63.4066 67.3318 63.6053 67.4141 63.8125 67.4141C64.0197 67.4141 64.2184 67.3318 64.3649 67.1852C64.5114 67.0387 64.5938 66.84 64.5938 66.6328C64.5938 66.4256 64.5114 66.2269 64.3649 66.0804C64.2184 65.9339 64.0197 65.8516 63.8125 65.8516C63.6053 65.8516 63.4066 65.9339 63.2601 66.0804C63.1136 66.2269 63.0312 66.4256 63.0312 66.6328ZM72.6914 63.6367L68.4883 59.4336C68.3711 59.3164 68.2129 59.25 68.0469 59.25H59.75C59.4043 59.25 59.125 59.5293 59.125 59.875V76.125C59.125 76.4707 59.4043 76.75 59.75 76.75H72.25C72.5957 76.75 72.875 76.4707 72.875 76.125V64.0801C72.875 63.9141 72.8086 63.7539 72.6914 63.6367ZM71.4336 64.3672H67.7578V60.6914L71.4336 64.3672ZM71.4688 75.3438H60.5312V60.6562H66.4297V64.875C66.4297 65.0926 66.5161 65.3012 66.67 65.455C66.8238 65.6089 67.0324 65.6953 67.25 65.6953H71.4688V75.3438Z" fill="#62719F"/>
        <path d="M83 64.25C80.9289 64.25 79.25 65.9289 79.25 68C79.25 70.0711 80.9289 71.75 83 71.75H147C149.071 71.75 150.75 70.0711 150.75 68C150.75 65.9289 149.071 64.25 147 64.25H83Z" stroke="#62719F" strokeWidth="1.5"/>
        <path d="M72.6914 85.6367L68.4883 81.4336C68.3711 81.3164 68.2129 81.25 68.0469 81.25H59.75C59.4043 81.25 59.125 81.5293 59.125 81.875V98.125C59.125 98.4707 59.4043 98.75 59.75 98.75H72.25C72.5957 98.75 72.875 98.4707 72.875 98.125V86.0801C72.875 85.9141 72.8086 85.7539 72.6914 85.6367ZM71.4336 86.3672H67.7578V82.6914L71.4336 86.3672ZM71.4688 97.3438H60.5312V82.6562H66.4297V86.875C66.4297 87.0926 66.5161 87.3012 66.67 87.455C66.8238 87.6089 67.0324 87.6953 67.25 87.6953H71.4688V97.3438ZM65.8438 92.0703H62.25C62.1641 92.0703 62.0938 92.1406 62.0938 92.2266V93.1641C62.0938 93.25 62.1641 93.3203 62.25 93.3203H65.8438C65.9297 93.3203 66 93.25 66 93.1641V92.2266C66 92.1406 65.9297 92.0703 65.8438 92.0703ZM62.0938 89.5703V90.5078C62.0938 90.5938 62.1641 90.6641 62.25 90.6641H69.75C69.8359 90.6641 69.9062 90.5938 69.9062 90.5078V89.5703C69.9062 89.4844 69.8359 89.4141 69.75 89.4141H62.25C62.1641 89.4141 62.0938 89.4844 62.0938 89.5703Z" fill="#62719F"/>
        <rect x="79.25" y="86.25" width="81.5" height="7.5" rx="3.75" stroke="#62719F" strokeWidth="1.5"/>
        <path d="M55.1875 107.828H48.1758L45.8848 105.637C45.8556 105.609 45.8173 105.594 45.7773 105.594H40.8125C40.4668 105.594 40.1875 105.873 40.1875 106.219V117.781C40.1875 118.127 40.4668 118.406 40.8125 118.406H55.1875C55.5332 118.406 55.8125 118.127 55.8125 117.781V108.453C55.8125 108.107 55.5332 107.828 55.1875 107.828ZM54.4062 117H41.5938V107H45.2754L47.6113 109.234H54.4062V117Z" fill="#62719F"/>
        <rect x="61.25" y="108.25" width="65.5" height="7.5" rx="3.75" stroke="#62719F" strokeWidth="1.5"/>
      </g>
    );
  }
}

export default EmptyOutputs;