import React,{useEffect} from "react";
import { getCurrentUser } from '@domino/api/dist/Users';
import { mixpanel } from '../mixpanel';
import { MonitoringTabVisitedEvent, MonitoringConfiguredEvent, ModelApiPageView, Locations } from '../mixpanel/types';

export const trackMonitoringTabVisits = async (modelId: string) => {
  const { id: userId } = await getCurrentUser({});
  mixpanel.track(
    () =>
      new MonitoringTabVisitedEvent({
        userId,
        modelId,
        location: Locations.ModelMonitoring
      })
  );
};

export const trackConfigureMonitoring = async (modelId: string, modelVersionId: string) => {
  const { id: userId } = await getCurrentUser({});
  mixpanel.track(
    () =>
      new MonitoringConfiguredEvent({
        userId,
        modelId,
        modelVersionId,
        location: Locations.ModelMonitoring
      })
  );
};

export const ModelApiPageViewTracker = () => {
    useEffect(() => {
        mixpanel.track(() =>
            new ModelApiPageView({
                location: Locations.ModelApiPageView
            })
        )}, []);

    return <React.Fragment />;
};
