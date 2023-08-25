import * as React from 'react';
import { Input } from 'antd';
import Toggle from '../Toggle/Toggle';
import { colors } from '../../styled';
import Select from '../Select/Select';
import styled from 'styled-components';

const Maincontainer = styled.div`
  width: 26rem;
`;

const Legend = styled.div`
  margin: 1rem 0 0.4rem 0;
  font-size: 0.9rem;
  .ant-switch-checked {
    background-color: ${colors.mantis};
  }
`;

const DeliverableContent = styled.div`
  display: flex;
  align-content: center;
  div {
    margin-right: 1rem;
    font-weight: 500;
    font-size: 1.1rem;
  }
`;

const TwoColContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

interface OptionsProps {
  value: string;
  label: string;
}

export interface HostingProps {
  hostingOptions: OptionsProps[];
  sectionOptions: OptionsProps[];
  environmentOptions: OptionsProps[];
}

const Hosting: React.FC<HostingProps> = ({ hostingOptions, sectionOptions, environmentOptions }) => {
  return (
    <Maincontainer>
      <Legend>
        <DeliverableContent>
          <div>Deliverable Active</div>
          <div>
            <Toggle className="switch-color" size="small" defaultChecked onChange={() => true} />
          </div>
        </DeliverableContent>
      </Legend>
      <Legend>Hosting</Legend>
      <TwoColContainer>
        <Select disabled style={{ width: '49%' }} defaultValue="Domino" options={hostingOptions} />
        <Select disabled style={{ width: '49%' }} defaultValue="REST API" options={sectionOptions} />
      </TwoColContainer>
      <Legend>File Name (containing code to invoke)</Legend>
      <Input style={{ width: '100%' }} defaultValue="model.py" />
      <Legend>Function to invoke</Legend>
      <Input style={{ width: '100%' }} defaultValue="predict()" />
      <Legend>Environment</Legend>
      <Select style={{ width: '100%' }} defaultValue="Domino Py3.6,R3" options={environmentOptions} />
    </Maincontainer>
  );
};

export default Hosting;
