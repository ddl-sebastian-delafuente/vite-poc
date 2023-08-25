import * as React from 'react';
import { render, screen } from '@domino/test-utils/dist/testing-library';
import { ComputeClusterLabels } from '@domino/ui/dist/clusters/types';
import SupportedClusterTypesInput, { allClusterTypes } from '../SupportedClusterTypesInput';

describe('SupportedClusterTypesInput', () => {
  it('should show five radio buttons all the time', () => {
    render(<SupportedClusterTypesInput disabled={false} />);
    expect(screen.getByLabelText('none')).toBeTruthy();
    allClusterTypes.map(cluster => {
      expect(screen.getByLabelText(cluster.clusterType!)).toBeTruthy();
    });
  });

  it('selects `None` if no cluster types provided', () => {
    const view = render(<SupportedClusterTypesInput disabled={false} />);
    expect(view.queryByDominoTestId('selected-cluster')).toBeNull();
    expect((screen.getByLabelText('none') as HTMLInputElement).checked).toBe(true);
  });

  it('selects the spark radio button if provided', () => {
    const view = render(
      <SupportedClusterTypesInput disabled={false} selectedClusterTypes={[ComputeClusterLabels.Spark]} />
    );
    expect(view.queryByDominoTestId('selected-cluster')).not.toBeNull();
    expect((screen.getByLabelText(ComputeClusterLabels.Spark) as HTMLInputElement).checked).toBe(true);
  });

  it('should disable all non selected radio buttons if disabled is true', () => {
    render(
      <SupportedClusterTypesInput disabled={true} selectedClusterTypes={[ComputeClusterLabels.Spark]} />
    );

    expect((screen.getByLabelText('none') as HTMLInputElement).disabled).toBe(true);
    expect((screen.getByLabelText(ComputeClusterLabels.Spark) as HTMLInputElement).disabled).toBe(false);
    allClusterTypes.map(cluster => {
      if (cluster.clusterType != ComputeClusterLabels.Spark) {
        expect((screen.getByLabelText(cluster.clusterType!) as HTMLInputElement).disabled).toBe(true);
      }
    });
  });

  it('should disable no radio buttons if disabled is false', () => {
    render(
      <SupportedClusterTypesInput disabled={false} selectedClusterTypes={[ComputeClusterLabels.Spark]} />
    );

    expect((screen.getByLabelText('none') as HTMLInputElement).disabled).toBe(false);
    allClusterTypes.map(cluster => {
      expect((screen.getByLabelText(cluster.clusterType!) as HTMLInputElement).disabled).toBe(false);
    });
  });
});
