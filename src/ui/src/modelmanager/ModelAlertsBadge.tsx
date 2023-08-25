import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { Badge, Spin, Tooltip } from 'antd';
import { isNil } from 'ramda';
import Link from '../components/Link/Link';
import { AlertDisabledIcon, ModelAlertsContainer, SuccessCheckIcon } from './atoms';
import { createModelMonitoringRoute } from './constants';
import { CheckCircleFilled } from '@ant-design/icons';

interface ModelAlertsBadgeProps {
  loading: boolean;
  count: number | null;
  toolTipMessage: string;
  modelId: string;
  showTooltip: boolean;
  clickable?: boolean;
}

export const AlertBadge: React.FunctionComponent<
  Pick<ModelAlertsBadgeProps, 'count' | 'toolTipMessage' | 'showTooltip'>
> = ({ count, toolTipMessage, showTooltip }) => {
  let badge = <Badge count={count} data-test="alert-badge" />;
  if (count === 0) {
    return <SuccessCheckIcon component={CheckCircleFilled} data-test="alert-success-icon" />;
  } else if (isNil(count)) {
    badge = <AlertDisabledIcon data-test="alert-badge-disabled-icon" />
  }

  return showTooltip ? <Tooltip title={toolTipMessage}>{badge}</Tooltip> : badge;
};

const ModelAlertsBadge: React.FunctionComponent<ModelAlertsBadgeProps> = ({
  loading,
  modelId,
  count,
  toolTipMessage,
  showTooltip,
  clickable = true
}) => {
  if (loading) {
    return (
      <ModelAlertsContainer>
        <div>
          <Spin size="small" data-test="model-alert-badge-spinner" />
        </div>
      </ModelAlertsContainer>
    );
  }
  const alertBadge = <AlertBadge count={count} toolTipMessage={toolTipMessage} showTooltip={showTooltip} />;

  return (
    <ModelAlertsContainer>
      {clickable ? <Link href={createModelMonitoringRoute(modelId)} dataTest="model-alert-badge-link">{alertBadge}</Link> : alertBadge}
    </ModelAlertsContainer>
  );
};

export default ModelAlertsBadge;
