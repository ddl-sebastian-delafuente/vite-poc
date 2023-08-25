import * as React from 'react';
import { render } from '@domino/test-utils/dist/testing-library';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  commandRenderer,
  durationRenderer,
  nameRenderer,
  queuedReasonRenderer,
  stageTimeRenderer,
  statusRenderer,
  titleWithGoalsInfoRenderer
} from '../renderers/tableColumns';

const ownerName = 'test',
  projectName = 'quick-start';

describe('Table column renderers', () => {
  describe('Title with Goals Info Renderer', () => {
    it('When goals linked to the entity which has title', () => {
      const entityTitle = 'Entity Title';
      const goalIds = ['5d521759ac6c261ba839e427', '5d521759ac6c261ba839e428'];
      const { getByDominoTestId } = render(<Router>{titleWithGoalsInfoRenderer(ownerName, projectName, goalIds, entityTitle)}</Router>);
      expect(getByDominoTestId('goal-info')).toBeTruthy();
      expect(getByDominoTestId(`${entityTitle}-title`).textContent).toEqual(entityTitle);
    });

    it('When goals linked to the entity which has no title', () => {
      const goalIds = ['5d521759ac6c261ba839e427', '5d521759ac6c261ba839e428'];
      const { getByDominoTestId } = render(<Router>{titleWithGoalsInfoRenderer(ownerName, projectName, goalIds, undefined)}</Router>);
      expect(getByDominoTestId('goal-info')).toBeTruthy();
      expect(getByDominoTestId(`---title`).textContent).toEqual('--');
    });
  });

  describe('Duration renderer', () => {
    it('should show two dashes when submissionTime is not given to the renderer function', () => {
      expect(render(<div>{durationRenderer()}</div>).getByText('--')).toBeTruthy();
    });
  });

  describe('Memory renderer', () => {
    it('should render a status dot which show the status text in a tooltip when put mouse on it', () => {
      expect(render(statusRenderer('Running', 'running-tooltip')).getByDominoTestId('running-tooltip')).toBeTruthy();
    });
  });

  describe('Stage time renderer', () => {
    it('should show two dashes when submissionTime is not given to the renderer function', () => {
      expect(render(<div>{stageTimeRenderer()}</div>).getByText('--')).toBeTruthy();
    });
  });

  describe('Name renderer', () => {
    it('should render the content in a tooltip', () => {
      expect(render(nameRenderer('Running')).getByText('Running')).toBeTruthy();
    });
  });

  describe('Command renderer', () => {
    it('should render the content in a tooltip', () => {
      expect(render(commandRenderer('Running')).getByText('Running')).toBeTruthy();
    });
  });

  describe('Queued reason renderer', () => {
    it('should render the content in a tooltip', () => {
      expect(render(queuedReasonRenderer('reason')).getByText('reason')).toBeTruthy();
    });
  });
});
