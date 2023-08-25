import * as React from 'react';
import { isNil } from 'ramda';
import styled from 'styled-components';
import { LoadingOutlined } from '@ant-design/icons';
import SpinningDominoLogo from '../icons/SpinningDominoLogo';
import useStore from '../globalStore/useStore';
import { fontSizes } from '../styled';

const Container = styled.div`
  display: flex;
  align-items: center;
  svg {
    height: 1em;
    width: 1em;
    margin-right: .5em;
  }
`;

export type Props = {
  children?: any;
};

const InlineWaitSpinner = ({ children }: Props) => {
  const { whiteLabelSettings } = useStore();
  return (
    <Container data-test="spinning-loader">
      { isNil(whiteLabelSettings) ? <div /> : isNil(whiteLabelSettings?.appLogo) ? <SpinningDominoLogo
        primaryColor="currentColor"
        secondaryColor="currentColor"
      /> :
        <LoadingOutlined style={{ fontSize: fontSizes.LARGE }} />
      }
      <span>
        {children}
      </span>
    </Container>
  )
};

export default InlineWaitSpinner;
