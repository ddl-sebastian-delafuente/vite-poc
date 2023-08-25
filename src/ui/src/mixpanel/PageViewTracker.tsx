import React,{useEffect} from "react";
import { mixpanel } from './index';
import { ProjectTagsPageView, SearchPageView, Locations } from './types';

export const ProjectTagsPageViewTracker = () => {
    useEffect(() => {
        mixpanel.track(() =>
            new ProjectTagsPageView({
                location: Locations.ProjectTagsPageView
            })
        )}, []);

    return <React.Fragment />;
};

export const SearchPageViewTracker = () => {
    useEffect(() => {
        mixpanel.track(() =>
            new SearchPageView({
                location: Locations.SearchPageView
            })
        )}, []);

    return <React.Fragment />;
};
