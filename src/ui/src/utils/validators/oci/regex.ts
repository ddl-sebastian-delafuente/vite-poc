// Source: https://github.com/distribution/distribution/blob/2461543d988979529609e8cb6fca9ca190dc48da/reference/reference.go
//
// Grammar
//
// 	reference                       := name [ ":" tag ] [ "@" digest ]
//	name                            := [domain '/'] path-component ['/' path-component]*
//	domain                          := domain-component ['.' domain-component]* [':' port-number]
//	domain-component                := /([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])/
//	port-number                     := /[0-9]+/
//	path-component                  := alpha-numeric [separator alpha-numeric]*
// 	alpha-numeric                   := /[a-z0-9]+/
//	separator                       := /[_.]|__|[-]*/
//
//	tag                             := /[\w][\w.-]{0,127}/
//
//	digest                          := digest-algorithm ":" digest-hex
//	digest-algorithm                := digest-algorithm-component [ digest-algorithm-separator digest-algorithm-component ]*
//	digest-algorithm-separator      := /[+.-_]/
//	digest-algorithm-component      := /[A-Za-z][A-Za-z0-9]*/
//	digest-hex                      := /[0-9a-fA-F]{32,}/ ; At least 128 bit digest value
//
//	identifier                      := /[a-f0-9]{64}/
//	short-identifier                := /[a-f0-9]{6,64}/

export const EMPTY_STRING = '' as const;

export type RegexParameterFn = <T extends string>(...str: Array<T>) => string;

export const getFullRegex: RegexParameterFn = (...res) =>
  res.reduce((fullRegex, currRegex) => fullRegex.concat(currRegex.toString()), EMPTY_STRING);

export const makeNonCaptureGroup: RegexParameterFn = (...str) => `(?:${getFullRegex(...str)})`;
export const makeCaptureGroup: RegexParameterFn = (...str) => `(${getFullRegex(...str)})`;
export const makeOptional: RegexParameterFn = (...str) => `${makeNonCaptureGroup(getFullRegex(...str))}?`;
export const makeRepeated: RegexParameterFn = (...str) => `${makeNonCaptureGroup(getFullRegex(...str))}+`;
export const makeAnchored: RegexParameterFn = (...str) => `^${getFullRegex(...str)}$`;
export const makeLiteral = (literal: string) => literal.length === 1 ? `\\${literal}` : literal;

export const numericRegexp = `[0-9]+`;
export const alphaNumericRegexp = `[a-z0-9]+`;
export const hexaDecimalRegexp = `[0-9a-fA-F]`;
export const separatorRegexp = `(?:[._]|__|[-]*)`;

export const nameComponentRegexp = getFullRegex(
  alphaNumericRegexp,
  makeOptional(makeRepeated(separatorRegexp, alphaNumericRegexp))
);

export const domainComponentRegexp = makeNonCaptureGroup(`[a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]`);
export const DomainRegexp = getFullRegex(
  domainComponentRegexp,
  makeOptional(makeRepeated(makeLiteral('.'), domainComponentRegexp)),
  makeOptional(':', numericRegexp)
);
export const anchoredDomainRegexp = makeAnchored(DomainRegexp);

export const TagRegexp = `[\\w][\\w.-]{0,127}`;
export const anchoredTagRegexp = makeAnchored(TagRegexp);

export const DigestRegexp = `[A-Za-z][A-Za-z0-9]*(?:[-_+.][A-Za-z][A-Za-z0-9]*)*[:]${hexaDecimalRegexp}{32,}`;
export const anchoredDigestRegexp = makeAnchored(DigestRegexp);

export const NameRegexp = getFullRegex(
  makeOptional(DomainRegexp, makeLiteral('/')),
  nameComponentRegexp,
  makeOptional(makeRepeated(makeLiteral('/'), nameComponentRegexp))
);
export const anchoredNameRegexp = makeAnchored(
  makeOptional(makeCaptureGroup(DomainRegexp), makeLiteral('/')),
  makeCaptureGroup(nameComponentRegexp, makeOptional(makeRepeated(makeLiteral('/'), nameComponentRegexp)))
);

export const ReferenceRegexp = makeAnchored(
  makeCaptureGroup(NameRegexp),
  makeOptional(':', makeCaptureGroup(TagRegexp)),
  makeOptional('@', makeCaptureGroup(DigestRegexp))
);

export default {
  ReferenceRegexp,
  NameRegexp,
  DomainRegexp,
  TagRegexp,
  Anchored: {
    NameRegexp: anchoredNameRegexp,
    DomainRegexp: anchoredDomainRegexp,
    TagRegexp: anchoredTagRegexp
  }
};
