import { promises as fs } from 'fs';
import * as path from 'path';
import * as React from 'react';

import * as Icons from '../../src/components/Icons';
import { IconProps } from '../../src/icons/Icon';
import { render } from '@domino/test-utils/dist/testing-library';

const typescriptExtRegex = new RegExp('.ts$', 'i');
const jsmapExtRegex = new RegExp('.js.map$', 'i');

// Files that shouldn't be tested as icons
const IGNORED_FILES = [
  '__stories__',
  'Icon', // Base Icon class file for class based icons
  'RefIcon', // Just a styled component
];

describe('Icons', () => {
  it('should have all icons exported', async () => {
    const files = await fs.readdir(path.resolve(__dirname, '../../src/icons'));

    // Filter to only JS files
    const filesFiltered = files.reduce((memo: string[], fileName) => {
      if (typescriptExtRegex.test(fileName) || jsmapExtRegex.test(fileName)) {
        return memo;
      }

      // cleanup file names
      const fileNameClean = fileName.replace('.js', '').replace('.tsx', '');

      // Skip Icon file
      if (IGNORED_FILES.indexOf(fileNameClean) > -1) {
        return memo;
      }

      memo.push(fileNameClean);
      return memo;
    }, []);
    
    expect(filesFiltered.sort())
      .toEqual(Object.keys(Icons).filter(name => IGNORED_FILES.indexOf(name) === -1).sort());
  });

  Object.entries(Icons)
    .filter(([iconName]) => IGNORED_FILES.indexOf(iconName) === -1)
    .forEach(([iconName, Component]) => {
    const IconComponent = Component as React.FC<IconProps>;
    describe(iconName, () => {
      it('should render with a test id', () => {
        const { queryByDominoTestId } = render(<IconComponent testId="test"/>);
        expect(queryByDominoTestId('test')).not.toBeNull();
      })
    });
  })
})
