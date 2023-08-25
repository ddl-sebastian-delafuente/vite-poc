import RegexOCI from './regex';

export const regexValidator = (regex: string) => (testString: string) => (new RegExp(regex)).test(testString);

export const Validators = {
  isReference: regexValidator(RegexOCI.ReferenceRegexp),
  isName: regexValidator(RegexOCI.NameRegexp),
  isDomain: regexValidator(RegexOCI.DomainRegexp),
  isTag: regexValidator(RegexOCI.TagRegexp),
  Anchored: {
    isName: regexValidator(RegexOCI.Anchored.NameRegexp),
    isDomain: regexValidator(RegexOCI.Anchored.DomainRegexp),
    isTag: regexValidator(RegexOCI.Anchored.TagRegexp),
  }
};

export default Validators;
