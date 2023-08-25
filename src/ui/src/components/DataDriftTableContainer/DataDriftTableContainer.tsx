import * as React from 'react';
import { Input } from 'antd';
import styled from 'styled-components';
import Popover from '../Popover/Popover';
import { colors } from '../../styled';
import DataDriftTable from '../DataDriftTable/DataDriftTable';

const { Search } = Input;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.div`
  font-size: 1.4rem;
  font-weight: 500;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  .ant-input-search-button {
    background: ${colors.basicLink};
    border: ${colors.basicLink};
  }
`;

const TooltipText = styled.div`
  display: flex;
  align-items: center;
  min-width: 12rem;
  color: ${colors.basicLink};
`;

const Content = styled.div`
  p {
    margin-bottom: 0;
  }
`;

const ContentSubtitle = styled.p`
  color: ${colors.black};
  font-weight: 500;
`;

const Icon = styled.div`
  color: ${colors.black};
  border: 1px solid ${colors.black};
  border-radius: 50%;
  padding: 0 0.6rem;
  margin-right: 0.5rem;
`;

interface FeatureType {
  name: string;
  category?: string;
  range: number;
  type?: string;
}

interface TrendTypeProp {
  threshold: {
    lessThan?: number;
    greaterThan?: number;
  };
  trendsData: number[];
}

interface DriftType {
  withinRange: boolean;
  value: number;
}

interface TrainingDataType {
  type: string;
  value: number[];
}

interface ParametersTableData {
  isFail?: boolean;
  feature: FeatureType;
  drift: DriftType;
  range: string;
  training: TrainingDataType;
  prediction: TrainingDataType;
  trend: TrendTypeProp;
}

export interface DataDriftTableContainerProps {
  onSearch: (value: string) => void;
  data: ParametersTableData[];
}

const DataDriftTableContainer: React.FC<DataDriftTableContainerProps> = ({ data, onSearch }) => {
  const content = (
    <Content>
      <ContentSubtitle>Training Data</ContentSubtitle>
      <p>3k records</p>
      <br />
      <ContentSubtitle>Prediction Data </ContentSubtitle>
      <p>250 records from May 13th</p>
    </Content>
  );

  return (
    <div data-id="Data-Drift-Table-Container">
      <TitleContainer>
        <Title>Data Drift</Title>
        <SearchContainer>
          <Popover placement="topLeft" content={content} title="Data Used">
            <TooltipText>
              <Icon>i</Icon> <span>Data used for Check</span>
            </TooltipText>
          </Popover>
          <Search placeholder="search" onSearch={onSearch} enterButton />
        </SearchContainer>
      </TitleContainer>
      <DataDriftTable data={data} />
    </div>
  );
};

export default DataDriftTableContainer;
