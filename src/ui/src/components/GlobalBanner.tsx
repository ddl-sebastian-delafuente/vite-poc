import * as React from 'react';
import styled from 'styled-components';
import { themeHelper } from '@domino/ui/dist/styled/themeUtils';
import useStore from '@domino/ui/dist/globalStore/useStore';
import { CloseOutlined } from '@ant-design/icons';

const Container = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
`;
const CloseButton = styled.button`
  position: absolute;
  right: 10px;
  background: transparent;
  border: none;
  font-size: ${themeHelper('fontSizes.medium')};
  cursor: pointer;
`;

const StyledDiv = styled.div`
  width: 100%;
`;

const key = 'global-banner-expiry';
const hideGlobalBanner = 'hide-global-banner';

const canShowBanner = (key: string, isReapperTimeConfigured: boolean) => {
  const shouldHide = localStorage.getItem(hideGlobalBanner);
  if (!isReapperTimeConfigured && shouldHide === 'true') {
    return false;
  }
  const expiryTime = localStorage.getItem(key);
  const now = new Date();
  if (!expiryTime) {
    return true;
  }
  if (now.getTime() > +expiryTime) {
    return true;
  }
  return false;
}

const GlobalBanner = () => {
  const { principal, formattedPrincipal } = useStore();
  const [hideBanner, setHideBanner] = React.useState(true);
  const isReapperTimeConfigured = !!principal?.globalBannerSettings?.reappearTimeAfterCloseInSec;

  React.useEffect(() => {
    if(formattedPrincipal?._loaded){
      setHideBanner(!canShowBanner(key, isReapperTimeConfigured));
    }
  },[formattedPrincipal?._loaded]);

  const onClick = () => {
    const expiryTime = principal?.globalBannerSettings?.reappearTimeAfterCloseInSec;
    if (expiryTime) {
      setHideBanner(true);
      setExpiry(key, expiryTime);
    } else {
      setHideBanner(true);
      localStorage.setItem(hideGlobalBanner, 'true');
    }
  }

  const setExpiry = (key: string, ttl: number) => {
    const now = new Date();
    localStorage.setItem(key, (now.getTime() + ttl * 1000).toString())
  }

  if (!formattedPrincipal?._loaded) {
    return null;
  }

  return (hideBanner || !(principal?.globalBannerSettings?.content)) ? <></> : (
    <Container>
      <StyledDiv dangerouslySetInnerHTML={{ __html: principal.globalBannerSettings.content! }}></StyledDiv>
      {principal.globalBannerSettings?.isClosable &&
        <CloseButton onClick={onClick}> <CloseOutlined data-test="global-banner-close" /> </CloseButton>}
    </Container>
  );
}

export default GlobalBanner;
