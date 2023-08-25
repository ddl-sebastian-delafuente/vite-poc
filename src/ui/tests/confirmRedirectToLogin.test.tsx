import { render, screen } from '@domino/test-utils/dist/testing-library';
import {
  setPreviousDataStorage,
  checkPreviousDataStorageKeyExists,
  getPreviouslySelectedValue,
  clearPreviousDataStorage,
  showConfirmRedirectModalToLogin
} from '../src/confirmRedirect/confirmRedirectToLogin';

require('./util/browserMocks.js');

const defaultValue = 'defaultValue';
const testKey = 'TEST_KEY';
const testValue = {id: 'TEST_ID', value: 'TEST_VALUE'};

describe('Confirm modal for redirect to login', () => {
  setPreviousDataStorage(testKey, JSON.stringify(testValue));

  it('checkPreviousDataStorageKeyExists', () => {
    const isExists = checkPreviousDataStorageKeyExists(testKey);
    expect(isExists).toBe(true);
  });

  it('Fetch value of stored object', () => {
    const fetchedValue = getPreviouslySelectedValue(testKey);
    expect(fetchedValue).toEqual(JSON.stringify(testValue));
  });

  it('Fetch value of a particular key from stored object', () => {
    const fetchedValue = getPreviouslySelectedValue(testKey, 'id');
    expect(fetchedValue).toEqual('TEST_ID');
  });

  it('When fetch fails, return default value for a particular key from stored object', () => {
    const fetchedValue = getPreviouslySelectedValue(testKey, 'someId', defaultValue);
    expect(fetchedValue).toEqual(defaultValue);
  });

  it('Remove stored object', () => {
    clearPreviousDataStorage(testKey);
    const isExists = checkPreviousDataStorageKeyExists(testKey);
    expect(isExists).toBe(false);
  });

  it('Confirm redirect modal', () => {
    render(
      showConfirmRedirectModalToLogin(
        '/redirect-path',
        testKey,
        testValue
      ));
    expect(screen.getByRole('dialog')).toBeTruthy()
  });
});
