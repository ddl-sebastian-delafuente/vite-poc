import { render, waitFor, screen, fullClick } from '@domino/test-utils/dist/testing-library';
import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { makeMocks, MakeMocksReturn, MockProfile } from '@domino/test-utils/dist/mock-manager';
import * as Environments from '@domino/api/dist/Environments';
import GlobalStore from '@domino/ui/dist/globalStore/GlobalStore';
import storageKeys from '@domino/ui/dist/globalStore/storageKeys';
import RestrictEnvironmentCheckBox from '../RestrictEnvironmentCheckBox';

const mockToastSuccess = jest.fn();
const mockToastError = jest.fn();
jest.mock('@domino/ui/dist/components/toastr', () => ({
  success: (text: string) => mockToastSuccess(text),
  error: (text: string) => mockToastError(text)
}));

const defaultEnvironmentPermissions = {
  canClassifyEnvironments: true,
  canCreateEnvironments: true,
  canSetEnvironmentsAsDefault: true,
};

const mockProfile: MockProfile = {
  auth: {
    getPrincipal: {
      featureFlags: [],
      booleanSettings: ['enableRestrictedAssets']
    }
  },
};

let mocks: MakeMocksReturn;

beforeAll(() => {
  mocks = makeMocks();
  mocks.loadProfile(mockProfile);
});

afterAll(() => {
  mocks.unmock();
});

const defaultProps = {
  isEditMode: false,
  isRestricted: false,
  environmentId: "6483a8c070ad5d62d47fd3e6",
  environmentRevisionId: "6483a8c070ad5d62d47fd3e9",
  isRevisionBuilt: true,
  revisionNumber: "2"
};

const RESTICTED_REVISION_TOOLTIP_TEXT = 'Restricted environments are allowed to be used with restricted Projects.';
const DISABLED_RESTRICT_ENV_TOOLTIP_TEXT = 'This revision cannot be classified as restricted, because it is not ready for use. Please check the logs for the environment, or contact your administrator to fix the environment.';
const UNRESTRICTED_REVISION_TOOLTIP_TEXT = `Restricted environments are allowed to be used with restricted Projects.Please Note: Assigning 'Restricted' to this revision will remove the restricted designation for all other revisions of this environmentOn clicking the checkbox revision #${defaultProps.revisionNumber} will be classified as restricted`;

describe('RestrictEnvironmentCheckBox', () => {

  it('should show tooltip on hovering the info icon and should display confirmation modal onClick checkbox', async () => {
    jest.spyOn(Environments, 'getEnvironmentPermissions').mockResolvedValue(defaultEnvironmentPermissions);
    const view = render(
      <RestrictEnvironmentCheckBox {...defaultProps} />
    );
    await waitFor(() => expect(view.getByDominoTestId("restrict-env-checkbox")).toBeTruthy());
    expect(view.baseElement.querySelector('.anticon-info-circle')).toBeTruthy();
    await userEvent.hover(view.baseElement.querySelector('.anticon-info-circle')!);
    await waitFor(() => expect(view.baseElement.querySelector('.ant-tooltip-open')).toBeTruthy());
    expect(view.baseElement.querySelector('.ant-tooltip-content')?.textContent).toEqual(UNRESTRICTED_REVISION_TOOLTIP_TEXT);
    await waitFor(() => userEvent.click(view.getByDominoTestId("restrict-env-checkbox")));
    await waitFor(() => expect(screen.getByText('Secure environment ready?')).toBeTruthy());
  });

  it('should show success toast on submit confirm when API success', async () => {
    const spy = jest.fn(() => Promise.resolve());
    const mockUpdateEnvironmentRevision = jest.spyOn(Environments, 'updateEnvironmentRevisionIsRestricted').mockImplementationOnce(spy);
    jest.spyOn(Environments, 'getEnvironmentPermissions').mockResolvedValue(defaultEnvironmentPermissions);
    const view = render(
      <RestrictEnvironmentCheckBox {...defaultProps} />
    );
    await waitFor(() => expect(view.getByDominoTestId("restrict-env-checkbox")).toBeTruthy());
    await waitFor(() => userEvent.click(view.getByDominoTestId("restrict-env-checkbox")));
    await waitFor(() => expect(screen.getByText('Secure environment ready?')).toBeTruthy());
    fullClick(view.getByDominoTestId('submit-button'));
    await waitFor(() => expect(mockUpdateEnvironmentRevision).toHaveBeenCalledWith(
      expect.objectContaining({ body: { isRestricted: true } }))
    );
    await waitFor(() => expect(mockToastSuccess).toBeCalledWith(`Environment set to 'Restricted' successfully`));
  });

  it('should show error toast on submit confirm when API rejected', async () => {
    const spy = jest.fn(() => Promise.reject());
    const mockUpdateEnvironmentRevision = jest.spyOn(Environments, 'updateEnvironmentRevisionIsRestricted').mockImplementationOnce(spy);
    jest.spyOn(Environments, 'getEnvironmentPermissions').mockResolvedValue(defaultEnvironmentPermissions);
    const view = render(
      <RestrictEnvironmentCheckBox {...defaultProps} />
    );
    await waitFor(() => expect(view.getByDominoTestId("restrict-env-checkbox")).toBeTruthy());
    await waitFor(() => userEvent.click(view.getByDominoTestId("restrict-env-checkbox")));
    await waitFor(() => expect(screen.getByText('Secure environment ready?')).toBeTruthy());
    fullClick(view.getByDominoTestId('submit-button'));
    await waitFor(() => expect(mockUpdateEnvironmentRevision).toHaveBeenCalledWith(
      expect.objectContaining({ body: { isRestricted: true } }))
    );
    await waitFor(() => expect(mockToastError).toBeCalledWith(`Couldn't restrict environment ${defaultProps.environmentId} with revision ${defaultProps.environmentRevisionId}`));
  });

  it('should show error toast on submit confirm when environmentRevisionId is not defined', async () => {
    jest.spyOn(Environments, 'getEnvironmentPermissions').mockResolvedValue(defaultEnvironmentPermissions);
    const view = render(
      <RestrictEnvironmentCheckBox {...defaultProps} environmentRevisionId={undefined} />
    );
    await waitFor(() => expect(view.getByDominoTestId("restrict-env-checkbox")).toBeTruthy());
    await waitFor(() => userEvent.click(view.getByDominoTestId("restrict-env-checkbox")));
    await waitFor(() => expect(screen.getByText('Secure environment ready?')).toBeTruthy());
    fullClick(view.getByDominoTestId('submit-button'));
    await waitFor(() => expect(mockToastError).toBeCalledWith(`Environment revision is not defined. Can't set revision to restricted`));
  });

  it('should disable checkbox when user can not classifyEnvironments', async () => {
    jest.spyOn(Environments, 'getEnvironmentPermissions').mockResolvedValue({ ...defaultEnvironmentPermissions, canClassifyEnvironments: false });
    const view = render(
      <RestrictEnvironmentCheckBox {...defaultProps} />
    );
    await waitFor(() => expect(view.getByDominoTestId("restrict-env-checkbox")).toBeTruthy());
    await waitFor(() => expect(view.getByDominoTestId("restrict-env-checkbox").hasAttribute('disabled')).toBeTruthy());
  });

  it('should disable checkbox when the revision is already restricted', async () => {
    jest.spyOn(Environments, 'getEnvironmentPermissions').mockResolvedValue(defaultEnvironmentPermissions);
    const view = render(
      <RestrictEnvironmentCheckBox {...defaultProps} isRestricted={true} />
    );
    await waitFor(() => expect(view.getByDominoTestId("restrict-env-checkbox")).toBeTruthy());
    await waitFor(() => expect(view.getByDominoTestId("restrict-env-checkbox").hasAttribute('disabled')).toBeTruthy());
    expect(view.baseElement.querySelector('.anticon-info-circle')).toBeTruthy();
    await userEvent.hover(view.baseElement.querySelector('.anticon-info-circle')!);
    await waitFor(() => expect(view.baseElement.querySelector('.ant-tooltip-open')).toBeTruthy());
    expect(view.baseElement.querySelector('.ant-tooltip-content')?.textContent).toEqual(RESTICTED_REVISION_TOOLTIP_TEXT);
  });

  it('should disable checkbox when the revision build not succeeded', async () => {
    jest.spyOn(Environments, 'getEnvironmentPermissions').mockResolvedValue(defaultEnvironmentPermissions);
    const view = render(
      <RestrictEnvironmentCheckBox {...defaultProps} isRevisionBuilt={false} />
    );
    await waitFor(() => expect(view.getByDominoTestId("restrict-env-checkbox")).toBeTruthy());
    await waitFor(() => expect(view.getByDominoTestId("restrict-env-checkbox").hasAttribute('disabled')).toBeTruthy());
    await userEvent.click(view.getByDominoTestId('restrict-env-checkbox'));
    expect(view.baseElement.querySelector('.ant-checkbox-checked')).toBeFalsy();

    expect(view.baseElement.querySelector('.anticon-info-circle')).toBeTruthy();
    await userEvent.hover(view.baseElement.querySelector('.anticon-info-circle')!);
    await waitFor(() => expect(view.baseElement.querySelector('.ant-tooltip-open')).toBeTruthy());
    expect(view.baseElement.querySelector('.ant-tooltip-content')?.textContent).toEqual(DISABLED_RESTRICT_ENV_TOOLTIP_TEXT);
  });

  it(`should disable checkbox in edit environment page when it's revision is restricted`, async () => {
    jest.spyOn(Environments, 'getEnvironmentPermissions').mockResolvedValue(defaultEnvironmentPermissions);
    const view = render(
      <RestrictEnvironmentCheckBox {...defaultProps} isRestricted={true} isEditMode={true} />
    );
    await waitFor(() => expect(view.getByDominoTestId("restrict-env-checkbox")).toBeTruthy());
    await waitFor(() => expect(view.getByDominoTestId("restrict-env-checkbox").hasAttribute('disabled')).toBeTruthy());
  })

  it(`should not display checkbox in edit environment page when it's revision is not restricted`, async () => {
    jest.spyOn(Environments, 'getEnvironmentPermissions').mockResolvedValue(defaultEnvironmentPermissions);
    const view = render(
      <RestrictEnvironmentCheckBox {...defaultProps} isRestricted={false} isEditMode={true} />
    );
    expect(view.queryByDominoTestId("restrict-env-checkbox")).toBeFalsy();
  });

  it('should not render when CC config enableRestrictedAssets is false', async () => {
    GlobalStore.removeItem(storageKeys.principal);
    mocks.api.auth.getPrincipal.mockResolvedValue({
      featureFlags: ['ShortLived.SparkClustersEnabled'],
      booleanSettings: []
    });
    jest.spyOn(Environments, 'getEnvironmentPermissions').mockResolvedValue(defaultEnvironmentPermissions);
    const view = render(
      <RestrictEnvironmentCheckBox {...defaultProps} />
    );
    expect(view.queryByDominoTestId("restrict-env-checkbox")).toBeFalsy();
  })
});
