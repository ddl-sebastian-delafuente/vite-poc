import * as React from 'react';
import { render, waitFor } from '@domino/test-utils/dist/testing-library';
import userEvent from '@testing-library/user-event';
import WhatsNewCarousel, {
  hideAutoMLId,
  hideModelRegId,
} from '../WhatsNewCarousel';
import { makeMocks, MakeMocksReturn, MockProfile } from '@domino/test-utils/dist/mock-manager';
import * as users from '@domino/api/dist/Users';

let mocks: MakeMocksReturn;

const mockProfile: MockProfile = {
  users: {
    getCurrentUserUIUXState: {stateMap: {}}
  }
};

beforeAll(() => {
  mocks = makeMocks();
  mocks.loadProfile(mockProfile);
});
afterAll(() => {
  mocks.unmock();
});

describe('New Carousel 5.7', () => {
  it('should render two slides', async () => {
    const {baseElement} = render(<WhatsNewCarousel/>);
    await waitFor(() => expect(baseElement.querySelectorAll('ul.slick-dots').length).toEqual(1));
    expect(baseElement.querySelectorAll('ul li').length).toEqual(2);
  });

  it('should render four slides when already visited hideAutoMLId slides', async () => {
    const userState = {stateMap: {[hideAutoMLId]: 'true'}};
    jest.spyOn(users, 'getCurrentUserUIUXState').mockResolvedValue(userState);
    const {getByText, baseElement} = render(<WhatsNewCarousel/>);
    // no carousel selector
    await waitFor(() => expect(baseElement.querySelectorAll('ul.slick-dots').length).toEqual(0));
    // The done button
    await waitFor(() => expect(getByText('Done')).toBeTruthy());
  });

  it('should render four slides when already visited hideModelRegId slides', async () => {
    const userState = {stateMap: {[hideModelRegId]: 'true'}};
    jest.spyOn(users, 'getCurrentUserUIUXState').mockResolvedValue(userState);
    const {getByText, baseElement} = render(<WhatsNewCarousel/>);
    // no carousel selector
    await waitFor(() => expect(baseElement.querySelectorAll('ul.slick-dots').length).toEqual(0));
    // The done button
    await waitFor(() => expect(getByText('Done')).toBeTruthy());
  });

  it('should close the carousel, when clicked on cross mark', async () => {
    const userState = {stateMap: {}};
    jest.spyOn(users, 'getCurrentUserUIUXState').mockResolvedValue(userState);
    const {baseElement} = render(<WhatsNewCarousel/>);
    await waitFor(() => expect(baseElement.querySelectorAll('ul.slick-dots').length).toEqual(1));
    expect(baseElement.querySelectorAll('ul li').length).toEqual(2);
    await userEvent.click(baseElement.querySelector('.ant-modal-close') as HTMLSpanElement);
    await waitFor(() => expect(baseElement.querySelectorAll('ul.slick-dots').length).toEqual(0));
  });
});
