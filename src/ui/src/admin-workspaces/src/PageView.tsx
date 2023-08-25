import * as React from 'react';
import { withTheme } from 'styled-components';
import Card from '@domino/ui/dist/components/Card';
import { ErrorObject } from '@domino/api/dist/httpRequest';
import WaitSpinnerWithErrorHandling from '../../components/WaitSpinnerWithErrorHandling';
import { FlexLayout } from '../../components/Layouts/FlexLayout';
import { themeHelper } from '../../styled/themeUtils';
import { WorkspaceTable } from './WorkspaceTable';
import {
    WorkspaceCountQuota,
    WorkspaceDiscSpaceQuota,
    WorkspaceTableState,
    WorkspacePaginationTableRow,
} from './types';

const getCountQuotaMessage = (countQuota: WorkspaceCountQuota): string =>
    `${countQuota.runningCount}/${countQuota.usedCount}/${countQuota.maxCount}`;

const getAllocationSummaryMessage = (workspaceVolumeAllocationQuota: WorkspaceDiscSpaceQuota): string => {
    const numerator = `${workspaceVolumeAllocationQuota.usedGiB}`;
    if (workspaceVolumeAllocationQuota.maxGiB !== undefined) {
        return `${numerator}/${workspaceVolumeAllocationQuota.maxGiB}GiB`;
    }
    return numerator;
};

type UsageSummaryProps = {
    title: string;
    metadata: React.ReactNode;
    dataTest: string;
};

const UsageSummary: React.FC<UsageSummaryProps> = ({ title, metadata, dataTest }) => (
    <Card title={title} type="inner" data-test={dataTest} showTitleSeparator={true} width="auto">
        {metadata}
    </Card>
);

export type ViewProps = {
    theme?: any;
    pageNumber: number;
    pageSize: number;
    totalEntries: number;
    rows: WorkspacePaginationTableRow[];
    handleStateChange: (state: WorkspaceTableState) => void;
    workspaceCountQuota?: WorkspaceCountQuota;
    workspaceVolumeAllocationQuota?: WorkspaceDiscSpaceQuota;
    summaryLoading: boolean;
    workspacesLoading: boolean;
    workspacesFetchError?: ErrorObject;
    summaryFetchError?: ErrorObject;
};

const PageView: React.FC<ViewProps> = props => {
    const {
        workspaceVolumeAllocationQuota,
        workspaceCountQuota,
        handleStateChange,
        summaryLoading,
        workspacesLoading,
        workspacesFetchError,
        summaryFetchError,
        totalEntries,
        rows,
        pageNumber,
        pageSize,
    } = props;
    return (
        <div data-test="AdminWorkspacePage">
            <h1>Workspaces</h1>

            <FlexLayout
                justifyContent="flex-start"
                margin={`${themeHelper('margins.medium')(props)} 0px`}
                itemSpacing={20}
            >
                {summaryLoading || !!summaryFetchError ? (
                    <Card>
                        <WaitSpinnerWithErrorHandling
                            errored={!!summaryFetchError}
                            errorMessage="Failed to get summary information"
                        >
                            Loading summary information
                        </WaitSpinnerWithErrorHandling>
                    </Card>
                ) : (
                    <>
                        {workspaceCountQuota && (
                            <UsageSummary
                                title="Active/Provisioned/Max"
                                metadata={getCountQuotaMessage(workspaceCountQuota)}
                                dataTest="WorkspaceCountSummary"
                            />
                        )}
                        {workspaceVolumeAllocationQuota && (
                            <UsageSummary
                                title="Total Allocated Volume Size from Provisioned Workspaces"
                                metadata={getAllocationSummaryMessage(workspaceVolumeAllocationQuota)}
                                dataTest="WorkspaceSizeAllocationSummary"
                            />
                        )}
                    </>
                )}
            </FlexLayout>
            <div>
                <WorkspaceTable
                    onChange={handleStateChange}
                    error={!!workspacesFetchError}
                    loading={workspacesLoading}
                    totalEntries={totalEntries}
                    rows={rows}
                    pageNumber={pageNumber}
                    pageSize={pageSize}
                />
            </div>
        </div>
    );
};

export default withTheme(PageView);
