import * as React from 'react';
import { Layout } from 'antd';
import { isNil } from 'ramda';
import styled, { withTheme } from 'styled-components';
import getNavIcon, { IconType } from './utils/getNavIcon';
import { themeHelper } from '../../styled/themeUtils';
import { debounceInput } from '../../utils/sharedComponentUtil';
import { groupBy, mapObjIndexed, trim, values } from 'ramda';
import { search } from '@domino/api/dist/Gateway';
import { DocumentType, DominoCommonGatewaySearchSearchResultGatewayDto } from '@domino/api/dist/types';
import DataIcon from '../../icons/DataIcon';
import EnvironmentsIcon from '../../icons/EnvironmentsIcon';
import File from '../../icons/File30';
import RunsIcon from '../../icons/RunsIcon';
import ModelsIcon from '../../icons/ModelsIcon';
import ProjectsIcon from '../../icons/ProjectsIcon';
import CommentText from '../../icons/CommentText';
import SpinningDominoLogo from '../../icons/SpinningDominoLogo';
import { ErrorObject } from '@domino/api/dist/httpRequest';
import { Key } from 'ts-key-enum';
import { searchUrlFor } from '../../utils/searchUtils';
import {
  COLLAPSED_SIDEBAR_WIDTH,
} from './utils/styled';
import withStore, { StoreProps } from '../../globalStore/withStore';
import { LoadingOutlined } from '@ant-design/icons';
import { fontSizes } from '../../styled';

type ContainerProps = { left: number };
const Container = styled.div<ContainerProps>`
  position: absolute;
  display: flex;
  flex-flow: row;
  left: ${props => props.left}px;
  width: calc(100% - ${props => props.left}px);
  height: 100vh;
  z-index: 2;
`;

const SearchContainer = styled(Layout.Sider)`
  height: 100vh;
  padding: ${themeHelper('margins.large')};
  max-width: ${themeHelper('nav.secondary.search.width')} !important;
  width: ${themeHelper('nav.secondary.search.width')} !important;
  flex: 0 1 auto !important;
  background-color: ${themeHelper('nav.secondary.search.backgroundColor')};
  overflow: auto;
  display: flex;
  flex-direction: column;
`;

const Overlay = styled.div`
  flex: 1 1 auto;
  background-color: ${themeHelper('nav.secondary.search.overlayColor')};
  opacity: 0.2;
  cursor: pointer;
`;

const InputContainer = styled.div`
  padding-bottom: ${themeHelper('margins.medium')};
  border-bottom: ${themeHelper('nav.secondary.search.input.border')};
  display: flex;
  align-items: center;

  form {
    margin-bottom: 0;
  }
`;

const StyledInput = styled.input`
  border: none;
  margin-left: ${themeHelper('margins.small')};
  outline: none;
  font-size: ${themeHelper('sizes.medium')};
  color: ${themeHelper('nav.secondary.search.input.fontColor')};
  flex-grow: 1;
`;

const LoadingContainer = styled.div`
  margin-top: ${themeHelper('margins.medium')};
  height: calc(100% - 75px);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ResultsContainer = styled.div`
  margin-top: ${themeHelper('margins.medium')};
  width: 100%;
`;

const AreaHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${themeHelper('margins.small')};
`;

const AreaHeader = styled.div`
  font-size: ${themeHelper('fontSizes.tiny')};
  color: ${themeHelper('nav.secondary.search.results.headerColor')};
  display: inline-block;
`;

const AreaIcon = styled.div`
  display: inline-flex;
  justify-content: center;
  margin-right: ${themeHelper('margins.tiny')};
`;

const ResultText = styled.a`
  display: block;
  font-size: ${themeHelper('fontSizes.small')};
  color: ${themeHelper('nav.secondary.search.results.headerColor')};
  margin-bottom: ${themeHelper('margins.tiny')};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  &:hover {
    background-color: ${themeHelper('nav.secondary.search.results.hoverColor')};
  }

  em {
    background-color: ${themeHelper('nav.secondary.search.results.emphasis')};
    font-style: normal;
  }
`;

const AreaContainer = styled.div`
  margin-bottom: ${themeHelper('margins.large')};
`;

export interface SearchProps {
  theme?: any;
  dismissSearch: () => void;
}

interface SearchState {
  query: string;
  searching: boolean;
  results: DominoCommonGatewaySearchSearchResultGatewayDto[];
  searchAttempted: boolean;
  error: ErrorObject | undefined;
}

class Search extends React.PureComponent<SearchProps & StoreProps, SearchState> {
  state = {
    searching: false,
    query: '',
    results: [],
    searchAttempted: false,
    error: undefined,
  };

  delayedSearch: () => void;
  areasToIcons: { [P in DocumentType]: JSX.Element };

  onSearchInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({ query: event.currentTarget.value });
    this.delayedSearch();
  }

  constructor(props: SearchProps) {
    super(props);

    const primaryColor = themeHelper('nav.secondary.search.results.icon.primaryColor')(props);
    const secondaryColor = themeHelper('nav.secondary.search.results.icon.secondaryColor')(props);

    const iconProps = {
      primaryColor: primaryColor,
      secondaryColor: secondaryColor,
      width: themeHelper('sizes.medium')(props),
      height: themeHelper('sizes.medium')(props),
    };

    this.areasToIcons = {
      'project': <ProjectsIcon {...iconProps} />,
      'file': <File {...iconProps} />,
      'run': <RunsIcon {...iconProps} />,
      'model': <ModelsIcon {...iconProps} />,
      'environment': <EnvironmentsIcon {...iconProps} />,
      'comment': <CommentText {...iconProps} />,
      'dataset': <DataIcon {...iconProps} />,
    };
  }

  UNSAFE_componentWillMount() {
    this.delayedSearch = debounceInput(
      () => {
        const query = trim(this.state.query);

        if (!query) {
          return;
        }

        this.setState({ searching: true, results: [], query });

        search({ query })
          .then((results: DominoCommonGatewaySearchSearchResultGatewayDto[]) => {
            this.setState({
              results,
              searching: false,
              searchAttempted: true,
              error: undefined,
            });
          })
          .catch((error: ErrorObject) => {
            this.setState({
              searching: false,
              searchAttempted: true,
              error,
            });
          });
      },
      1000
    );

    document.addEventListener('keydown', this.onEscape);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onEscape);
  }

  onEscape = (event: KeyboardEvent) => {
    if (event.key === Key.Escape) {
      this.props.dismissSearch();
    }
  }

  renderResults = () => {
    const {
      searching,
      results,
      searchAttempted,
      error,
    } = this.state;

    if (searching) {
      return (
        <LoadingContainer>
          { isNil(this.props.whiteLabelSettings) ? <div /> : isNil(this.props.whiteLabelSettings?.appLogo) ? <SpinningDominoLogo
            height={50}
            width={50}
            primaryColor={themeHelper('mainFontColor')(this.props)}
          /> :
            <LoadingOutlined style={{ fontSize: fontSizes.EXTRA_LARGE }} />
          }
        </LoadingContainer>
      );
    }

    if (results.length > 0) {
      const groupedByArea = groupBy(({ area }: DominoCommonGatewaySearchSearchResultGatewayDto) => area)(results);
      const ordered = {};
      const desiredOrder: DocumentType[] = ['project', 'file', 'run', 'model', 'environment', 'comment', "dataset"];

      desiredOrder.forEach((area: DocumentType) => {
        if (area in groupedByArea) {
          ordered[area] = groupedByArea[area];
        }
      });

      const NUM_RESULTS_TO_DISPLAY = 6;

      return (
        <ResultsContainer>
          {values(mapObjIndexed((resultsForArea: DominoCommonGatewaySearchSearchResultGatewayDto[],
            area: DocumentType) => (
              <AreaContainer key={area}>
                <AreaHeaderContainer>
                  <AreaIcon>{this.areasToIcons[area]}</AreaIcon>
                  <AreaHeader>{area.toUpperCase().replace('_', ' ')}S</AreaHeader>
                </AreaHeaderContainer>

                {resultsForArea.slice(0, NUM_RESULTS_TO_DISPLAY).map(
                  (result: DominoCommonGatewaySearchSearchResultGatewayDto, index: number) => (
                    <ResultText
                      key={index}
                      href={result.link}
                      title={result.displayText}
                      dangerouslySetInnerHTML={{ __html: result.displayText! }}
                    />
                  ))}
                <a href={this.searchPageUrlFor(area)}>{`View All`}</a>
              </AreaContainer>
            ), ordered))}
        </ResultsContainer>
      );
    }

    if (error) {
      return (
        <ResultsContainer>
          <span>An unknown error occurred. Please try again.</span>
        </ResultsContainer>
      );
    }

    if (searchAttempted) {
      return (
        <ResultsContainer>
          <span>No Results</span>
        </ResultsContainer>
      );
    }

    return;
  }

  onSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const area: DocumentType = 'project';

    window.location.href = this.searchPageUrlFor(area);
  }

  searchPageUrlFor = (area: DocumentType) => {
    const {
      query,
    } = this.state;

    return searchUrlFor(query, area);
  }

  render() {
    const {
      dismissSearch,
    } = this.props;

    return (
      <Container left={COLLAPSED_SIDEBAR_WIDTH}>
        <SearchContainer>
          <InputContainer>
            {getNavIcon(IconType.Search, {
              height: themeHelper('sizes.medium')(this.props),
              width: themeHelper('sizes.medium')(this.props),
              primaryColor: themeHelper('nav.secondary.search.icon.primaryColor')(this.props),
              secondaryColor: themeHelper('nav.secondary.search.icon.secondaryColor')(this.props),
            })}
            <form onSubmit={this.onSearchSubmit}>
              <StyledInput
                placeholder="Search..."
                onChange={this.onSearchInputChange}
                autoFocus={true}
              />
            </form>
          </InputContainer>
          {this.renderResults()}
        </SearchContainer>
        <Overlay onClick={dismissSearch} />
      </Container>
    );
  }
}
export default withStore<SearchProps & StoreProps>(withTheme(Search));
