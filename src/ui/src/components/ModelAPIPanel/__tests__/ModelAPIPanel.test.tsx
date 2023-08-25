import * as React from 'react';
import { render } from '@testing-library/react';
import ModelAPIPanel, { ModelProps } from '../ModelAPIPanel';

describe('ModelAPIPanel', () => {
  let props: ModelProps;
  beforeEach(() => {
    props = {
      description: 'This model is about the prediction of xyz things',
      input: ['cost', 'age', 'volume'],
      output: ['prediction'],
      project: 'Project Asxa',
      author: 'Domino',
      lastModified: 'yesterday',
      currentVersion: { name: 'Version 4', url: '/' },
      modelUrl: { name: '//w.wefa.wefawe/aefas/ae', url: '/' },
      artifacts: { name: '//wefasdf/sfwaesd', url: '/' },
      modelData: { name: '//wefasdf/sfwaesd', url: '/' },
      modelSchema: { name: '//wefasdf/sfwaesd', url: '/' },
      createdAt: '17-01-2021',
      type: 'Classification',
      hardwareTier: '1 Core',
      packages: 'PySy',
      dependencies: '.....'
    };
  });

  describe('render()', () => {
    it('should render', () => {
      const { container } = render(<ModelAPIPanel {...props} />);
      expect(!!container).toBe(true);
    });
    it('should render Table', () => {
      const { container } = render(<ModelAPIPanel {...props} />);
      expect(container.querySelectorAll('[data-id="ModelAPIPanel-TableContainer"]').length).toEqual(1);
    });
    it('should render Accordion', () => {
      const { container } = render(<ModelAPIPanel {...props} />);
      expect(container.querySelectorAll('.ant-collapse-item').length).toEqual(1);
    });
  });
});
