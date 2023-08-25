import { mixpanel, types as MixpanelTypes } from '../../mixpanel';
import { UnionToMap } from '../../utils/typescriptUtils';
import { CREATE_DATASOURCE_STEP } from './ProxiedRequestClientSideStaticData/createDatasource';
import { WORKFLOW } from './proxiedDynamicWizardApiCalls';

const { Locations } = MixpanelTypes;

const eventMapping = {
  [WORKFLOW.createDataSource]: {
    complete: {
      className: MixpanelTypes.FinishDataSourceSetup.prototype.constructor.name,
      location: 'FinishDataSourceSetup',
    },
    stepChange: {
      [CREATE_DATASOURCE_STEP.authentication]: {
        className: MixpanelTypes.DatasourceAuthenticateStep.prototype.constructor.name,
        location: 'DataSourceAuthenticateStep',
      },
      [CREATE_DATASOURCE_STEP.configure]: {
        className: MixpanelTypes.DatasourceConfigureStep.prototype.constructor.name,
        location: 'DataSourceConfigureStep'
      },
      // Nothing for credentials type step
      // [CREATE_DATASOURCE_STEP.credentials]: '',
      [CREATE_DATASOURCE_STEP.permissions]: {
        className: MixpanelTypes.DatasourcePermissionsStep.prototype.constructor.name,
        location: 'DataSourcePermissionsStep',
      },
    }
  }
}

type EventType = 'complete' | 'stepChange';
const EventType: UnionToMap<EventType> = {
  complete: 'complete',
  stepChange: 'stepChange',
}

export interface TrackWorkflowProps {
  eventType: EventType;
  workflowId: string;
  stepId?: string;
}

export const trackWorkflow = ({
  eventType,
  workflowId,
  stepId,
}: TrackWorkflowProps) => {
  const getMixpanelName = () => {
    const workflowMapping = eventMapping[workflowId];

    if (!workflowMapping) {
      console.warn(`[DynamicWizard] Missing mixpanel workflowMapping ${workflowId}`)
      return false;
    }

    const eventTypeMapping = workflowMapping[eventType];

    if (!eventTypeMapping) {
      console.warn(`[DynamicWizard] Missing mixpanel event type mapping ${workflowId} ${eventType}`)
      return false;
    }

    if (eventType === EventType.complete) {
      return eventTypeMapping;
    }

    if (!stepId) {
      console.warn(`[DynamicWizard] Missing mixpanel stepChange mapping ${workflowId} ${eventType}`)
      return false;
    }

    return eventTypeMapping[stepId];
  }
  const mixpanelName = getMixpanelName();

  if (!mixpanelName) {
    return;
  }

  const location = Locations[mixpanelName.location];
  const TrackingType = MixpanelTypes[mixpanelName.className];

  if (!location) {
    console.warn(`[DynamicWizard] Missing mixpanel location for ${mixpanelName.location}`);
    return;
  }

  if (!TrackingType) {
    console.warn(`[DynamicWizard] Missing mixpanel type for ${mixpanelName.className}`);
    return;
  }

  mixpanel.track(() => new TrackingType({ location }));
}
