import { search } from '@domino/api/dist/Gateway';
import {
  DominoCommonGatewaySearchFeatureViewSearchResultDto as FeatureViewSearchResultDto,
  DominoFeaturestoreApiFeatureViewDto as FeatureView,
} from '@domino/api/dist/types';
import * as React from 'react';
import styled from 'styled-components';

import { usePagination } from '../../../components/pagination/usePagination';
import { featureViewDto2FeatureViewSearchResultDto } from '../../../proxied-api/transforms';
import { 
  SearchableListProps, 
  SearchableList 
} from '../../SearchableList';
import { FeatureList } from '../FeatureList';

type PickedSearchableListProps =
  'footerControlOrder' |
  'headerControlOrder' |
  'title';

export interface SearchableFeatureListProps extends
  Pick<SearchableListProps, PickedSearchableListProps> {
  /**
   * A List of feature views to render. When
   * defined this list is of features that will
   * be displayed when there no search term is set.
   * In addition if clientside search is defined 
   * this will be the list of features that search
   * is filtering against
   */
  featureViews: FeatureView[],

  projectId?: string;

  /**
   * If set to true this will force clientside search
   */
  shouldUseClientsideSearch?: boolean;
}

const ListContainer = styled.div`
  margin: 15px 0;
`;

export const SearchableFeatureList = ({
  featureViews,
  footerControlOrder,
  headerControlOrder,
  projectId,
  shouldUseClientsideSearch,
  title,
}: SearchableFeatureListProps) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchFallback, setSearchFallback] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState<FeatureViewSearchResultDto[]>([]);
  
  const handleSearch = React.useCallback(async (query: string) => {
    try {
      if (!shouldUseClientsideSearch || !query) {
        setSearchFallback(false);
        const results = await search({ query, area: 'feature_view' });
        setSearchResults(results.reduce((memo, result) => {
          if (!result.featureViewInfo) {
            return memo;
          }

          // Check if result returned has a projectId equal to the one passed
          if (projectId && result.featureViewInfo.projectIds.indexOf(projectId) > -1) {
            return memo;
          }
 
          memo.push(result.featureViewInfo);
          return memo;
        }, [] as FeatureViewSearchResultDto[]));
      }
    } catch (e) {
      console.warn('Failed to search using gateway, using client side fallback', e);
      setSearchFallback(true);
    }
    setSearchTerm(query);
  }, [
    projectId,
    setSearchFallback, 
    setSearchResults,
    setSearchTerm,
    shouldUseClientsideSearch,
  ]);

  const searchedFeatureViews = React.useMemo(() => {
    if (searchTerm === '') {
      return featureViews.map(featureViewDto2FeatureViewSearchResultDto);
    }

    if (shouldUseClientsideSearch || searchFallback) {
      const searchRegex = new RegExp(searchTerm, 'gi');
      return featureViews.filter((featureView) => {
        return searchRegex.test(featureView.name);
      }).map(featureViewDto2FeatureViewSearchResultDto);
    }

    return searchResults;
  }, [
    featureViews, 
    searchTerm,
    searchFallback,
    searchResults,
    shouldUseClientsideSearch,
  ]);
  
  const pager = usePagination({
    data: searchedFeatureViews,
  });
  
  const pagedFeatureViews = React.useMemo(() => {
    const [begin, end] = pager.range;
    return searchedFeatureViews.slice(begin - 1, end);
  }, [
    searchedFeatureViews,
    pager.range,
  ]);

  return (
    <SearchableList
      alwaysPaginate
      searchable
      simple
      current={pager.current}
      footerControlOrder={footerControlOrder}
      headerControlOrder={headerControlOrder}
      maxPage={pager.maxPage}
      pageSize={pager.pageSize}
      onPageChange={pager.goToPage}
      onPageSizeChange={pager.updatePageSize}
      onSearch={handleSearch}
      range={pager.range}
      searchTerm={searchTerm}
      total={pager.total}
      title={title}
    >
      <ListContainer>
        <FeatureList
          featureViews={pagedFeatureViews}
          projectId={projectId}
          searchTerm={searchTerm}
          shouldShowAddToProjectControl
        />
      </ListContainer>
    </SearchableList>
  )
}
