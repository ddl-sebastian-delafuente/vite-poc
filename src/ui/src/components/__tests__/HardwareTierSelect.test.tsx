import * as React from 'react';
import { render, waitFor } from '@domino/test-utils/dist/testing-library';
import {
  DominoHardwaretierApiHardwareTierWithCapacityDto as HardwareTierWithCapacity
} from '@domino/api/dist/types';
import Select, {
  getHardwareTierPrice,
  HardwareTierWithDataFetchDataProps,
  ExecutionType,
} from '../HardwareTierSelect';
import * as Projects from '@domino/api/dist/Projects';
import { hardwareTierCapacity, hardwareTierDto, projectSettingsDto } from '@domino/test-utils/dist/mocks';

const defaultHardwareTierId = "small-k8s";
const hwts: HardwareTierWithCapacity[] = [
  {
    "hardwareTier":{
      ...hardwareTierDto,
      "id":defaultHardwareTierId,
      "name":"Small (Kubernetes)",
      "cores":1,
      "coresLimit":1,
      "memory":1,
      "clusterType":
      "Kubernetes",
      "gpuConfiguration":{"numberOfGpus":0, "gpuKey": "nvidia.com/gpu"},
      "runMemoryLimit":{"memoryLimitMegabytes":1024},
      "isDefault":true,
      "centsPerMinute":0,
      "isFree":false,
      "isAllowedDuringTrial":false,
      "isVisible":true,
      "isGlobal":true,
      "isArchived":false,
      "creationTime":"2019-11-07T08:22:28.300Z",
      "updateTime":"2019-11-07T08:22:28.319Z",
      "nodePool": "default",
      "computeClusterRestrictions": {"restrictToSpark": false, "restrictToRay": false, "restrictToDask": false, "restrictToMpi": false},
      "overprovisioning":{"instances":0,"schedulingEnabled":false,"daysOfWeek":["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY"],"timezone":"UTC","fromTime":"08:00:00","toTime":"19:00:00"},
      "metadata": {}
    },
    "capacity":{ ...hardwareTierCapacity, "currentNumberOfExecutors":0,"maximumNumberOfExecutors":0,"numberOfCurrentlyExecutingRuns":0,"numberOfQueuedRuns":0,"maximumConcurrentRuns":0,"availableCapacityWithoutLaunching":0,"maximumAvailableCapacity":0,"capacityLevel":"CAN_EXECUTE_WITH_CURRENT_INSTANCES"},
    "dataPlane": {
      "id": "000000000000000000000000",
      "name": "",
      "namespace": "domino-compute",
      "isLocal": true,
      'configuration': {
        'storageClass': 'gp2'
      },
      'status': {
        'state': 'Healthy',
        'version': '5.3.0',
        'message': '',
        'requiresUpgrade': false,
      },
      'isHealthy': true,
      'isArchived': false,
      'isFileSyncDisabled': false
    }
  }
];

type State = { hwt?: HardwareTierWithCapacity };
class InfiniteLoopRepro extends React.Component<HardwareTierWithDataFetchDataProps, State> {
 /**
  * Bug: when user doesn't supply a selectedId and the changeHandler exists and triggers
  * a state change in the component that wraps the HardwareTierSelect, componentDidUpdate will
  * infinite loop
  */
  state = {};

  updateState = (data: HardwareTierWithCapacity) => {
    this.setState({ hwt: data }, () => {
      if (this.props.changeHandler) {
        this.props.changeHandler(data);
      }
    });
  }

  render() {
    return (
      <Select
        {...this.props}
        selectedId={undefined}
        changeHandler={this.updateState}
      />
    );
  }
}

jest.mock('@domino/api/dist/Projects');
afterAll(() => {
  jest.unmock('@domino/api/dist/Projects');
});

describe('hardwaretier select test', () => {
  const listHardwareTiersForProject = jest.spyOn(Projects, 'listHardwareTiersForProject');
  const getProjectSettings = jest.spyOn(Projects, 'getProjectSettings');
  const defaultProps = {
    projectId: 'projectId',
    executionType: ExecutionType.Workspace
  };

  it('formats hardware tier price', () => {
    const price = 20;
    const priceString = ` \u00b7 $0.2/min`;
    expect(getHardwareTierPrice(price)).toEqual(priceString);
  });

  it('return empty string on no hardware tier price', () => {
    const price = 0;
    expect(getHardwareTierPrice(price)).toEqual('');
  });

  it('should trigger the change handler once if no selectedId provided', async () => {
    listHardwareTiersForProject.mockImplementation(async () => hwts);
    getProjectSettings.mockImplementation(async () => ({...projectSettingsDto, defaultHardwareTierId: defaultHardwareTierId}));
    const changeHandler = jest.fn();
    render(
      <InfiniteLoopRepro
        {...defaultProps}
        changeHandler={changeHandler}
      />
    );
    await waitFor(() => expect(changeHandler).toHaveBeenCalledTimes(1));
  });
});
