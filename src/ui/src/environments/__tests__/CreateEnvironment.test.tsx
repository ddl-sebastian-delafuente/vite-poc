import * as React from 'react';
import { clone } from 'ramda';
import { MemoryRouter as Router } from 'react-router';
// eslint-disable-next-line no-restricted-imports
import { fireEvent, render, screen, waitFor } from '@domino/test-utils/dist/testing-library';
import userEvent from '@testing-library/user-event';
import * as Environments from '@domino/api/dist/Environments';
import { DominoEnvironmentsApiEnvironmentDetails } from '@domino/api/dist/types';
import { ComputeClusterLabels } from '@domino/ui/dist/clusters/types';
import BaseImageSelector, { BaseSelectorProps, EnvironmentBaseType } from '../BaseImageSelector';
import EnvironmentSharingFields, {
  EnvironmentSharingFieldsProps as EnvironmentFieldsSharingProps
} from '../EnvironmentSharingFields';
import CreateEnvironment, { Props as CreateEnvironmentProps, ErrorMessage } from '../CreateEnvironment';

const defaultEnvironment: DominoEnvironmentsApiEnvironmentDetails = {
  id: 'DominoId-1',
  archived: false,
  name: 'Default',
  visibility: 'Private',
  supportedClusters: [],
  latestRevision: {
    id: 'DomilkjlkjnoId-latrev2',
    number: 2,
    status: 'Succeeded',
    url: 'supidurl',
    availableTools: [],
    isRestricted: false,
  },
  selectedRevision: {
    id: 'DominoIdjsdflskdfjsjjj-latrev2',
    number: 1,
    status: 'Succeeded',
    url: 'supidurl',
    availableTools: [],
    isRestricted: false,
  }
};

const otherEnvironment: DominoEnvironmentsApiEnvironmentDetails = {
  id: 'DominoId-2',
  archived: false,
  name: 'otherenvironment',
  visibility: 'Private',
  supportedClusters: [ComputeClusterLabels.Spark],
  latestRevision: {
    id: 'DominoId-latrev2',
    number: 2,
    status: 'Succeeded',
    url: 'supidurl',
    availableTools: [],
    isRestricted: false,
  },
  selectedRevision: {
    id: 'DominoIdjjjj-latrev2',
    number: 1,
    status: 'Succeeded',
    url: 'supidurl',
    availableTools: [],
    isRestricted: false,
  }
};

const BaseImageSelectorProps: BaseSelectorProps = {
  baseEnvironmentId: undefined,
  imageType: EnvironmentBaseType.BASEIMAGE,
  isDefaultEnvironment: false,
  missingValueErrorMessages: [],
  isEditMode: false,
  disabled: false,
  standalone: false,
  isClusterImage: false
};

const EnvironmentSharingFieldsProps: EnvironmentFieldsSharingProps = {
  canCreateGlobalEnvironment: true,
  canTransferOwnership: true,
  isUsersForEnvironmentEmpty: false,
  ownerOrViewerId: '5d382a03647d491ea90471fb',
  ownerOrViewerUserName: 'integration-test',
  selected: [false, false],
  usersForEnvironment: [
    { id: '5d39a7c2684293284b399b41', userName: 'abc' },
    { id: '5d39b4b3684293284b7a35df', userName: 'def' }
  ],
  visibility: 'Private'
};
const mockRevisionsInfo = {
  revisions: [],
  pageInfo: {
    totalPages: 0,
    currentPage: 0,
    pageSize: 20
  }
};

describe('Create Environment Form', () => {
  const getCurrentUserEnvironments = jest.spyOn(Environments, 'getCurrentUserEnvironments');
  const getDefaultEnvironment = jest.spyOn(Environments, 'getDefaultEnvironment');
  const getDefaultEnvironmentRevisions = jest.spyOn(Environments, 'getBuiltEnvironmentRevisions');
  getCurrentUserEnvironments.mockImplementation(async () => [
    defaultEnvironment,
    otherEnvironment
  ]);
  getDefaultEnvironmentRevisions.mockImplementation(async () => mockRevisionsInfo);

  beforeAll(() => {
    getCurrentUserEnvironments.mockImplementation(jest.fn(async () => Promise.resolve([clone(defaultEnvironment), clone(otherEnvironment)])));
    getDefaultEnvironment.mockImplementation(jest.fn(async () => Promise.resolve(defaultEnvironment)));
  });

  function getDefaultCreateEnvironmentProps(props?: Partial<CreateEnvironmentProps>) {
    return {
      cancelUrl: '/environments',
      csrfFormToken: '8f7bfe2a21e8b55168507b4dcf3c89ac3668583d-1565158709283-66f355adcb3ea4c1d1c99c44',
      createAction: 'string',
      ...BaseImageSelectorProps,
      canCreateGlobalEnvironment: true,
      canTransferOwnership: true,
      isUsersForEnvironmentEmpty: false,
      viewerId: '5d382a03647d491ea90471fb',
      viewerUserName: 'integration-test',
      usersForEnvironment: [
        { id: '5d39a7c2684293284b399b41', userName: 'abc' },
        { id: '5d39b4b3684293284b7a35df', userName: 'def' }
      ],
      visibility: 'Private',
      ...props
    } as CreateEnvironmentProps;
  }

  function getMountedCreateEnvironment(props: CreateEnvironmentProps) {
    return render(<Router><CreateEnvironment {...props} /></Router>);
  }

  it('BaseImageSelector should render successfully', async () => {
    const { baseElement } = render(
      <Router>
        <BaseImageSelector {...BaseImageSelectorProps} />
      </Router>
    );

    await waitFor(() => expect(baseElement.querySelectorAll('input').length).toEqual(6));
  });

  it('EnvironmentSharingField should render successfully', () => {
    const { baseElement } = render(<EnvironmentSharingFields {...EnvironmentSharingFieldsProps} />);
    expect(baseElement.querySelectorAll('input').length).toEqual(7);
  });

  it('Create Environment Form test', async () => {
    const view = getMountedCreateEnvironment(getDefaultCreateEnvironmentProps());
    await waitFor(() => expect(screen.getByRole('button')).toBeTruthy());
    await userEvent.click(screen.getByRole('button'));
    const createEnvironmentModal = view.getByDominoTestId('create-environment-modal-');
    await waitFor(() => expect(createEnvironmentModal.querySelectorAll('textarea').length).toEqual(1));
    await waitFor(() => expect(createEnvironmentModal.querySelectorAll('input#name').length).toEqual(1));
    await waitFor(() => expect(createEnvironmentModal.querySelectorAll('div.button').length).toEqual(3));
  });

  describe('Inline Error Tests', () => {
    it(`should render inline error for empty file name & empty custom image url
    \twhen clicked on 'Create Environment' button`, async () => {
      const view = getMountedCreateEnvironment(
        getDefaultCreateEnvironmentProps({ imageType: EnvironmentBaseType.CUSTOMIMAGE })
      );

      await waitFor(() => expect(screen.getByRole('button')).toBeTruthy());
      await userEvent.click(screen.getByRole('button'));
      const createEnvironmentModal = view.getByDominoTestId('create-environment-modal-');
      await waitFor(() => expect(createEnvironmentModal.querySelector('textarea')!.value).toEqual(''));
      await waitFor(() => expect((createEnvironmentModal.querySelector('input#dockerImageInput') as HTMLInputElement).value).toEqual(''));
      await waitFor(() => expect(createEnvironmentModal.querySelectorAll('div.button').length).toEqual(3));
      await waitFor(() => expect(view.getByDominoTestId('create_environment_btn')).toBeTruthy());
      expect(view.getByDominoTestId('create_environment_btn').hasAttribute('disabled')).toBeFalsy();
      await userEvent.click(view.getByDominoTestId('create_environment_btn'));
      await waitFor(() => expect(createEnvironmentModal.textContent).toContain(ErrorMessage.EnvironmentNameEmpty));
      await waitFor(() => expect(createEnvironmentModal.textContent).toContain(ErrorMessage.DockerImageEmpty));
    });

    it(`should render inline error for invalid custom image url
    \twhen the custom image url is changed via input`, async () => {
      const view = getMountedCreateEnvironment(
        getDefaultCreateEnvironmentProps({ imageType: EnvironmentBaseType.CUSTOMIMAGE })
      );

      await waitFor(() => expect(screen.getByRole('button')).toBeTruthy());
      await userEvent.click(screen.getByRole('button'));
      const createEnvironmentModal = view.getByDominoTestId('create-environment-modal-');
      await waitFor(() => expect((createEnvironmentModal.querySelector('input#dockerImageInput') as HTMLInputElement).value).toEqual(''));
      const customImageUrlInput = createEnvironmentModal.querySelector('input#dockerImageInput') as HTMLInputElement;
      fireEvent.change(customImageUrlInput, { target: { value: 'a.' } });
      fireEvent.blur(customImageUrlInput);
      await waitFor(() => expect(createEnvironmentModal.textContent).toContain(ErrorMessage.DockerImageInvalid));
    });
  });
});
