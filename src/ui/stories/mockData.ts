import * as randomSeed from 'random-seed';
import loremIpsum from 'lorem-ipsum';

const defaultReferenceDate = new Date(2017, 3, 19, 6, 0, 0);

export const apiKeyChars =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function mockError({ long = false }: { long?: boolean } = {}) {
  if (long) {
    return new Error(
      'Something went really really really really really really really really really really really really wrong.',
    );
  }
  return new Error('Something went wrong.');
}

export function mockApiKey({ index = 0, length = 65 }: { index?: number, length?: number } = {}) {
  const random = randomSeed.create(`mockApiKey-${index}`);
  let apiKey = '';
  for (let characterIndex = 0; characterIndex < length; characterIndex++) {
    apiKey += apiKeyChars[random.range(apiKeyChars.length)];
  }
  return apiKey;
}

export function mockSha(shaIndex: number): string {
  const random = randomSeed.create(`mockSha-${shaIndex}`);
  let sha = '';
  for (let characterIndex = 0; characterIndex < 40; characterIndex++) {
    sha += random.range(16).toString(16);
  }
  return sha;
}

export function mockRevision(
  {
    index = 0,
    fromNow = false,
    referenceDate = fromNow ? Date.now() : defaultReferenceDate,
    dateInterval = 1000 * 60 * 60 * (3 + 20 / 60),
    random = randomSeed.create(`mockRevision-${index}`),
    messageWordCount = random.range(1, 20),
    withRunId = false,
  }: {
      random?: any;
      index?: number;
      fromNow?:  boolean;
      referenceDate?: number | Date;
      dateInterval?: number;
      withRunId?: boolean;
      messageWordCount?: number;
    }
) {
  const sha = mockSha(index);
  const timestamp = referenceDate.valueOf() - dateInterval * index;
  const url = `/u/username/project-name/browse?commitId=${sha}`;
  const message = loremIpsum({
    count: messageWordCount,
    random: () => random.random(),
  });
  const author = mockUser({ index: random.range(100) });
  const runId = withRunId ? random.range(100) : null;
  const runNumberStr = Math.random().toString(36).substring(7);
  const runLink = `/u/dave/quick-start/runs/${sha}`;
  return {
    sha,
    timestamp,
    url,
    message,
    author,
    runId,
    runNumberStr,
    runLink
  };
}

export function mockRevisions(
  {
    numRevisions = 5,
    fromNow,
    referenceDate,
    dateInterval,
    withRunIds = false,
    random = randomSeed.create('mockRevisions'),
  }: {
    numRevisions?: number;
    fromNow?:  boolean;
    referenceDate?: Date;
    dateInterval?: number;
    withRunIds?: boolean;
    random?: any;
  }
) {
  const revisions: any[] = [];
  for (let index = 0; index < numRevisions; index++) {
    const withRunId = withRunIds ? random.range(2) > 0 : undefined;
    revisions.push(
      mockRevision({
        index,
        fromNow,
        referenceDate,
        dateInterval,
        withRunId,
      }),
    );
  }
  return revisions;
}

export function mockUsername({ index = 0 }: { index?: number }) {
  const usernames = [
    'tstark',
    'jdoe',
    'chrismyang',
    'nelprin',
    'trob',
    'kshenk',
    'msteele',
    'earino',
  ];
  const username = usernames[index % usernames.length];
  return username;
}

export function mockUser(
  { index = 0, username = mockUsername({ index }) }: { index?: number; username?: string }
) {
  return {
    username,
  };
}
