import * as React from 'react';
import { isNil } from 'ramda';
import { Spin } from 'antd';
import millify from 'millify';
import Link from '../components/Link/Link';
import { PredictionText } from './atoms';
import { createModelMonitoringRoute } from './constants';

export enum TestIds {
  SPINNER = 'predictions-loading-spinner',
  TEXT = 'prediction-text'
}

interface Props {
  modelId: string;
  loading: boolean;
  predictionsCount: number | null;
}

const Predictions: React.FC<Props> = ({ modelId, loading, predictionsCount }) => {
  if (loading) {
    return (
      <div>
        <Spin size="small" data-test={TestIds.SPINNER} />
      </div>
    );
  }

  if (isNil(predictionsCount)) {
    return <React.Fragment>&ndash;</React.Fragment>;
  }

  return (
    <React.Fragment>
      <Link href={createModelMonitoringRoute(modelId)}>
        {<PredictionText data-test={TestIds.TEXT}>{millify(predictionsCount)}</PredictionText>}
      </Link>
    </React.Fragment>
  );
};

export default Predictions;
