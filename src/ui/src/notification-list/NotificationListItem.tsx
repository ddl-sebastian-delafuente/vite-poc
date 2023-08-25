import * as React from 'react';
import * as colors from '../styled/colors';
import styled from 'styled-components';

const MessageWrapper = styled.div`
  padding-top: 9px;
  color: ${colors.secondaryTextGray};
  font-size: 14px;
  line-height: 16px;
`;

const CTALinkStyleWrapper = styled.span`
  padding-left: 12px;
  color: ${colors.basicLink};
  font-size: 14px;
  line-height: 16px;
`;

export type CTADescriptor = {
  type?: string,
  element?: any
}

export type Props = {
  MessageSection: any,
  CTA?: CTADescriptor | any
}

const generateCTASection: any = (type: string, CTAElement: any) => {
  // Added switch so it is extensible
  switch(type) {
    case ("link"):
      return (
        <CTALinkStyleWrapper>
          {CTAElement}
        </CTALinkStyleWrapper>
      )
    default:
      return (
        <CTALinkStyleWrapper>
          {CTAElement}
        </CTALinkStyleWrapper>
      )
  }
}

const NotificationListItem = ({ MessageSection, CTA }: Props) => (
  <MessageWrapper>
    {MessageSection}
    {CTA && CTA.element && generateCTASection(CTA.type, CTA.element)}
  </MessageWrapper>
);

export default NotificationListItem;
