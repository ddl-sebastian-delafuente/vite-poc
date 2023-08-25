import { getPrincipal } from '@domino/api/dist/Auth';
import { DominoLayoutWebCompleteWorkflowResponse as CompleteWorkflowResponse } from '@domino/api/dist/types';
import * as R from 'ramda';
import { useHistory, useParams } from 'react-router-dom';
import * as React from 'react';

import { FieldStyle } from '../../components/DynamicField';
import { DynamicWizard, DynamicWizardProps, WORKFLOW } from '../../components/DynamicWizard';
import Modal, { DominoModalProps } from '../../components/Modal';
import { success } from '../../components/toastr';
import { getProjectDataSourceDetailsPage } from '../../core/routes';
import { initialPrincipal } from '../../proxied-api/initializers';
import { useRemoteData } from '../../utils/useRemoteData';

export interface NewDataSourceModalProps extends
  Pick<DominoModalProps, 'visible'>,
  Pick<DynamicWizardProps, 'isAdminPage'> {
  navigateToDetailPageOnDatasourceCreation?: boolean;
  onCancel: () => void;
  onCreate?: () => void;
  projectId?: string;
}

export const showDatasourceCreatedSuccessToast = 'show-data-source-created-toast';

const getDatasourceDetailsUri = ({
  datasourceId,
  ownerName,
  projectName,
  projectOwnerName,
}: {
  datasourceId: string,
  ownerName: string,
  projectName?: string,
  projectOwnerName?: string,
}) => {
  const dataSourcePath = `/data/dataSource/${ownerName}/${datasourceId}`;
    return R.isNil(projectName) ? dataSourcePath : getProjectDataSourceDetailsPage(projectOwnerName, projectName, datasourceId);
}

export const NewDataSourceModal = ({
  isAdminPage,
  navigateToDetailPageOnDatasourceCreation,
  onCancel,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onCreate = () => {},
  projectId,
  visible,
}: NewDataSourceModalProps) => {
  const history = useHistory();
  const routeParams = useParams();

  const { data: principal } = useRemoteData({
    canFetch: true,
    fetcher: () => getPrincipal({}),
    initialValue: initialPrincipal,
  });


  const hybridEnabled = React.useMemo(() => {
    return principal.featureFlags.indexOf('ShortLived.HybridEnabled') > -1;
  }, [principal])
  
  const handleComplete = React.useCallback((completePayload: CompleteWorkflowResponse) => {
    onCreate();

    if (navigateToDetailPageOnDatasourceCreation) {
      sessionStorage.setItem(showDatasourceCreatedSuccessToast, 'true');
      const detailPageUri = getDatasourceDetailsUri({
        datasourceId: completePayload?.id || '',
        ownerName: completePayload?.ownerInfo?.ownerName || '',
        // @ts-ignore
        projectName: routeParams.projectName,
        // @ts-ignore
        projectOwnerName: routeParams.ownerName,
      })
      // admin page does not have react router so have to update location directly
      if (isAdminPage) {
        window.location.href = detailPageUri;
        return;
      }

      history.push(detailPageUri);
      return;
    }

    success('Successfully created the data source.');
  }, [
    history,
    isAdminPage,
    navigateToDetailPageOnDatasourceCreation,
    onCreate,
    routeParams,
  ]);

  if (!visible) {
    return null;
  }

  return (
    <Modal
      bodyStyle={{padding: 0}}
      className="create-data-source-modal"
      closable
      noFooter
      onCancel={onCancel}
      titleIconName="DataIcon"
      titleText="New Data Source"
      visible={visible}
      width={820}
    >
      <DynamicWizard
        antFormProps={{ requiredMark: 'optional'}}
        fieldStyle={FieldStyle.FormItem}
        flags={{
          hybridEnabled
        }}
        initialData={{
          projectId,
          userIds: []
        }}
        isAdminPage={isAdminPage}
        isAdminUser={principal.isAdmin}
        onCancel={onCancel}
        onComplete={handleComplete}
        stepperProps={{
          allowForwardNavigationWithErrors: false,
          contentWidth: '610px',
          height: '630px'
        }}
        workflowId={WORKFLOW.createDataSource}
      />
    </Modal>
  )
};
