import {
  escapeRegExp
} from '../regex';

describe('Regex escape View', () => {
  it('Escapes *', () => {
    const esc = escapeRegExp('*');
    expect(esc).toEqual('\\*');
  });

  it('Doesnt change input', () => {
    const res = escapeRegExp('john');
    expect(res).toEqual('john');
  });

  it('Replaces malformed input', () => {
    const res = escapeRegExp('( ) [');
    expect(res).toEqual('\\( \\) \\[');
  });
});
