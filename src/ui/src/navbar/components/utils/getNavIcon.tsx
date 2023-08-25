import * as React from 'react';
import { omit } from 'ramda';
import {
  SearchOutlined,
  SettingOutlined,
  ToolFilled,
  ClockCircleOutlined,
  DesktopOutlined,
  EyeOutlined,
  ImportOutlined,
  FileOutlined,
  FileSearchOutlined,
  TagOutlined,
  WarningFilled,
  FolderOpenOutlined,
  ExperimentOutlined,
  CodeOutlined,
  HomeOutlined
} from '@ant-design/icons';
import LaunchpadIcon from '../../../icons/LaunchpadIcon';
import LabIcon from '../../../icons/LabIcon';
import ControlCenterIcon from '../../../icons/ControlCenterIcon';
import DataIcon from '../../../icons/DataIcon';
import EnvironmentsIcon from '../../../icons/EnvironmentsIcon';
import ModelsIcon from '../../../icons/ModelsIcon';
import CommentText from '../../../icons/CommentText';
import SwitcherIcon from '../../../icons/Switcher';
import AccountSettingIcon from '../../../icons/AccountSettingIcon';
import LogoutIcon from '../../../icons/LogoutIcon';
import Jobs from '../../../icons/Jobs';
import Pulse from '../../../icons/Pulse';
import Publish from '../../../icons/Publish';
import ProjectsPortfolioIcon from '../../../icons/ProjectsPortfolioIcon';
import ComputeAndSpendIcon from '../../../icons/ComputeAndSpendIcon';
import ProjectStage from '../../../icons/ProjectStage';
import Apps from '../../../icons/Apps';
import ModelAPI from '../../../icons/ModelAPI';
import AssetsPortfolioIcon from '../../../icons/AssetsPortfolioIcon';
import Goal from '../../../icons/Goal';
import Summarize from '../../../icons/Summarize';
import Milestone from '../../../icons/Milestone';
import Track from '../../../icons/Track';
import Jira from '../../../icons/Jira';
import Home from '../../../icons/Home';
import RunsIcon from '../../../icons/RunsIcon';
import Launchers from '../../../icons/Launchers';
import CodeFile from '../../../icons/CodeFile';
import ModelMonitorIcon from '../../../icons/ModelMonitorIcon';
import { fontSizes } from '../../../styled';

export enum IconType {
  FastDatasets = 'fastdatasets',
  Admin = 'admin',
  ControlCenter = 'controlcenter',
  Lab = 'lab',
  Launchpad = 'launchpad',
  Discussion = 'discussion',
  Download = 'download',
  Environments = 'environments',
  Files = 'filesbrowser',
  Models = 'models',
  ProjectOverview = 'projectoverview',
  Projects = 'projects',
  Publish = 'publish',
  Reviews = 'reviews',
  Runs = 'runs',
  Schedule = 'schedule',
  Search = 'search',
  Settings = 'settings',
  Workspaces = 'workspaces',
  Tags = 'tags',
  Switcher = 'switcher',
  Logout = 'logout',
  AccountSetting = 'account',
  Overview = 'overview',
  Activity = 'activity',
  ProjectsPortfolio = 'projectsportfolio',
  ComputeAndSpend = 'computeandspend',
  WarningIcon = 'warningicon',
  ProjectStage = 'projectstage',
  Apps = 'apps',
  ModelAPI = 'model_api',
  AssetsPortfolio = 'assetsportfolio',
  Goal = 'goal',
  Summarize = 'summarize',
  Milestone = 'milestone',
  Track = 'track',
  Jira = 'jira',
  Home = 'home',
  Run = 'run',
  Launchers = 'launchers',
  CodeFile = 'codefile',
  ModelMonitor = 'modelmonitor',
  ImportOutlined = 'importoutlined',
  Experiments = 'experiments'
}

const defaultIconProps = {
  height: 16,
  width: 16,
  secondaryColor: 'white',
};

export default function getNavIcon(type: IconType, iconProps: any = defaultIconProps): JSX.Element {
  const iconType = type ? type.toLowerCase() : type;
  const iconPropsForAntd = {
    style: {...omit(['secondaryColor'], iconProps), display: 'inline-flex', },
  };

  switch (iconType) {
    case IconType.FastDatasets:
      return (
        <DataIcon
          {...iconProps}
          height={iconProps.height ? iconProps.height + 1 : iconProps.height}
        />
      );
    case IconType.Admin:
      return <ToolFilled style={{ fontSize: '16px' }} {...iconProps} />;
    case IconType.ControlCenter:
      return <ControlCenterIcon {...iconProps} />;
    case IconType.Lab:
      return <LabIcon {...iconProps} />;
    case IconType.Launchpad:
      return <LaunchpadIcon {...iconProps} />;
    case IconType.Discussion:
      return <CommentText {...iconProps} />;
    case IconType.Download:
      //@ts-ignore
      return <CodeOutlined {...iconPropsForAntd} />
    case IconType.Environments:
      return <EnvironmentsIcon {...iconProps} />;
    case IconType.Files:
      return <FileOutlined {...iconProps} style={{ fontSize: fontSizes.MEDIUM }} />;
    case IconType.Models:
      return <ModelsIcon {...iconProps} />;
    case IconType.ProjectOverview:
      return <FileSearchOutlined style={{ fontSize: '16px' }} {...iconProps} />;
    case IconType.Projects:
      return <FolderOpenOutlined {...iconProps} style={{ fontSize: fontSizes.MEDIUM }} />;
    case IconType.Publish:
      return <Publish {...iconProps} />;
    case IconType.ImportOutlined:
      return <ImportOutlined style={{ fontSize: fontSizes.MEDIUM }} />;
    case IconType.Reviews:
      return <EyeOutlined style={{ fontSize: '16px' }} {...iconProps} />;
    case IconType.Runs:
      return <Jobs {...iconProps} />;
    case IconType.Search:
      return (<SearchOutlined style={{ fontSize: '18px' }} {...iconProps} />);
    case IconType.Schedule:
      return <ClockCircleOutlined style={{ fontSize: '16px' }} {...iconProps} />;
    case IconType.Settings:
      return <SettingOutlined style={{ fontSize: '16px' }} {...iconProps} />
    case IconType.Workspaces:
      return <DesktopOutlined style={{ fontSize: '16px' }} {...iconProps} />;
    case IconType.Tags:
      return <TagOutlined style={{ fontSize: fontSizes.MEDIUM }} {...iconProps} />;
    case IconType.Switcher:
      return <SwitcherIcon {...iconProps} />;
    case IconType.AccountSetting:
      return <AccountSettingIcon {...iconProps} />;
    case IconType.Logout:
      return <LogoutIcon {...iconProps} />;
    case IconType.Overview:
      // @ts-ignore
      return <HomeOutlined {...iconPropsForAntd} />
    case IconType.Activity:
      return <Pulse {...iconProps} />;
    case IconType.ProjectsPortfolio:
      return <ProjectsPortfolioIcon {...iconProps} />;
    case IconType.ComputeAndSpend:
      return <ComputeAndSpendIcon {...iconProps} />;
    case IconType.WarningIcon:
      return <WarningFilled style={{ fontSize: '13px' }} />;
    case IconType.ProjectStage:
      return <ProjectStage {...iconProps} />;
    case IconType.Apps:
      return <Apps {...iconProps} />;
    case IconType.ModelAPI:
      return <ModelAPI {...iconProps} />;
    case IconType.AssetsPortfolio:
      return <AssetsPortfolioIcon {...iconProps} />;
    case IconType.Goal:
      return <Goal {...iconProps} />;
    case IconType.Summarize:
      return <Summarize {...iconProps} />;
    case IconType.Milestone:
      return <Milestone {...iconProps} />;
    case IconType.Track:
      return <Track {...iconProps} />;
    case IconType.Jira:
      return <Jira {...iconProps} />;
    case IconType.Home:
      return <Home {...iconProps} />;
    case IconType.Run:
      return <RunsIcon {...iconProps} />;
    case IconType.Launchers:
      return <Launchers {...iconProps} />;
    case IconType.CodeFile:
      return <CodeFile {...iconProps} />;
    case IconType.ModelMonitor:
      return <ModelMonitorIcon {...iconProps} />;
    case IconType.Experiments:
      return <ExperimentOutlined style={{ fontSize: '16px' }} {...iconProps} />;
    default:
      return (
        <div dangerouslySetInnerHTML={{ __html: iconType }} />
      );
  }
}
