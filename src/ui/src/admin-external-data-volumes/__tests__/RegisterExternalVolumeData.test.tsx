import * as React from 'react';
import { render, screen, waitFor } from '@domino/test-utils/dist/testing-library';
import userEvent from '@testing-library/user-event';
import RegisterExternalVolumeData from '../src/RegisterExternalVolumeData';

jest.mock('@domino/api/dist/Datamount');

beforeAll(() => {
  const datamountApi = () => jest.requireMock('@domino/api/dist/Datamount');
  datamountApi().getAvailablePvcsByType.mockImplementation(async () => [{"id":"dummy-volume-id","name":"alice-asthma-folder","description":"","volumeType":"Nfs","pvcName":"asthma-folder","pvId":"pv-asthma","mountPath":"asthma-folder","users":[],"projects":[],"readOnly":true,"isPublic":true,"isRegistered":true,"dataPlanes":[]}]);
});

afterAll(() => {
  jest.unmock('@domino/api/dist/Datamount');
});

describe('RegisterExternalVolumeData', () => {
  const datamountApi = () => jest.requireMock('@domino/api/dist/Datamount');
  it('should trim whitespace in mountpath on click next in configuration step', async () => {
    const mockIsMountPathValid = jest.fn();
    datamountApi().isMountPathValid.mockImplementation(mockIsMountPathValid);
    const view = render(
      <RegisterExternalVolumeData
        onRegister={() => null}
      />
    );
    await userEvent.click(screen.getByRole('button',{name:'plus Register External Volume'}));
    await waitFor(() => expect(screen.getByLabelText('alice-asthma-folder')));
    await userEvent.click(screen.getByLabelText('alice-asthma-folder'));
    await userEvent.click(view.getByDominoTestId('step-0-change'));
    await waitFor(() => expect(view.getByDominoTestId('step-1-change')));
    await userEvent.clear(view.getByDominoTestId('register-mountpath'));
    await userEvent.type(view.getByDominoTestId('register-mountpath'),'  Hello');
    await userEvent.click(view.getByDominoTestId('step-1-change'));
    expect(mockIsMountPathValid).toHaveBeenCalledWith({mountPath: "Hello"});
  });
});
