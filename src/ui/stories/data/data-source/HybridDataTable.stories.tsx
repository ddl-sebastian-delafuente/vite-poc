import * as React from 'react';
import { getDevStoryPath } from '@domino/ui/dist/utils/storybookUtil';
import HybridDataTable, { HybridDataTableProps } from '../../../src/datasets/datasetconfigtabs/HybridDataTable'
import { getHybridCalls } from './CommonMocks';

const defaultProps: HybridDataTableProps = {
	projectId: '627d3f4194b2f162cb14d9f5',
	currentUser: 'Anonymous',
	enableDatasets: true,
	enableEdvs: true,
	selectedDataPlaneId: "000000000000000000000000",
}

export default {
	title: getDevStoryPath('Develop/Data/HybridDataTable'),
	component: HybridDataTable,
};

const Template = (defaultProps: HybridDataTableProps) => {
  getHybridCalls();
  return <HybridDataTable {...defaultProps}/>;
}

export const HybridData = Template.bind({});
HybridData.args = defaultProps;
