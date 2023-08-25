import * as React from 'react';
import { render, waitFor } from '@domino/test-utils/dist/testing-library';
import useStore from '../useStore';
import withStore, { StoreProps } from '../withStore';
import {
  principal as mockPrincipal
} from '../../utils/testUtil';

jest.mock('@domino/api/dist/Auth');

const TestComponent: React.FC<StoreProps> = ({ principal }) => {
  return (
    <React.Fragment>
      {
        principal &&
        <input type="text" data-test="principalId" value={principal.canonicalId} />
      }
    </React.Fragment>
  );
};

const TestComponentWithStoreHook: React.FC<{}> = () => {
  const { principal, formattedPrincipal } = useStore();

  return (
    <React.Fragment>
      <TestComponent
        principal={principal}
        formattedPrincipal={formattedPrincipal}
      />
    </React.Fragment>
  );
};

describe('Global store', () => {
  const mockPrincipalApi = require('@domino/api/dist/Auth')
    .getPrincipal.mockImplementation(jest.fn(() => mockPrincipal));

  it('should call the principal API when useStore is called for the first time', async () => {
    const { container } = render(<TestComponentWithStoreHook />);
    expect(mockPrincipalApi).toBeCalled();
    await waitFor(() => expect(container.querySelector('[data-test="principalId"]')).toHaveProperty('value', mockPrincipal.canonicalId));
  });

  it('should not call the principal API when useStore is called from the second time', async () => {
    const { container } = render(<TestComponentWithStoreHook />);
    await waitFor(() => expect(mockPrincipalApi).not.toHaveBeenCalled());
    await waitFor(() => expect(container.querySelector('[data-test="principalId"]')).toHaveProperty('value', mockPrincipal.canonicalId));
  });

  it('should not call the principal API when withStore HOC is used ater useStore is called', async () => {
    const TestComponentWithStore = withStore(TestComponent);
    const { container } = render(<TestComponentWithStore />);
    await waitFor(() => expect(mockPrincipalApi).not.toHaveBeenCalled());
    await waitFor(() => expect(container.querySelector('[data-test="principalId"]')).toHaveProperty('value', mockPrincipal.canonicalId));
  });
});
