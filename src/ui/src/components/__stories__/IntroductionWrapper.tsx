import React from 'react';
import styled from 'styled-components';
import { iconFiles } from '../../icons/__stories__/AllIcons';

const Layout = styled.div`
  display: flex;
  flex-flow: row wrap;
`;

const LinkList = styled.div`
  padding 10px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: stretch;
  row-gap: 10px;
`;

const SubHeading = styled.div`
  --mediumdark: '#999999';
  font-weight: 900;
  font-size: 13px;
  color: #999;
  letter-spacing: 6px;
  line-height: 24px;
  text-transform: uppercase;
  margin-bottom: 12px;
  margin-top: 40px;
`;

const LinkItem = styled.a`
  padding: 20px 30px 20px 15px;
  border: 1px solid #00000010;
  border-radius: 5px;
  transition: background 150ms ease-out, border 150ms ease-out, transform 150ms ease-out;
  color: #333333;
  display: flex;
  gap: 10px;
  align-items: center;
  min-width: 300px;

  :hover {
    border-color: #1EA7FD50;
    transform: translate3d(0, -3px, 0);
    box-shadow: rgba(0, 0, 0, 0.08) 0 3px 10px 0;
  }

  :active {
    border-color: #1EA7FD;
    transform: translate3d(0, 0, 0);
  }
`;

type LinkComponentProps = {
  iconName: string;
  linkText: string;
  linkLocation: string;
}

const LinkComponent = (
  {
    iconName,
    linkText,
    linkLocation,
  } : LinkComponentProps) => (
  <LinkItem href={linkLocation} target="_blank">
    {React.createElement(iconFiles(`./${iconName}.tsx`).default, {width: 24, height: 24})}
    {linkText}
  </LinkItem>);

export const Lists = () => (<Layout>
  <LinkList>
    <SubHeading>Toolboxes</SubHeading>
    <LinkComponent
      iconName="ReactLogo"
      linkText="Source Code"
      linkLocation="https://github.com/cerebrotech/domino/blob/develop/frontend/STORYBOOK.md"
    />
    <LinkComponent
      iconName="FigmaLogo"
      linkText="Vector Components"
      linkLocation="https://www.figma.com/file/kte3RQz103dJsnC1UEnHjl/Domino-Design-System-(DDS)?node-id=80%3A5002"
    />
    <LinkComponent
      iconName="FigmaLogo"
      linkText="Storybook Design"
      linkLocation="https://www.figma.com/file/FkqZB5ociKA9mRT1A4JHix/Storybook-pages?node-id=705%3A6975"
    />
    <LinkComponent
      iconName="ConfluenceLogo"
      linkText="Domino's UX Principles"
      linkLocation="https://dominodatalab.atlassian.net/wiki/x/DAATfg"
    />
    <LinkComponent
      iconName="ConfluenceLogo"
      linkText="Domino Accessibility Guide"
      linkLocation="https://dominodatalab.atlassian.net/wiki/x/CoFfhw"
    />
    <LinkComponent
      iconName="GoogleDocLogo"
      linkText="3rd Party Integration UX Guide"
      linkLocation="https://docs.google.com/document/d/12yXkVCAuFezL9teL30LQabJiRWNU0hNhCY8RWR-yMQg/edit#heading=h.xszjoegg0o89"
    />
  </LinkList>
  <LinkList>
    <SubHeading>Processes</SubHeading>
    <LinkComponent
      iconName="GoogleSlidesLogo"
      linkText="Rationales of Component Library"
      linkLocation="https://docs.google.com/presentation/d/1rDGzpgs1G4e_JwNQfHijJkQraVYXwpRwN_rGRmHgN2s/edit#slide=id.p"
    />
    <LinkComponent
      iconName="GoogleDocLogo"
      linkText="Roadmap Process"
      linkLocation="https://docs.google.com/document/d/1H4e39Zk_7p4xOkYBtb3sYbU0EN2LJ8mAAEyJbvneoOE/edit#"
    />
    <LinkComponent
      iconName="ConfluenceLogo"
      linkText="Eng Best Practices"
      linkLocation="https://dominodatalab.atlassian.net/wiki/spaces/ENG/pages/2124742716/pageId=2124742716"
    />
    <LinkComponent
      iconName="ConfluenceLogo"
      linkText="Eng Execution Plan"
      linkLocation="https://dominodatalab.atlassian.net/wiki/spaces/ENG/pages/2117828671/pageId=2117828671"
    />
    <LinkComponent
      iconName="GoogleSheetsLogo"
      linkText="Component Library Status"
      linkLocation="https://docs.google.com/spreadsheets/d/1oluCsSY2anhgFsKp9P7ELRu_RTIZrW4KbqVx17K4tjA/edit#gid=1969906815"
    />
  </LinkList>
</Layout>);
