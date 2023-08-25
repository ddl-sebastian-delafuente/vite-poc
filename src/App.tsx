import { useEffect, useState } from "react";
import { Table } from "antd";
import NavBar from "./ui/dist/navbar/Navbar";
import styled from "styled-components";

import { AppLayout } from "./ui/dist/components/Layouts/AppLayout";
import { Domino30ThemeProvider } from "./ui/dist/styled";

import { MemoryRouter } from "react-router-dom";

import { AccessControlProvider } from "./ui/dist/core/AccessControlProvider";

function App() {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch("/v4/organizations")
      .then((data) => data.json())
      .then((data) => setTableData(data));
  }, []);

  const StyledLayout = styled.div`
    flex: 1;
    overflow: visible;
    width: 100%;
    margin-left: 1rem;
  `;

  useEffect(() => {
    document.querySelector("#root").style.width = "100%";
  }, []);

  return (
    <>
        <AccessControlProvider>
          <MemoryRouter>
            <Domino30ThemeProvider>
              <AppLayout>
                <NavBar
                  pathnameOverride={{
                    name: "active location",
                    table: { defaultValue: { summary: "/projects" } },
                    description:
                      "Choose the active location. While Nav Bar is displayed, you can choose Overview to come back the main list.",
                    control: {
                      type: "select",
                      options: {
                        Overview: "/overview",
                        Data: "/data",
                        Projects: "/projects",
                        Environments: "/environments",
                        "Models APIs": "/models",
                        Tags: "/projectTags",
                      },
                    },
                  }}
                  flags={{
                    enableSparkClusters: true,
                    enableRayClusters: true,
                    enableDaskClusters: true,
                    showEndpointSpend: true,
                    showComputeInControlCenter: true,
                    showTagsNavItem: true,
                    showAdminMenu: true,
                    showDSLFeatures: true,
                    showV1DataProjects: true,
                    enableGitBasedProjects: true,
                    enableMergeConflictResolution: true,
                    enableInWorkspaceBranchSelection: true,
                    disableDFSBasedProjects: true,
                    enableExternalDataVolumes: true,
                    enableFeatureStore: true,
                    enableModelAPIs: true,
                    enableModelRegistry: true,
                    enableModelMonitoringForModelAPIs: true,
                    enableApps: true,
                    enableLaunchers: true,
                    // @ts-ignore
                    enableExportsWorkflow: true,
                    enableFeedbackModal: true,
                    showUserNotifications: true,
                    enableGitCredentialFlowForCollaborators: true,
                    enableSagemakerExportUI: true,
                    hideWelcomeCarousel: true,
                    twirlConversionFor58: true,
                  }}
                />

                <StyledLayout>
                  <h1>Vite Demo</h1>
                  <Table
                    dataSource={tableData}
                    columns={[{ key: 1, dataIndex: "name", title: "Name" }]}
                  />
                </StyledLayout>
              </AppLayout>
            </Domino30ThemeProvider>
          </MemoryRouter>
        </AccessControlProvider>
    </>
  );
}

export default App;
