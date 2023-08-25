import * as React from "react";
import NavTabs, { NavTabPane } from "@domino/ui/dist/components/NavTabs/NavTabs";

const EnvironmentDetailsNavTabs: React.FC<{ environmentId: string; }> = ({ environmentId }) => {

  const onChange = (tab: string) => {
    if (tab !== 'overview') {
      window.location.href = `/environment/${environmentId}?activeTab=${tab}`;
    }
  };

  return (
    <NavTabs
      defaultActiveKey={'overview'}
      onChange={onChange}
    >
      <NavTabPane
        title="Overview"
        key="overview"
      >
      </NavTabPane>
      <NavTabPane
        title="Revisions"
        key="revisions"
      >
      </NavTabPane>
      <NavTabPane
        title="projects"
        key="projects"
      >
      </NavTabPane>
      <NavTabPane
        title="Models"
        key="models"
      >
      </NavTabPane>
    </NavTabs>
  );

}
export default EnvironmentDetailsNavTabs;
