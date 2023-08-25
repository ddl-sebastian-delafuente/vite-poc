import { Information } from '@domino/api/dist/types';
import {
  convertToUnit,
  convertToUnitOrUndefined,
  getCommand,
  getCronNextSchedule
} from '../common';

describe('convertToUnit', () => {
  it('should convert Mib to Gib', () => {
    const mibs: Information = { value: 1024, unit: 'MiB' };
    expect(convertToUnit('GiB', mibs)).toEqual(1);
  });

  it('should convert Gib to Mib', () => {
    const gibs: Information = { value: 1, unit: 'GiB' };
    expect(convertToUnit('MiB', gibs)).toEqual(1024);
  });

  it('should convert Bytes to Gib', () => {
    const bytes: Information = { value: 5368709120, unit: 'B' };
    expect(convertToUnit('GiB', bytes)).toEqual(5);
  });
});

describe('convertToUnitOrUndefined', () => {
  it('should convert Mib to Gib', () => {
    const mibs: Information = { value: 1024, unit: 'MiB' };
    expect(convertToUnitOrUndefined('GiB', mibs)).toEqual(1);
  });

  it('should convert Gib to Mib', () => {
    const gibs: Information = { value: 1, unit: 'GiB' };
    expect(convertToUnitOrUndefined('MiB', gibs)).toEqual(1024);
  });

  it('should convert Bytes to Gib', () => {
    const bytes: Information = { value: 5368709120, unit: 'B' };
    expect(convertToUnitOrUndefined('GiB', bytes)).toEqual(5);
  });

  it('should return undefined', () => {
    expect(convertToUnitOrUndefined('GiB', undefined)).toEqual(undefined);
  });

});

describe('getCommand common util function', () => {
  const FILE_NAMES = {
    withSpaces: `my main.py`,
    withoutSpaces: `main.py`,
    withSingleQuotesAndParams: `'my main.py' 1 2 3`
  };
  test(`should preserve the command when there are no spaces in the command
      \tEx: getCommand(\`main.py\`, true) -- returns => \`main.py\``, () => {
    expect(getCommand(FILE_NAMES.withoutSpaces, true)).toEqual(FILE_NAMES.withoutSpaces);
  });
  test(`should preserve the command when there are no spaces in the command
      \tEx: getCommand(\`main.py\`, false) -- returns => \`main.py\``, () => {
    expect(getCommand(FILE_NAMES.withoutSpaces, false)).toEqual(FILE_NAMES.withoutSpaces);
  });
  test(`should preserve the command when there are spaces in the command
      \tEx: getCommand(\`my main.py\`, false) -- returns => \`my main.py\``, () => {
    expect(getCommand(FILE_NAMES.withSpaces, false)).toEqual(FILE_NAMES.withSpaces);
  });
  test(`should preserve the command when there are spaces and single quotes (') in the command
      \tEx: getCommand(\`'my main.py' 1 2 3\`, true) -- returns => \`'my main.py' 1 2 3\``, () => {
    expect(getCommand(FILE_NAMES.withSingleQuotesAndParams, true)).toEqual(FILE_NAMES.withSingleQuotesAndParams);
  });
  test(`should add single quotes (') around the command when there are spaces in the command
      \tEx: getCommand(\`my main.py\`, true) -- returns => \`'my main.py'\``, () => {
    expect(getCommand(FILE_NAMES.withSpaces, true)).toEqual(`'${FILE_NAMES.withSpaces}'`);
  });
});

describe('getCronNextSchedule', () => {
  it('should return the next schedule time in the given format', () => {
    const nextSchedule = getCronNextSchedule('0 0 16 * * ?', 'America/Aruba', 'h:mm:ss a');
    expect(nextSchedule).toEqual('4:00:00 pm');
  });

  it('should return the next schedule time in the given timezone and in the given format', () => {
    const nextSchedule = getCronNextSchedule('0 0 10 * * ?', 'America/Aruba', 'h:mm:ss a', 'Asia/Calcutta');
    expect(nextSchedule).toEqual('7:30:00 pm');
  });

  it(`should return the next schedule time as 'next day time' when source timezone to target timezone conversion
    appear on the next day`, () => {
    const nextSchedule = getCronNextSchedule('0 0 18 * * ?', 'America/Aruba', 'h:mm:ss a', 'Asia/Calcutta');
    expect(nextSchedule).toEqual('Next day 3:30:00 am');
  });

  it(`should return the next schedule time as 'previous day time' when source timezone to target timezone conversion
    appear on the previous day`, () => {
    const nextSchedule = getCronNextSchedule('0 0 6 * * ?', 'Asia/Calcutta', 'h:mm:ss a', 'America/Aruba');
    expect(nextSchedule).toEqual('Previous day 8:30:00 pm');
  });
});
