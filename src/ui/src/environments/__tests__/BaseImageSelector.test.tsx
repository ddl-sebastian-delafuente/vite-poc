import * as React from 'react';
import { clone } from 'ramda';
import { makeMocks, MakeMocksReturn } from '@domino/test-utils/dist/mock-manager';
import { waitFor, render } from '@domino/test-utils/dist/testing-library';
import {
  getCurrentUserEnvironmentsResponse,
  getDefaultEnvironmentResponse,
  getEnvironmentByIdResponse,
} from '@domino/test-utils/dist/mockResponses';
import {
  archivedEnvironment, environmentIdWithOldActiveRevision,
  archivedEnvironmentId, archivedEnvironmenActiveRevisionId, environmentWithOldActiveRevision,
} from '@domino/test-utils/dist/mocks';
import BaseImageSelectorWithState, { BaseSelectorProps } from '../BaseImageSelector';

let mocks: MakeMocksReturn;

beforeAll(() => {
  mocks = makeMocks();
});
beforeEach(() => {
    const { environments } = mocks.api;
    environments.getDefaultEnvironment.mockResolvedValue(getDefaultEnvironmentResponse);
    environments.getCurrentUserEnvironments.mockResolvedValue(clone(getCurrentUserEnvironmentsResponse));
});
afterAll(() => {
  mocks.unmock();
});

const BaseImageSelectorWithStateProps: BaseSelectorProps = {
  isDefaultEnvironment: false,
  baseEnvironmentId: 'baseEnvironmentId',
  baseEnvironmentRevisionId: 'baseEnvironmentRevisionId',
  missingValueErrorMessages: [],
  imageType: "Environment",
  isEditMode: true,
  isClusterImage: false,
  disabled: false,
  defaultEnvironmentImage: 'defaultImage',
  environmentId: 'environment-id',
  latestDefaultEnvironmentImage: 'latestDefaultEnvironmentImage',
  standalone: true
}

describe('BaseImageSelector', () => {

  it(`should display environment name when the base environment's revision is not the active revision`, async () => {
    const view = render(<BaseImageSelectorWithState
      {...BaseImageSelectorWithStateProps}
      baseEnvironmentRevisionId='non-active-rev-id'
      baseEnvironmentId={environmentIdWithOldActiveRevision}
    />);
    await waitFor(() => expect(view.getByText(environmentWithOldActiveRevision)).toBeTruthy());
  });

  it('should display environment name when the base environment is archived', async () => {
    const { environments } = mocks.api;
    environments.getEnvironmentById.mockResolvedValue(getEnvironmentByIdResponse);
    const view = render(<BaseImageSelectorWithState
      {...BaseImageSelectorWithStateProps}
      baseEnvironmentRevisionId={archivedEnvironmenActiveRevisionId}
      baseEnvironmentId={archivedEnvironmentId}
    />);
    await waitFor(() => expect(view.getByText(`${archivedEnvironment} (archived)`)).toBeTruthy());
  });
});
