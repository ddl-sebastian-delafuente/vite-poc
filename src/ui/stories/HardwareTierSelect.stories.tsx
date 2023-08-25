import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import fetchMock from 'fetch-mock';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

import HardwareTierSelect, { ExecutionType, GenericHardwareTierSelect } from '../src/components/HardwareTierSelect';
import { hardwareTierData } from  '../src/utils/testUtil';
import { getDevStoryPath } from '../src/utils/storybookUtil';

const SelectWrapper = styled.div`
  padding: 50px;
`;
const changeHandler = (e: any) => action('Selected')(e);
const hardwareTierDataWithoutDefault = R.reject(
  (hwtAndCapacity) => hwtAndCapacity.hardwareTier.isDefault,
  hardwareTierData
);

storiesOf(getDevStoryPath('Develop/Workspaces/Hardware Tier Select'), module)
  .add('SFC component with default HWT', () => (
    <SelectWrapper>
      <GenericHardwareTierSelect
        data={hardwareTierData}
        loading={false}
        changeHandler={changeHandler}
      />
    </SelectWrapper>
  ))
  .add('SFC component without default HWT', () => (
    <SelectWrapper>
      <GenericHardwareTierSelect
        data={hardwareTierDataWithoutDefault}
        loading={false}
        changeHandler={changeHandler}
      />
    </SelectWrapper>
  ))
  .add('update project settings', () => (
    <SelectWrapper>
      <GenericHardwareTierSelect
        data={hardwareTierData}
        loading={false}
        changeHandler={changeHandler}
        updateProjectOnSelect={true}
      />
    </SelectWrapper>
  ))
  .add('disabled', () => (
    <SelectWrapper>
      <GenericHardwareTierSelect
        data={hardwareTierData}
        loading={false}
        disabled={true}
        changeHandler={changeHandler}
      />
    </SelectWrapper>
  ))
  .add('no change handler', () => (
    <SelectWrapper>
      <GenericHardwareTierSelect
        data={hardwareTierData}
        loading={false}
      />
    </SelectWrapper>
  ))
  .add('selected id', () => (
    <SelectWrapper>
      <GenericHardwareTierSelect
        data={hardwareTierData}
        loading={false}
        selectedId="p3-gpu"
        changeHandler={changeHandler}
      />
    </SelectWrapper>
  ))
  .add('loading', () => (
    <SelectWrapper>
      <GenericHardwareTierSelect
        data={[]}
        loading={true}
        changeHandler={changeHandler}
      />
    </SelectWrapper>
  )).add('error', () => (
    <SelectWrapper>
      <GenericHardwareTierSelect
        data={[]}
        loading={false}
        error={true}
        changeHandler={changeHandler}
      />
    </SelectWrapper>
  )).add('No data', () => (
    <SelectWrapper>
      <GenericHardwareTierSelect
        data={[]}
        loading={false}
        changeHandler={changeHandler}
      />
    </SelectWrapper>
  ))
  .add('default with update setting TRUE', () => {
    const projectId = 'projid';
    fetchMock
      .restore()
      .get(
        `/v4/projects/${projectId}/hardwareTiers`,
        hardwareTierData,
      ).put('*', {});
    return (
      <SelectWrapper>
        <HardwareTierSelect
          projectId={projectId}
          updateProjectOnSelect={true}
          changeHandler={changeHandler}
          executionType={ExecutionType.Workspace}
        />
      </SelectWrapper>
    );
  })
  .add('default with update setting FALSE', () => {
    const projectId = 'projid';
    fetchMock
      .restore()
      .get(
        `/v4/projects/${projectId}/hardwareTiers`,
        hardwareTierData,
      ).put('*', {});
    return (
      <SelectWrapper>
        <HardwareTierSelect
          projectId={projectId}
          updateProjectOnSelect={false}
          changeHandler={changeHandler}
          executionType={ExecutionType.Workspace}
        />
      </SelectWrapper>
    );
  });
