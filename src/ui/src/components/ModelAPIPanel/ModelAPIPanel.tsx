import * as React from 'react';
import { map } from 'ramda';
import styled from 'styled-components';
import { colors } from '../../styled';
import { themeHelper } from '../../styled/themeUtils';
import Accordion from '../Accordion/Accordion';

const Container = styled.div`
  padding: 0.6rem 1rem 0.8rem;
  border: 1px solid ${colors.silverGrayLighter};
  border-radius: ${themeHelper('borderRadius.standard')};

  p {
    margin-bottom: 0.2rem;
  }
`;

const Description = styled.div`
  padding: 0.2rem 0 0.8rem 0.4rem;
`;

const Title = styled.p`
  font-size: 1rem;
  color: ${colors.black};
`;

const Subtitle = styled.p`
  padding: 0.4rem 0 0.8rem 0;
`;

const TableContainer = styled.div`
  margin-bottom: 0.4rem;
`;

const TableCell = styled.td`
  vertical-align: top;
  width: 10rem;
`;

interface Link {
  name: string;
  url: string;
}

export interface ModelProps {
  description?: string;
  input?: string[];
  output?: string[];
  project: string;
  author: string;
  lastModified: string;
  currentVersion: Link;
  modelUrl: Link;
  artifacts: Link;
  modelData: Link;
  modelSchema: Link;
  createdAt: string;
  type: string;
  hardwareTier: string;
  packages: string;
  dependencies: string;
}

const ModelAPIPanel: React.FC<ModelProps> = ({
  description,
  input,
  output,
  project,
  author,
  lastModified,
  currentVersion,
  modelUrl,
  artifacts,
  modelData,
  modelSchema,
  createdAt,
  type,
  hardwareTier,
  packages,
  dependencies
}) => {
  return (
    <Container>
      <Description>
        <div>
          <Title>About the model</Title>
          <Subtitle>{description}</Subtitle>
        </div>
        <TableContainer data-id="ModelAPIPanel-TableContainer">
          <table>
            <thead>
              <tr>
                <TableCell>Inputs</TableCell>
                <TableCell>Outputs</TableCell>
              </tr>
            </thead>
            <tbody>
              <tr>
                <TableCell>
                  <ul>{input && map((data) => <li key={`id_${data}`}>{data}</li>, input)}</ul>
                </TableCell>
                <TableCell>
                  <ul>{output && map((data) => <li key={`id_${data}`}>{data}</li>, output)}</ul>
                </TableCell>
              </tr>
            </tbody>
          </table>
        </TableContainer>
        <div>
          <p>Project: {project}</p>
          <p>Author: {author}</p>
          <p>Updated: {lastModified}</p>
          <p>
            Current Version: <a href={currentVersion.url}>{currentVersion.name}</a>
          </p>
          <p>
            Model URL: <a href={modelUrl.url}>{modelUrl.name}</a>
          </p>
          <p>
            Artifacts: <a href={artifacts.url}>{artifacts.name}</a>
          </p>
          <p>
            Data: <a href={modelData.url}>{modelData.name}</a>
          </p>
          <a href={modelSchema.url}>{modelSchema.name}</a>
        </div>
      </Description>
      <Accordion title="Technical Details">
        <p>Created: {createdAt}</p>
        <p>Model Type: {type}</p>
        <p>Hardware Tier: {hardwareTier}</p>
        <p>Packages: {packages}</p>
        <p>Dependencies: {dependencies}</p>
      </Accordion>
    </Container>
  );
};

export default ModelAPIPanel;
