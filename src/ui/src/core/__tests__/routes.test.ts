import { getResultURI } from '../routes';

test('getResultURI', () => {
  const owner = 'dummy-owner';
  const project = 'dummy-project';
  const fileName = 'results/output (#).png';
  const uri = getResultURI(owner, project, fileName);

  expect(uri).toBe('/u/dummy-owner/dummy-project/render/results%2Foutput%20(%23).png');
});
