import { makeMocks, MakeMocksReturn } from '@domino/test-utils/dist/mock-manager';
import { waitFor, render } from '@domino/test-utils/dist/testing-library';
import * as React from 'react';
import LiteUserLimitedAccessBanner from '../../components/LiteUserLimitedAccessBanner';

let mocks: MakeMocksReturn;

beforeAll(() => {
    mocks = makeMocks();
});
afterAll(() => {
    mocks.unmock();
});

describe('LiteUserLimitedAccessBanner', () => {

    it('should display lite user banner when logged-in user is a lite user', async () => {
        const isLiteUserResp = {
            isLiteUser: true
        };
        const { users } = mocks.api;
        users.isLiteUser.mockResolvedValue(isLiteUserResp);

        const view = render(<LiteUserLimitedAccessBanner />);
        await waitFor(() => expect(view.queryByDominoTestId('lite-user-banner')).not.toBeNull());
    });

    it('should hide lite user banner when logged-in user is not a lite user', async () => {
        const isLiteUserResp = {
            isLiteUser: false
        };
        const { users } = mocks.api;
        users.isLiteUser.mockResolvedValue(isLiteUserResp);

        const view = render(<LiteUserLimitedAccessBanner />);
        await waitFor(() => expect(view.queryByDominoTestId('lite-user-banner')).toBeNull());
    });
});
