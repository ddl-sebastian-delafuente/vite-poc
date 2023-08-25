import { RouteComponentProps } from 'react-router';
import {
  appendToQuery,
  getField,
  removeFromQuery,
  searchUrlFor,
  searchUrlForTag,
  updateQuery
} from '../searchUtils';

describe('searchUrlFor', () => {
  it('returns a search url', () => {
    expect(
      searchUrlFor('someQuery')
    ).toEqual('/search?query=someQuery')
  });

  it('encodes the query', () => {
    expect(
      searchUrlFor('project.tag=SomeTag')
    ).toEqual('/search?query=project.tag%3DSomeTag')
  });

  it('defaults to no area', () => {
    expect(
      searchUrlFor('someQuery')
    ).not.toContain('area=')
  });

  describe('with an area', () => {
    it('adds the area to the search url', () => {
      expect(
        searchUrlFor('someQuery', 'project')
      ).toContain('area=project')
    });
  })
});

describe('searchUrlForTag', () => {
  it('uses the project area', () => {
    expect(
      searchUrlForTag('tag')
    ).toContain('area=project')
  });

  it('searches for the specified tag', () => {
    expect(
      searchUrlForTag('tag')
    ).toEqual('/search?area=project&query=project.tag%3Dtag')
  });
});

describe('getField', () => {
  it('returns the correct query field', () => {
    expect(
      getField('?foo=yay', 'foo')
    ).toEqual('yay');
  });

  it('returns undefined for not found field', () => {
    expect(
      getField('?foo=1', 'bar')
    ).toEqual(undefined);
  });

  it('doesn\'t blow up for empty query', () => {
    expect(
      getField('', 'foo')
    ).toEqual(undefined);
  });
});

describe('appendToQuery', () => {
  it('handles empty search string and empty query object', () => {
    expect(
      appendToQuery('', {})
    ).toEqual('');
  });

  it('handles empty query object', () => {
    expect(
      appendToQuery('?foo=yay', {})
    ).toEqual('?foo=yay');
  });

  it('appends to query correctly', () => {
    expect(
      appendToQuery('?foo=yay', {bar: 'hello'})
    ).toEqual('?bar=hello&foo=yay');
    expect(
      appendToQuery('', {foo: 'yay'})
    ).toEqual('?foo=yay');
  });

  it('replaces existing field', () => {
    expect(
      appendToQuery('?foo=yay', {foo: 'bar'})
    ).toEqual('?foo=bar');
  });
});

describe('removeFromQuery', () => {

  it('handles search string', () => {
    expect(
      removeFromQuery('', ['a'])
    ).toEqual('');
  });

  it('removes fields correctly', () => {
    expect(
      removeFromQuery('?foo=yay', ['foo'])
    ).toEqual('');
    expect(
      removeFromQuery('?foo=yay&bar=hello', ['foo'])
    ).toEqual('?bar=hello');
    expect(
      removeFromQuery('?foo=yay&bar=hello&hey=yo', ['foo'])
    ).toEqual('?bar=hello&hey=yo');
  });

  it('ignores random fields', () => {
    expect(
      removeFromQuery('?bar=hello', ['foo'])
    ).toEqual('?bar=hello');
  });
});

describe('updateQuery', () => {
  it('reconstruct the route using pathname and hash', () => {
    expect(
      updateQuery({
        location: { pathname: 'path', search: '?foo=bar', hash: '#anchor'},
      } as RouteComponentProps<{}>, '?foo=yay')
    ).toEqual('path?foo=yay#anchor');
  });
});
