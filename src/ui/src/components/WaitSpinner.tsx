import * as React from 'react';
import styled from 'styled-components';
import { isNil } from 'ramda';
import { baseColor } from '../styled/colors';
import { IconProps } from '../icons/Icon';
import SpinningDominoLogo from '../icons/SpinningDominoLogo';
import { themeHelper } from '../styled';
import useStore from '../globalStore/useStore';
import { LoadingOutlined } from '@ant-design/icons';

const WaitSpinnerContainer = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface SpinnerAndChildrenWrapperProps {
  margin: string;
}
const SpinnerAndChildrenWrapper = styled.div<SpinnerAndChildrenWrapperProps>`
  text-align: center;
  margin: ${({ margin }) => margin};
`;

const SimpleChildrenContainer = styled.div`
  padding: ${themeHelper('margins.small')};
  display: block;
  color: ${baseColor};
  white-space: pre-wrap;
`;

const ChildrenContainer = styled(SimpleChildrenContainer)`
  width: 300px;
`;

interface SimpleWaitSpinnerContainerProps {
  margin: string;
}
const SimpleWaitSpinnerContainer = styled.div<SimpleWaitSpinnerContainerProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin: ${({ margin }) => margin};
`;

export interface WaitSpinnerProps {
  forPage?: boolean;
  height?: number;
  width?: number;
  fill?: string;
  margin?: string;
  className?: string;
  dataTest?: string;
  DominoIcon?: React.ComponentClass<IconProps>;
  children?: React.ReactNode;
}
export const WaitSpinner = (props: WaitSpinnerProps) => {
  const { whiteLabelSettings } = useStore();
  const {
    forPage = false,
    children,
    fill = themeHelper('mainFontColor')(props),
    height = 60,
    margin = '25px 0px',
    width = 60,
    className = '',
    dataTest = 'wait-spinner',
    DominoIcon = SpinningDominoLogo,
  } = props;

  const icon = (isNil(whiteLabelSettings) ? <div /> :
    isNil(whiteLabelSettings?.appLogo) ?
      <DominoIcon
        height={height}
        width={width}
        primaryColor={fill}
      /> :
      <LoadingOutlined style={{ fontSize: height }} />
  );

  if (forPage) {
    const spinnerWithChildren = (
      <WaitSpinnerContainer className={className} data-test={dataTest}>
        <SpinnerAndChildrenWrapper margin={margin}>
          {icon}
          {children &&
            <ChildrenContainer>
              {children}
            </ChildrenContainer>}
        </SpinnerAndChildrenWrapper>
      </WaitSpinnerContainer>
    );

    return (
      <div>
        {spinnerWithChildren}
      </div>
    );
  }

  return (
    <SimpleWaitSpinnerContainer margin={margin} data-test={dataTest}>
      {icon}
      {children &&
        <SimpleChildrenContainer>
          {children}
        </SimpleChildrenContainer>}
    </SimpleWaitSpinnerContainer>
  );
};

export default WaitSpinner;
