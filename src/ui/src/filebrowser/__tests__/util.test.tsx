import * as React from 'react';
import 'jest-styled-components';
import { mockUserAgent } from 'jest-useragent-mock';
import { render } from '@domino/test-utils/dist/testing-library';
import { withFileDisplayElement, getUploadEndpoint, getSuccessfulFilesRemovalEndpoint, getSuccessfulUploadUrl, getHeadRevisionDirectoryLink, getDownloadSelectedEntitiesEndpoint, getCreateFileEndpoint } from '../util';

const TestComponent = () => <div className="for-test" data-test="test-component"/>;
const FileDisplayElement = withFileDisplayElement(TestComponent);
const htmlStr = "<div>Test</div>";

describe('withFileDisplayElement behaviour for browser types', () => {
  window.URL.createObjectURL = jest.fn();

  it('should return an iframe, when a .ipynb file rendered from non-Edge browser', () => {
    mockUserAgent('Chrome');
    const view = render(
      <FileDisplayElement
        htmlStr={htmlStr}
        fileName="testFile.ipynb"
      />
    );
    expect(view.baseElement.querySelector('iframe')).toBeTruthy();
  });

  it('should return the input component, when a .ipynb file rendered from Edge browser', () => {
    mockUserAgent('Edge');
    const view = render(
      <FileDisplayElement
        htmlStr={htmlStr}
        fileName="testFile.ipynb"
      />
    );
    expect(view.baseElement.querySelector('iframe')).toBeFalsy();
    expect(view.getByDominoTestId('test-component')).toBeTruthy();
  });

  it('should return the input component, when a non-.ipynb file rendered from Edge browser', () => {
    mockUserAgent('Edge');
    const view = render(
      <FileDisplayElement
        htmlStr={htmlStr}
        fileName="testFile.txt"
      />
    );
    expect(view.baseElement.querySelector('iframe')).toBeFalsy();
    expect(view.getByDominoTestId('test-component')).toBeTruthy();
  });

  it('should return the input component, when a non-.ipynb file rendered from non-Edge browser', () => {
    mockUserAgent('Edge');
    const view = render(
      <FileDisplayElement
        htmlStr={htmlStr}
        fileName="testFile.txt"
      />
    );
    expect(view.baseElement.querySelector('iframe')).toBeFalsy();
    expect(view.getByDominoTestId('test-component')).toBeTruthy();
  });

  it('should return proper upload endpoint', () => {
    const result = getUploadEndpoint('test-user', 'muh-project', '/')
    expect(result).toEqual("/u/test-user/muh-project/files/upload/")
  });

  it('should return proper upload endpoint when not root', () => {
    const result = getUploadEndpoint('test-user', 'muh-project', '/complex/dir/structure')
    expect(result).toEqual("/u/test-user/muh-project/files/upload/complex/dir/structure")
  });

  it('should return successful upload endpoint', () => {
    const result = getSuccessfulUploadUrl('test-user', 'muh-project', '/')
    expect(result).toEqual("/u/test-user/muh-project/browse#successfulUpload")
  });

  it('should return successful removal endpoint', () => {
    const result = getSuccessfulFilesRemovalEndpoint('test-user', 'muh-project', '/')
    expect(result).toEqual("/u/test-user/muh-project/browse#successfulRemoval")
  });

  it('should return head revision directory', () => {
    const result = getHeadRevisionDirectoryLink('test-user', 'muh-project', '/')
    expect(result).toEqual("/u/test-user/muh-project/browse")
  });

  it('should return entities endpoint', () => {
    const result = getDownloadSelectedEntitiesEndpoint('test-user', 'muh-project', '/', 'commit-hash')
    expect(result).toEqual("/u/test-user/muh-project/downloadSelected/commit-hash")
  });

  it('should return entities endpoint with nested directory', () => {
    const result = getDownloadSelectedEntitiesEndpoint('test-user', 'muh-project', '/something/deeper', 'commit-hash')
    expect(result).toEqual("/u/test-user/muh-project/downloadSelected/commit-hash/something/deeper/")
  });

  it('should return create file endpoint with nested directory without trailing slash', () => {
    const result = getCreateFileEndpoint('test-user', 'muh-project', '/something/deeper')
    expect(result).toEqual("/u/test-user/muh-project/create/something/deeper")
  });
});
