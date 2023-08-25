import * as React from 'react';
import { is } from 'ramda';
import { Layout } from 'antd';
import styled from 'styled-components';
import { LinkProps as RouteLinkProps } from 'react-router-dom';
import { StyledInfoCircleOutlined as Info } from '@domino/ui/dist/components/Callout/InfoBox';
import { themeHelper } from '../../styled';
import { white, lightGreyCardBorderColor } from '../../styled/colors';
import MainContentLayout from '../MainContentLayout';
import OptionalTooltip from '../OptionalTooltip';
import OptionalHyperlink from '../OptionalHyperlink';
import FlexLayout from './FlexLayout';
import tooltipRenderer from '../renderers/TooltipRenderer';
import RouteLink from '../Link/RouteLink';
import EmptyArrowButton, { Direction } from '../EmptyArrowButton';
import { DashedTitleHelpLink } from '../HelpLink';

export const StyledContentBody = styled.div`
  margin-top: ${themeHelper('contentMain.margin')};
  margin-bottom: 120px;
  margin-left: 0px;
  margin-right: 0px;
`;

const Title = styled.div`
  h1 {
    display: flex;
    margin-right: ${themeHelper('margins.tiny')};
    margin-bottom: 0;
    color: ${themeHelper('contentMain.title.color')};
    font-size: ${themeHelper('contentMain.title.fontSize')};
    font-weight: normal;
    text-align: left;
    letter-spacing: -0.5px;
    line-height: ${themeHelper('contentMain.title.height')};
  }
`;

const TitleContainer = styled(FlexLayout)`
  margin-bottom: ${themeHelper('margins.medium')};

  .page-title {
    width: 100%;
  }

  span.help-icon {
    height: ${themeHelper('iconSizes.medium')};
  }
`;

export interface TitleComponentProps {
  info?: string;
  infoHref?: string;
  title?: string | JSX.Element;
  helpText?: string;
  helpArticlePath?: string;
}

export interface AppContentProps extends TitleComponentProps {
  className?: string;
  children: JSX.Element | JSX.Element[] | number | string;
  routedBreadcrumbs?: JSX.Element;
  helpText?: string;
  helpArticlePath?: string;
  dataTest?: string;
  pageActions?: React.ReactNode;
}

const TitleComponent: React.FC<TitleComponentProps> = props => {
  const {
    title,
    info,
    infoHref,
    helpArticlePath,
    helpText
  } = props;
  const infoElement = (
    <OptionalTooltip
      shouldShowTooltip={!!info}
      content={info}
    >
      <OptionalHyperlink href={infoHref}>
        <Info style={{ fontSize: '15px' }} />
      </OptionalHyperlink>
    </OptionalTooltip>
  );
  const titleElement = (is(String, title) ? (
    <h1>
      {title}
    </h1>
    ) : title);

  return (
    <Title>
      {helpArticlePath ? <DashedTitleHelpLink
        articlePath={helpArticlePath}
        text={tooltipRenderer(helpText, title, 'right')}
        showIcon={false}
      /> : titleElement}
      {(info || infoHref) && infoElement}
    </Title>
  );
};

const BreadcrumbContainer = styled.div`
  margin: ${themeHelper('margins.small')};
`;

const RouteContent = styled.span`
  margin-left: 4px;
`;

export const BackLink: React.FC<RouteLinkProps & {showArrow?: boolean}> = ({ to, children, showArrow = true }) => (
  <BreadcrumbContainer className="backLink">
    <RouteLink to={to}>
      {showArrow && <EmptyArrowButton direction={Direction.Left} />}
      <RouteContent>{children}</RouteContent>
    </RouteLink>
  </BreadcrumbContainer>
);

export const Card = styled(FlexLayout)`
  background-color: ${white};
  padding: ${themeHelper('margins.medium')};
  margin: ${themeHelper('margins.small')} ${themeHelper('margins.small')} 0;
  border: 1px solid ${lightGreyCardBorderColor};
  border-radius: ${themeHelper('card.container.borderRadius')};
`;

export const AppContent = ({
  dataTest,
  routedBreadcrumbs,
  title,
  children,
  info,
  infoHref,
  helpText,
  helpArticlePath,
  pageActions,
  className,
}: AppContentProps) => {
  return (
    <MainContentLayout className={className} dataTest={dataTest}>
      <Layout.Content>
        {routedBreadcrumbs}
        {title &&
        <TitleContainer>
          <FlexLayout
            className="page-title"
            justifyContent="space-between"
            alignItems="baseline"
            itemSpacing={0}
          >
            <FlexLayout
              itemSpacing={0}
            >
              <TitleComponent
                title={title}
                info={info}
                infoHref={infoHref}
                helpText={helpText}
                helpArticlePath={helpArticlePath}
              />
            </FlexLayout>
            <div>
              {pageActions}
            </div>
          </FlexLayout>
        </TitleContainer>}
        <div>
          {children}
        </div>
      </Layout.Content>
    </MainContentLayout>
  );
};

export {
  TitleComponent as Title
};
