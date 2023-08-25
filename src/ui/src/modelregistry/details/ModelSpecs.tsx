import * as React from 'react';
import styled from 'styled-components';
import { themeHelper, colors } from '@domino/ui/dist/styled';
import { ModelSpecItems, ModelSpecSummary } from '../api';
import FlexLayout from '../../components/Layouts/FlexLayout';

const Layout = styled.div`
  padding-top: 10px;
  border-bottom: 1px solid ${colors.neutral300};
`
const ModelSpecsLayout = styled.div`
  position: relative;
  padding-top: 20px;  
  padding-bottom: 20px;
`;
const Header = styled.div`
  font-size: ${themeHelper('fontSizes.medium')};
  color: ${colors.mineShaftColor};
  line-height: 22px;
  padding-bottom: 20px;
  display: flex; 
  padding: 0 12px;
  flex-grow: 1;
`;
const EmptyState = styled(FlexLayout)`
  font-size: ${themeHelper('fontSizes.small')};
  color: ${colors.neutral500};
  margin-top: 36px;
  padding-bottom: 60px;
`;
const SpecsLayout = styled.div`
  font-size: ${themeHelper('fontSizes.medium')};
  color: ${colors.mineShaftColor};
  line-height: 22px;
  padding-bottom: 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
`;
const Spec = styled.div.attrs({className: 'Spec'})`
  padding: 3px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-width: 5em;
  dd {
    font-size: ${themeHelper('fontSizes.small')};
  }
`
type ModelSpecsInfoProps = {
  modelSpecSummary: ModelSpecSummary;
}

const ModelSpecsInfo = (props: ModelSpecsInfoProps) => {
  const { modelSpecSummary } = props;
  
  return (
    <Layout>
      <Header>Model Specs</Header>
      {modelSpecSummary.ModelSpecs && modelSpecSummary.ModelSpecs.length > 0 ? (
        <ModelSpecsLayout>
          <SpecsLayout style={{ display: 'flex', padding: '0 12px' }}>
            {modelSpecSummary.ModelSpecs.slice(0, 3).map(({ modelSpecName, modelSpecValue }: ModelSpecItems) => (
              <Spec key={modelSpecName}>
                <dt>{modelSpecValue}</dt>
                <dd>{modelSpecName}</dd>
              </Spec>
            ))}
          </SpecsLayout>
        </ModelSpecsLayout>
      ) : (
        <EmptyState>There are no model specs.</EmptyState>
      )}
    </Layout>
  )
}
export default ModelSpecsInfo;
