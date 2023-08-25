import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import DominoLogo from '../../../icons/DominoLogo';
import useStore from '../../../globalStore/useStore';

const ImgWrapper = styled.img<{bgColor?: string}>`
  background: ${props => props.bgColor};
  border-radius: 2px;
  padding: 2px;
`;

const WhiteLabelImg = ({size, appLogo}: {size: number, appLogo: string}) => {
  const { whiteLabelSettings } = useStore();
  return <ImgWrapper width={size} src={appLogo} bgColor={whiteLabelSettings?.appLogoBgColor}/>;
}

const getAppLogo = (appLogo: string | undefined, fill: string, size = 25, isLoading = false) => (
  isLoading ? <div/> :
    (
      R.isNil(appLogo) ? (
          <DominoLogo
            className="logo"
            primaryColor={fill}
            secondaryColor={fill}
            width={size}
            height={size}
          />) : <WhiteLabelImg size={size} appLogo={appLogo}/>));
  
export default getAppLogo;
