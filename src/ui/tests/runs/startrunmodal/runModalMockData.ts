import {
  DominoServerProjectsApiProjectGatewayOverview as Project,
} from '@domino/api/dist/types';
export const hardwareTiers1 = [{"hardwareTier":{"_id":"5c0efbf39333f16ae6e596e8","id":"default","name":"default","cores":1,"memory":512,"isDefault":true,"centsPerMinute":0,"isFree":false,"isAllowedDuringTrial":false,"isVisible":true,"isGlobal":true,"isArchived":false},"capacity":{"currentNumberOfExecutors":1,"maximumNumberOfExecutors":1,"numberOfCurrentlyExecutingRuns":0,"numberOfQueuedRuns":0,"maximumConcurrentRuns":0,"availableCapacityWithoutLaunching":0,"maximumAvailableCapacity":0,"capacityLevel":{"name":"FULL"}}},{"hardwareTier":{"_id":"5c0efbf39a047a6213620573","id":"local","name":"local","cores":1,"memory":512,"isDefault":false,"centsPerMinute":0,"isFree":false,"isAllowedDuringTrial":false,"isVisible":true,"isGlobal":true,"isArchived":false},"capacity":{"currentNumberOfExecutors":1,"maximumNumberOfExecutors":1,"numberOfCurrentlyExecutingRuns":2,"numberOfQueuedRuns":3,"maximumConcurrentRuns":2,"availableCapacityWithoutLaunching":0,"maximumAvailableCapacity":0,"capacityLevel":{"name":"FULL"}}},{"hardwareTier":{"_id":"5c140a21f91dff3ef15be13b","id":"theid","name":"THe NAme is not the same as the id","cores":10,"memory":1,"isDefault":false,"centsPerMinute":0,"isFree":false,"isAllowedDuringTrial":false,"isVisible":true,"isGlobal":true,"isArchived":false},"capacity":{"currentNumberOfExecutors":0,"maximumNumberOfExecutors":0,"numberOfCurrentlyExecutingRuns":0,"numberOfQueuedRuns":0,"maximumConcurrentRuns":0,"availableCapacityWithoutLaunching":0,"maximumAvailableCapacity":0,"capacityLevel":{"name":"FULL"}}}]

export const fakeHWTId = 'default';

export const fakeEnvironmentId = '5c0f020df91dffcdc4b0ac16';

export const fakeProjectId = 'fakeProjectId';

export const mockEnabledDatasetsPrincipal = { featureFlags: { 'ShortLived.FastStartDataSets': true } };

export const projectSettings1 = {
  'defaultEnvironmentId': fakeEnvironmentId,
  'defaultHardwareTierId': fakeHWTId,
};

export const environment1Details = {"id":"5c0f020df91dffcdc4b0ac16","name":"Default","description":"Default Environment","visibility":"Global","projectIds":["5c0f021bf91dffcdc4b0ac26","5c11a107f91dff1ea113c53e","5c102df8f91dff6315b8a478","5c0f021bf91dffcdc4b0ac27"],"lastModified":1544487437596};

export const fakeProject = {"id": fakeProjectId,"name":"quick-start","owner":{"id":"5c0f021bf91dffcdc4b0ac24","userName":"integration-test"},"description":"","hardwareTierName":"local","hardwareTierId":"local","environmentName":"Default","forkInfo":{"relatedForks":[]},"dependentProjects":[],"allowedOperations":["EditTags","RunLauncher","ViewRuns","ProjectSearchPreview","ChangeProjectSettings","Run","BrowseReadFiles","Edit","UpdateProjectDescription"],"visibility":"Private","tags":[],"updatedAt": (new Date("2018-12-11T00:17:44.183Z")).toISOString(),"numComments":0,"runsCountByType":[{'runType': 'Batch', 'count': 74}],"totalRunTime":"PT24062.256S", 'stageId': '', 'status': { 'status': 'active', 'isBlocked': false }, requestingUserRole: 'Owner'} as Project;
