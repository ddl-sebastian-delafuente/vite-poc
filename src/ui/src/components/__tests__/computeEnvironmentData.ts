import {
  DominoProjectsApiProjectEnvironmentDto as ComputeEnvironment,
} from '@domino/api/dist/types';
import { ComputeClusterLabels } from '@domino/ui/dist/clusters/types';

export const testResults: ComputeEnvironment[] = [
  {
    'id': '5ac6acc8e4b0e9a022588402',
    'archived': false,
    'name': '0 Domino Analytics Distribution - Py3.6 R3.4 - quay base from shiny',
    'owner': {
      'id': '5a6fd2c7e4b0e1ee4ae0bc6f',
      'username': 'integration-test'
    },
    'version': 1,
    'visibility': 'Private',
    // 'html_url': '/environments/integration-test?maybeEnvironmentIdToEdit=5ac6acc8e4b0e9a022588402',
    supportedClusters: [ComputeClusterLabels.Spark, ComputeClusterLabels.Ray],
  },
  {
    'id': '5a6bc813aa117866c7833d60',
    'archived': false,
    'name': '2 (Default)',
    'owner': undefined,
    'version': 1,
    'visibility': 'Global',
    // 'html_url': '/environments/integration-test?maybeEnvironmentIdToEdit=5a6bc813aa117866c7833d60',
    supportedClusters: [],
  },
  {
    'id': '5b64c2634cedfd000712a82f',
    'archived': false,
    'name': '3 Dash app publishing',
    'owner': {
      'id': '5ac42816e4b0e9a0a82bbe8f',
      'username': 'njablonski'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5b64c2634cedfd000712a82f',
    supportedClusters: [],
  },
  {
    'id': '5ba10e8a4cedfd00088d99e2',
    'archived': true,
    'name': '4 xyz',
    'owner': {
      'id': '5a6fd2c7e4b0e1ee4ae0bc6f',
      'username': 'integration-test'
    },
    'version': 1,
    'visibility': 'Private',
    // 'html_url': '/environments/5ba10e8a4cedfd00088d99e2',
    supportedClusters: [],
  },
  {
    'id': '5ba10deb4cedfd000768dd8f',
    'archived': true,
    'name': '5 Domino Analytics Distribution - Py3.6 R3.4 - quay base from shiny',
    'owner': {
      'id': '5a6fd2c7e4b0e1ee4ae0bc6f',
      'username': 'integration-test'
    },
    'version': 1,
    'visibility': 'Private',
    // 'html_url': '/environments/5ba10deb4cedfd000768dd8f',
    supportedClusters: [],
  },
  {
    'id': '5a6bc8f4e4b0b1685aed6cb0',
    'archived': false,
    'name': 'Default',
    'owner': undefined,
    'version': 2,
    'visibility': 'Global',
    // 'html_url': '/environments/5a6bc8f4e4b0b1685aed6cb0',
    supportedClusters: [],
  },
  {
    'id': '5a9d9ff5e4b0b71cce7488fd',
    'archived': false,
    'name': `99 <img src=x onerror='alert(document.domain)'/>Duplicate of Default`,
    'owner': {
      'id': '5a99ffb6e4b0261d35377bb8',
      'username': 'dave'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5a9d9ff5e4b0b71cce7488fd',
    supportedClusters: [],
  },
  {
    'id': '5bc11a904cedfd000757b113',
    'archived': false,
    'name': 'Duplicate of Domino Analytics Distribution - Py3.6 R3.4 - quay base from shiny',
    'owner': {
      'id': '5a99ffb6e4b0261d35377bb8',
      'username': 'dave'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5bc11a904cedfd000757b113',
    supportedClusters: [],
  },
  {
    'id': '5b92cf8d4cedfd0007ffcd79',
    'archived': false,
    'name': 'JohnPhillips CentOS7',
    'owner': undefined,
    'version': 2,
    'visibility': 'Global',
    // 'html_url': '/environments/5b92cf8d4cedfd0007ffcd79',
    supportedClusters: [],
  },
  {
    'id': '5b3e8bece4b0aae5d5de2fd5',
    'archived': false,
    'name': 'anoter dom-7897 test',
    'owner': {
      'id': '5a7b7670e4b08debfadaafac',
      'username': 'chris'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5b3e8bece4b0aae5d5de2fd5',
    supportedClusters: [],
  },
  {
    'id': '5b2d63efe4b0aae53a7f88b9',
    'archived': false,
    'name': 'Domino Analytics Distribution - Py3.6 R3.4 - quay base from shiny',
    'owner': undefined,
    'version': 2,
    'visibility': 'Global',
    // 'html_url': '/environments/5b2d63efe4b0aae53a7f88b9',
    supportedClusters: [],
  },
  {
    'id': '5b27fde1e4b03a3cfdd6ac96',
    'archived': false,
    'name': 'system-tests-892C8E-test_environments',
    'owner': {
      'id': '5ac6b6f5e4b0e9a0a368a713',
      'username': 'system-test'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5b27fde1e4b03a3cfdd6ac96',
    supportedClusters: [],
  },
  {
    'id': '5a7c19ece4b0acda9b8efa0d',
    'archived': false,
    'name': 'domino-markcurtis-Rstudio',
    'owner': {
      'id': '5a7c1811e4b0acda9b8ef9ff',
      'username': 'domino-markcurtis'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5a7c19ece4b0acda9b8efa0d',
    supportedClusters: [],
  },
  {
    'id': '5b342d56e4b092ddc418dd08',
    'archived': false,
    'name': 'fernando-ipython-4.1.2',
    'owner': {
      'id': '5af9e55de4b01208d32e0a3c',
      'username': 'fernando'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5b342d56e4b092ddc418dd08',
    supportedClusters: [],
  },
  {
    'id': '5bbe4f574cedfd0007d6a571',
    'archived': false,
    'name': 'Wen DAD - Py3.6 R3.4 - quay base from shiny',
    'owner': {
      'id': '5ba17f8d4cedfd00076abf9a',
      'username': 'domino-wen'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5bbe4f574cedfd0007d6a571',
    supportedClusters: [],
  },
  {
    'id': '5b92f2704cedfd0007ebb7f7',
    'archived': false,
    'name': 'Fernando CentOS7',
    'owner': {
      'id': '5af9e55de4b01208d32e0a3c',
      'username': 'fernando'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5b92f2704cedfd0007ebb7f7',
    supportedClusters: [],
  },
  {
    'id': '5b1b159de4b07e0631cba707',
    'archived': false,
    'name': 'Duplicate of Domino Analytics Distribution Py3.6 R3.4',
    'owner': {
      'id': '5a962254e4b0e235a6a50c44',
      'username': 'domino-judy'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5b1b159de4b07e0631cba707',
    supportedClusters: [],
  },
  {
    'id': '5b91a4064cedfd00072a4575',
    'archived': false,
    'name': 'pretend_env',
    'owner': {
      'id': '5a6fd2c7e4b0e1ee4ae0bc6f',
      'username': 'integration-test'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5b91a4064cedfd00072a4575',
    supportedClusters: [],
  },
  {
    'id': '5b2d408de4b07e060f471f68',
    'archived': false,
    'name': 'system-tests-53F6DB-test_environments',
    'owner': {
      'id': '5ac6b6f5e4b0e9a0a368a713',
      'username': 'system-test'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5b2d408de4b07e060f471f68',
    supportedClusters: [],
  },
  {
    'id': '5b06f709e4b08ff02e18cb45',
    'archived': false,
    'name': 'Duplicate of Duplicate of Default',
    'owner': {
      'id': '5a962254e4b0e235a6a50c44',
      'username': 'domino-judy'
    },
    'version': 2,
    supportedClusters: [],
    'visibility': 'Private',
    // 'html_url': '/environments/5b06f709e4b08ff02e18cb45',
  },
  {
    'id': '5b07423fe4b08ff05bf57f9c',
    'archived': false,
    'name': 'Duplicate of Domino Analytics Distribution Py3.6 R3.4',
    'owner': {
      'id': '5a962254e4b0e235a6a50c44',
      'username': 'domino-judy'
    },
    'version': 2,
    supportedClusters: [],
    'visibility': 'Private',
    // 'html_url': '/environments/5b07423fe4b08ff05bf57f9c',
  },
  {
    'id': '5af37219e4b05689acddc24e',
    'archived': false,
    'name': 'Domino Analytics Distribution Py3.6 R3.4',
    'owner': undefined,
    'version': 2,
    'visibility': 'Global',
    // 'html_url': '/environments/5af37219e4b05689acddc24e',
    supportedClusters: [],
  },
  {
    'id': '5b074f18e4b020ef4d67cb5a',
    'archived': false,
    'name': 'hippies',
    'owner': {
      'id': '5b3a6735e4b03a3cc9a25285',
      'username': 'AbcOrg'
    },
    'version': 2,
    'visibility': 'Organization',
    // 'html_url': '/environments/5b074f18e4b020ef4d67cb5a',
    supportedClusters: [],
  },
  {
    'id': '5b2d5e8ce4b0aae53a7f87fa',
    'archived': false,
    'name': 'system-tests-9C23FB-test_environments',
    'owner': {
      'id': '5ac6b6f5e4b0e9a0a368a713',
      'username': 'system-test'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5b2d5e8ce4b0aae53a7f87fa',
    supportedClusters: [],
  },
  {
    'id': '5b0dbd59e4b04221b01a3b64',
    'archived': false,
    'name': 'system-tests-64CCD2-test_environments',
    'owner': {
      'id': '5a6fd2c7e4b0e1ee4ae0bc6f',
      'username': 'integration-test'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5b0dbd59e4b04221b01a3b64',
    supportedClusters: [],
  },
  {
    'id': '5bbcb19b4cedfd0008a96f4e',
    'archived': false,
    'name': 'abc',
    'owner': {
      'id': '5a7ce90ee4b00240c9e041da',
      'username': 'domino-marks'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5bbcb19b4cedfd0008a96f4e',
    supportedClusters: [],
  },
  {
    'id': '5b33d702e4b00d5da1049d1c',
    'archived': false,
    'name': 'fernando-old-image',
    'owner': {
      'id': '5af9e55de4b01208d32e0a3c',
      'username': 'fernando'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5b33d702e4b00d5da1049d1c',
    supportedClusters: [],
  },
  {
    'id': '5b07503ee4b08ff059f02519',
    'archived': false,
    'name': 'Duplicate of hippies',
    'owner': {
      'id': '5b05a5a2e4b0dc6e5d3a68bb',
      'username': 'chriscoolorg'
    },
    'version': 2,
    'visibility': 'Organization',
    // 'html_url': '/environments/5b07503ee4b08ff059f02519',
    supportedClusters: [],
  },
  {
    'id': '5b088a63e4b07797bf1f1902',
    'archived': false,
    'name': 'system-tests-28F44C-test_environments',
    'owner': {
      'id': '5a6fd2c7e4b0e1ee4ae0bc6f',
      'username': 'integration-test'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5b088a63e4b07797bf1f1902',
    supportedClusters: [],
  },
  {
    'id': '5ac6ad0ce4b0e9a02258840c',
    'archived': false,
    'name': 'butts',
    'owner': {
      'id': '5a6fd2c7e4b0e1ee4ae0bc6f',
      'username': 'integration-test'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5ac6ad0ce4b0e9a02258840c',
    supportedClusters: [],
  },
  {
    'id': '5b08922ce4b07797bf1f191e',
    'archived': false,
    'name': 'system-tests-0FB1BB-test_environments',
    'owner': {
      'id': '5a6fd2c7e4b0e1ee4ae0bc6f',
      'username': 'integration-test'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5b08922ce4b07797bf1f191e',
    supportedClusters: [],
  },
  {
    'id': '5bbfe8484cedfd00071d1089',
    'archived': false,
    'name': 'DOM-9721 Domino Analytics Distribution - Py3.6 R3.4 - quay base from shiny',
    'owner': {
      'id': '5b2829bfe4b00d5d59a1a68b',
      'username': 'domino-zaching'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5bbfe8484cedfd00071d1089',
    supportedClusters: [],
  },
  {
    'id': '5ba10ec94cedfd00088d99e5',
    'archived': false,
    'name': 'Duplicate of xyz',
    'owner': {
      'id': '5a6fd2c7e4b0e1ee4ae0bc6f',
      'username': 'integration-test'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5ba10ec94cedfd00088d99e5',
    supportedClusters: [],
  },
  {
    'id': '5bc5253c4cedfd0007292e2b',
    'archived': false,
    'name': 'Duplicate of Domino Analytics Distribution - Py3.6 R3.4 - quay base from shiny',
    'owner': {
      'id': '5a6fd2c7e4b0e1ee4ae0bc6f',
      'username': 'integration-test'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5bc5253c4cedfd0007292e2b',
    supportedClusters: [],
  },
  {
    'id': '5afbced8e4b08109dfc283c4',
    'archived': false,
    'name': 'Duplicate of Domino Analytics Distribution Py3.6 R3.4',
    'owner': {
      'id': '5a962254e4b0e235a6a50c44',
      'username': 'domino-judy'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5afbced8e4b08109dfc283c4',
    supportedClusters: [],
  },
  {
    'id': '5af9dd68e4b081095f375f99',
    'archived': false,
    'name': 'Duplicate of Domino Analytics Distribution Py3.6 R3.4',
    'owner': {
      'id': '5a962254e4b0e235a6a50c44',
      'username': 'domino-judy'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5af9dd68e4b081095f375f99',
    supportedClusters: [],
  },
  {
    'id': '5ac6ad13e4b0e9a022588411',
    'archived': false,
    'name': 'new env',
    'owner': {
      'id': '5a962254e4b0e235a6a50c44',
      'username': 'domino-judy'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5ac6ad13e4b0e9a022588411',
    supportedClusters: [],
  },
  {
    'id': '5b2d85f2e4b03a3cef3673ba',
    'archived': false,
    'name': 'DOM-8016 without plugs',
    'owner': {
      'id': '5a6fd2c7e4b0e1ee4ae0bc6f',
      'username': 'integration-test'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5b2d85f2e4b03a3cef3673ba',
    supportedClusters: [],
  },
  {
    'id': '5ac6ad0be4b07a9fe6a7865e',
    'archived': false,
    'name': 'aaaaaa',
    'owner': {
      'id': '5a9ee1b0e4b0ca946d04151a',
      'username': 'robin'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5ac6ad0be4b07a9fe6a7865e',
    supportedClusters: [],
  },
  {
    'id': '5b2b2b8ce4b03a3c24fcec18',
    'archived': false,
    'name': 'Domino Analytics Distribution Py3.6 R3.4 - ubuntu base from shiny',
    'owner': undefined,
    'version': 2,
    'visibility': 'Global',
    // 'html_url': '/environments/5b2b2b8ce4b03a3c24fcec18',
    supportedClusters: [],
  },
  {
    'id': '5bc68a584cedfd0007077711',
    'archived': false,
    'name': `99 <img src=x onerror='alert(document.domain)'/>`,
    'owner': {
      'id': '5a7ce90ee4b00240c9e041da',
      'username': 'domino-marks'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5bc68a584cedfd0007077711',
    supportedClusters: [],
  },
  {
    'id': '5af0aa97e4b0a02a4db9eac9',
    'archived': false,
    'name': 'Duplicate of Default',
    'owner': {
      'id': '5a6fd2c7e4b0e1ee4ae0bc6f',
      'username': 'integration-test'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5af0aa97e4b0a02a4db9eac9',
    supportedClusters: [],
  },
  {
    'id': '5bae7e0c4cedfd0007c8c475',
    'archived': false,
    'name': 'system-tests-43A07D-test_environments',
    'owner': {
      'id': '5ac6b6f5e4b0e9a0a368a713',
      'username': 'system-test'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5bae7e0c4cedfd0007c8c475',
    supportedClusters: [],
  },
  {
    'id': '5a9ee683e4b0261daf2b8330',
    'archived': false,
    'name': 'jupyter lab',
    'owner': {
      'id': '5a99ffb6e4b0261d35377bb8',
      'username': 'dave'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5a9ee683e4b0261daf2b8330',
    supportedClusters: [],
  },
  {
    'id': '5af34983e4b05689178fa22a',
    'archived': false,
    'name': '59ba07780134de19a7e9ee03',
    'owner': {
      'id': '5a6fd2c7e4b0e1ee4ae0bc6f',
      'username': 'integration-test'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5af34983e4b05689178fa22a',
    supportedClusters: [],
  },
  {
    'id': '5b06f6c3e4b08ff02e18cb43',
    'archived': false,
    'name': 'Duplicate of Duplicate of Default',
    'owner': {
      'id': '5a962254e4b0e235a6a50c44',
      'username': 'domino-judy'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5b06f6c3e4b08ff02e18cb43',
    supportedClusters: [],
  },
  {
    'id': '5b92f5b84cedfd0007d19435',
    'archived': false,
    'name': 'DOM-9134  UAT',
    'owner': {
      'id': '5a6fd2c7e4b0e1ee4ae0bc6f',
      'username': 'integration-test'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5b92f5b84cedfd0007d19435',
    supportedClusters: [],
  },
  {
    'id': '5ac27379e4b07a9fdee5a7a8',
    'archived': false,
    'name': 'steved env',
    'owner': {
      'id': '5a97619ae4b029e21246d7df',
      'username': 'steved'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5ac27379e4b07a9fdee5a7a8',
    supportedClusters: [],
  },
  {
    'id': '5bcda80b4cedfd000759dcd9',
    'archived': false,
    'name': 'senthil-test-env',
    'owner': {
      'id': '5bcd79ba4cedfd000761f8ac',
      'username': 'senthil-avn'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5bcda80b4cedfd000759dcd9',
    supportedClusters: [],
  },
  {
    'id': '5b8061444cedfd0008cd2116',
    'archived': false,
    'name': 'Duplicate of Domino Analytics Distribution - Py3.6 R3.4 - quay base from shiny',
    'owner': {
      'id': '5a9ee1b0e4b0ca946d04151a',
      'username': 'robin'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5b8061444cedfd0008cd2116',
    supportedClusters: [],
  },
  {
    'id': '5abe801de4b020ef588b1539',
    'archived': false,
    'name': 'Renamed Duplicate of Default',
    'owner': {
      'id': '5aa6e6b5e4b01fff8deb0d83',
      'username': 'alex'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5abe801de4b020ef588b1539',
    supportedClusters: [],
  },
  {
    'id': '5ac53620e4b0e9a007e6e15c',
    'archived': false,
    'name': 'test R',
    'owner': {
      'id': '5a6fd2c7e4b0e1ee4ae0bc6f',
      'username': 'integration-test'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5ac53620e4b0e9a007e6e15c',
    supportedClusters: [],
  },
  {
    'id': '5aeb493ee4b00f2bd9ad0568',
    'archived': false,
    'name': 'Duplicate of Default',
    'owner': {
      'id': '5a962254e4b0e235a6a50c44',
      'username': 'domino-judy'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5aeb493ee4b00f2bd9ad0568',
    supportedClusters: [],
  },
  {
    'id': '5b070cf5e4b08ff02e18cb47',
    'archived': false,
    'name': 'Duplicate of jupyter lab',
    'owner': {
      'id': '5a6fd2c7e4b0e1ee4ae0bc6f',
      'username': 'integration-test'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5b070cf5e4b08ff02e18cb47',
    supportedClusters: [],
  },
  {
    'id': '5ab95f34e4b00f2ba01d7068',
    'archived': false,
    'name': 'ROracle test',
    'owner': {
      'id': '5a6fd2c7e4b0e1ee4ae0bc6f',
      'username': 'integration-test'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5ab95f34e4b00f2ba01d7068',
    supportedClusters: [],
  },
  {
    'id': '5b075810e4b020ef4d67cb5f',
    'archived': false,
    'name': 'system-tests-DA36F4-test_environments',
    'owner': {
      'id': '5a6fd2c7e4b0e1ee4ae0bc6f',
      'username': 'integration-test'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5b075810e4b020ef4d67cb5f',
    supportedClusters: [],
  },
  {
    'id': '5b08a21fe4b0422147bd4f95',
    'archived': false,
    'name': 'system-tests-D17112-test_environments',
    'owner': {
      'id': '5a6fd2c7e4b0e1ee4ae0bc6f',
      'username': 'integration-test'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5b08a21fe4b0422147bd4f95',
    supportedClusters: [],
  },
  {
    'id': '5b2d5985e4b026f78e156dcb',
    'archived': false,
    'name': 'system-tests-D5839D-test_environments',
    'owner': {
      'id': '5ac6b6f5e4b0e9a0a368a713',
      'username': 'system-test'
    },
    'version': 2,
    'visibility': 'Private',
    // 'html_url': '/environments/5b2d5985e4b026f78e156dcb',
    supportedClusters: [],
  },
  {
    'id': '5a995cade4b0cdc55ba8e015',
    'archived': false,
    'name': 'Duplicate of Default',
    'owner': {
      'id': '5b4916544cedfd00071fb235',
      'username': 'test_org'
    },
    'version': 2,
    'visibility': 'Organization',
    // 'html_url': '/environments/5a995cade4b0cdc55ba8e015',
    supportedClusters: [],
  },
  {
  'id': '5e981b92c3427a28af9c9dd2',
  'archived': false,
  'name': '2 (Default)',
  'owner': undefined,
  'version': 1,
  'visibility': 'Global',
  // 'html_url': '/environments/integration-test?maybeEnvironmentIdToEdit=5a6bc813aa117866c7833d60',
  supportedClusters: [],
},
];

export const curatedEnvironments: ComputeEnvironment[] = [
  {
    'id': '6a995cade4b0cdc55ba8e015',
    'archived': false,
    'name': 'c1',
    'version': 2,
    'visibility': 'Global',
    supportedClusters: [],
    'isCurated': true,
    'activeRevisionTags': ['nvidia']
  }
];

export const restrictedEnvironments: ComputeEnvironment[] = [
  {
    'id': '6a995cade4b0cdc55ba8e015',
    'archived': false,
    'name': 'c1',
    'version': 2,
    'visibility': 'Global',
    supportedClusters: [],
    'isCurated': true,
    'activeRevisionTags': ['nvidia'],
    restrictedRevisionNumber: 4,
    restrictedRevisionId: 'restrictedRevisionId'
  }
];
