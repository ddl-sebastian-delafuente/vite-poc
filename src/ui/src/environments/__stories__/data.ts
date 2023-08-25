import { ComputeClusterType } from '@domino/api/dist/types';

export const resultEnvironmentCreate = {
  canTransferOwnership: true,
  canCreateGlobalEnvironment: true,
  visibility: 'Private',
  usersForEnvironment: [
    { id: '5cddb4121929770006ff25a6', userName: 'Project-8070org' },
    { id: '5cde8191b1ac570006fe0e9b', userName: 'testorg1' },
    { id: '5cf06437563ecd000699c6ae', userName: 'austin-test-org' },
    { id: '5d003b01f334f00006f904e5', userName: 'uat' },
    { id: '5d068efb0b023d00062ffd01', userName: 'abctestorg' },
    { id: '5d0b91fcb7087600060b5a8f', userName: 'org11' },
    { id: '5d1b23dac8f90700061e4a64', userName: 'org12' },
    { id: '5d1ce8d55e24ef0006552c12', userName: 'cool-people' },
    { id: '5d1fbfe7b7074b000676d098', userName: 'Project-43526org' },
    { id: '5d241c5159462400069a60f5', userName: 'test_org' },
    { id: '5d273e43106ddf0006b0c0ff', userName: 'MyOwnOrgYay' },
    { id: '5d5678f07a1fbf00069d2e03', userName: 'avinash-domino-org' },
    { id: '5d600b619edb4e00063b9070', userName: 'nyc_data_science' },
    { id: '5d600b889edb4e00063b9072', userName: 'claims_research' },
    { id: '5d600b9efc28730006f07543', userName: 'all_data_scientists' },
    { id: '5d7a1f42d25d0d0006a8ad42', userName: 'Domino_Org_1556' },
    { id: '5d7a1f80d25d0d0006a8ad4a', userName: 'Domino_Org_8052' },
    { id: '5d7a2018d25d0d0006a8ad4d', userName: 'prats' },
    { id: '5d7a20714dedd300062ed9bb', userName: 'prats2' },
    { id: '5d7a20c44dedd300062ed9bd', userName: 'pratsc' },
    { id: '5d83140f56c95d0006b9076d', userName: 'DataScience' },
    { id: '5d9769d436b3590006ae1b50', userName: 'Wine' },
    { id: '5dcaf1f43937c900063e3873', userName: 'maksimApiOrg' },
    { id: '5dcbef7bf6c7790006e152e2', userName: '735' },
    { id: '5dcbf11df6c7790006e152e4', userName: '560' },
    { id: '5dcbf1a7f6c7790006e152ec', userName: '275' },
    { id: '5dcbf3634e46650006c30ae4', userName: '946' },
    { id: '5dcbf3dcf6c7790006e152f7', userName: 'Domino_Org_8327' },
    { id: '5dcefe1902b64c000614b840', userName: 'user-research' },
    { id: '5e0e64d607ad9709c4b7b86b', userName: 'Domino_Org_2092' }
  ],
  isUsersForEnvironmentEmpty: false,
  viewerId: '5cd9b1647f1a5d000632e06a',
  viewerUserName: 'integration-test',
  isDefaultEnvironment: false,
  deploymentDefaultEnvironmentImage: 'quay.io/domino/base:Ubuntu16_DAD_Py3.6_R3.4-20180727',
  environments: {
    activeEnvironmentRevisions: [
      {
        clusterTypes: ['Spark' as ComputeClusterType],
        environmentRevisionId: '5da8afb8d51c660006379650',
        environmentId: '5cc93b2477094f0006811a59',
        environmentName: 'Domino Analytics Distribution Py3.6 R3.6',
        revisionNumber: 8
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d420f438d6b7300066da088',
        environmentId: '5cdae6f07a28bc00060ebf7f',
        environmentName: 'EMR',
        revisionNumber: 6
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d09cc2031c38b0006df86ff',
        environmentId: '5cdb5ecd11bbc900062d144b',
        environmentName: 'Domino Analytics Distribution Py3.6 R3.5',
        revisionNumber: 3
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5ce71e81fcf2950006db05d2',
        environmentId: '5ce71e81fcf2950006db05d0',
        environmentName: 'maksimDelete',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5ce7250efade230006c73755',
        environmentId: '5ce7250efade230006c73753',
        environmentName: 'maksimDeleteMe2',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5ceef6802801990006676440',
        environmentId: '5ceef680280199000667643e',
        environmentName: 'jupyter-server-proxy',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5cf059e583eb790006cc22de',
        environmentId: '5cf059bd563ecd000699c5d0',
        environmentName: 'TEMP - Duplicate of Domino Analytics Distribution Py3.6 R3.4',
        revisionNumber: 2
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d09ced478cc28000698e2e6',
        environmentId: '5d09c7d878cc280007a6396e',
        environmentName: 'movie_genre',
        revisionNumber: 5
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d0b114f738bd00006ea300e',
        environmentId: '5d0b114f738bd00006ea300d',
        environmentName: 'Duplicate of Domino Analytics Distribution Py3.6 R3.4',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d13d87e66a0d100068636fd',
        environmentId: '5d13d848f47d950006424551',
        environmentName: 'linux-interview',
        revisionNumber: 2
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d13e2773bbf950006fe09c5',
        environmentId: '5d13e262f47d9500064248e2',
        environmentName: 'Wen Domino Analytics Distribution Py3.6 R3.4',
        revisionNumber: 2
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d143f94bfc14f00064a3f5f',
        environmentId: '5d141ebb3dcbf500061fc8f4',
        environmentName: 'steved test',
        revisionNumber: 3
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d154af57872e90006d9da7f',
        environmentId: '5d154af57872e90006d9da7e',
        environmentName: 'Duplicate of Duplicate of Domino Analytics Distribution Py3.6 R3.4',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d1ceff22592330006a57fbb',
        environmentId: '5d1ceff22592330006a57fba',
        environmentName: 'Andrewz-testing',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d2f336a4b2b6100063b2411',
        environmentId: '5d1d07eb68c19800067dacd2',
        environmentName: 'Duplicate of Domino Analytics Distribution Py3.6 R3.4',
        revisionNumber: 2
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d259edc80e1ef0006d51a4c',
        environmentId: '5d25978007dd2b000675da56',
        environmentName: 'system-test',
        revisionNumber: 2
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d2907d67d16df0007338000',
        environmentId: '5d2907d67d16df0007337ffe',
        environmentName: 'system-tests-D66D62-test_environments_v4_api',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d2e236dfb3fec00062fde15',
        environmentId: '5d2e23427c48bf00063abfd3',
        environmentName: 'Non-pluggable Domino Analytics Distribution Py3.6 R3.4',
        revisionNumber: 2
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d2e6afbc8ae9700063812f9',
        environmentId: '5d2e6afbc8ae9700063812f7',
        environmentName: 'test',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d358763f06c5100065b7d3d',
        environmentId: '5d358763f06c5100065b7d3b',
        environmentName: 'cv',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d3642685dc3c000067458e0',
        environmentId: '5d361db8423c3b0006ced0b8',
        environmentName: 'Timeout test',
        revisionNumber: 2
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d362b1f63d90f0006ebfa38',
        environmentId: '5d362a8a6d34000006b34652',
        environmentName: 'Duplicate of Domino Analytics Distribution Py3.6 R3.4',
        revisionNumber: 3
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d36542b5fc253000655659f',
        environmentId: '5d3653f96b14f2000636cc7a',
        environmentName: 'fernando-DOM-14356',
        revisionNumber: 2
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d365bdf6b14f2000636ccca',
        environmentId: '5d365bbf6b14f2000636ccc4',
        environmentName: 'robin test',
        revisionNumber: 2
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d397fc8e986c300062b01aa',
        environmentId: '5d36db7347bfef0006011cfb',
        environmentName: 'Mohith',
        revisionNumber: 4
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d37d4691bd8c9000698ec1a',
        environmentId: '5d37d4691bd8c9000698ec18',
        environmentName: 'temp',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d39880a2b0d040006f4bde5',
        environmentId: '5d3987e4e986c300062b01c4',
        environmentName: 'final-test',
        revisionNumber: 2
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d3ad1cb05ef5c00061380dc',
        environmentId: '5d3ad1cb05ef5c00061380da',
        environmentName: 'My Environment',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d89261af0af06000649b97a',
        environmentId: '5d3b4381b6441f000605df1d',
        environmentName: "Austin's Checking Things",
        revisionNumber: 4
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d3f5a29d5544800068a6aae',
        environmentId: '5d3f59e2d5544800068a6aa6',
        environmentName: 'DAD-no-wildcard',
        revisionNumber: 2
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d4b3711c6aff00006e77e04',
        environmentId: '5d4b3711c6aff00006e77e03',
        environmentName: 'Duplicate of Domino Analytics Distribution Py3.6 R3.4',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d4c614bb4a3cd00068dc9c9',
        environmentId: '5d4c614bb4a3cd00068dc9c8',
        environmentName: 'Duplicate of Domino Analytics Distribution Py3.6 R3.4',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d4cf4d25853c800062e570f',
        environmentId: '5d4cf4d25853c800062e570e',
        environmentName: 'Duplicate of cv',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d6f61547a630600067ff928',
        environmentId: '5d4cf7f4ddfff40007c714c7',
        environmentName: 'test-1',
        revisionNumber: 2
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d4da4e965395c0006ca2d31',
        environmentId: '5d4da4e965395c0006ca2d2f',
        environmentName: 'New Test',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d4da6f8e1fe2b0006351177',
        environmentId: '5d4da6e1e1fe2b0006351172',
        environmentName: 'test1',
        revisionNumber: 2
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d4e13e4e373ef00064c1dc4',
        environmentId: '5d4e1399e373ef00064c1dbf',
        environmentName: 'Ubuntu18_DAD_Py3.6_R3.6_20190809-quay',
        revisionNumber: 2
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d51a1024ea66600068e0225',
        environmentId: '5d51a1024ea66600068e0224',
        environmentName: 'Duplicate of Domino Analytics Distribution Py3.6 R3.4',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d51a10f4ea66600068e0227',
        environmentId: '5d51a10f4ea66600068e0226',
        environmentName: 'Duplicate of Domino Analytics Distribution Py3.6 R3.4',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d51a1324ea66600068e022b',
        environmentId: '5d51a1248269be00062ef2e7',
        environmentName: 'Ubuntu18_DAD_Py2.7_R3.6_20190809-quay',
        revisionNumber: 2
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d51a12c4ea66600068e022a',
        environmentId: '5d51a12c4ea66600068e0229',
        environmentName: 'Duplicate of Domino Analytics Distribution Py3.6 R3.4',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d51a1544ea66600068e022f',
        environmentId: '5d51a1544ea66600068e022e',
        environmentName: 'Duplicate of Domino Analytics Distribution Py3.6 R3.4',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d51a1734ea66600068e0231',
        environmentId: '5d51a1734ea66600068e0230',
        environmentName: 'Duplicate of Domino Analytics Distribution Py3.6 R3.4',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d51a17c8269be00062ef2ee',
        environmentId: '5d51a17c8269be00062ef2ed',
        environmentName: 'Duplicate of Domino Analytics Distribution Py3.6 R3.5',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d51a22e4ea66600068e023a',
        environmentId: '5d51a1f44ea66600068e0235',
        environmentName: 'App-timeout-issue_trial',
        revisionNumber: 2
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d681777e8c6b00007b6ed3b',
        environmentId: '5d54e6f24d0f72000685e36c',
        environmentName: 'steved of Domino Analytics Distribution Py3.6 R3.4',
        revisionNumber: 9
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d5a38b1c2db830006caa94b',
        environmentId: '5d5a38b1c2db830006caa949',
        environmentName: 'n',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d5c6a290da8d20006e1a5cf',
        environmentId: '5d5c69ac2cf74500067ab61c',
        environmentName: 'Duplicate of Domino Analytics Distribution Py3.6 R3.4',
        revisionNumber: 2
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d5cdb8c3355ad0006955d14',
        environmentId: '5d5cdb8c3355ad0006955d12',
        environmentName: "Demo's Test",
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d6626627d7437000610ca7a',
        environmentId: '5d6626627d7437000610ca78',
        environmentName: 'test-env',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d6678123c6be700069508f6',
        environmentId: '5d6678123c6be700069508f4',
        environmentName: 'hey',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d6889f8992c5d00060b2021',
        environmentId: '5d68875f992c5d00060b2008',
        environmentName: 'ttyd',
        revisionNumber: 4
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d695ff2684fed00061c92b2',
        environmentId: '5d695fc0d09bb70006a02678',
        environmentName: "Duplicate of Austin's Checking Things",
        revisionNumber: 2
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d6ed486c8517800069240be',
        environmentId: '5d6ea30450a7d300060bcc85',
        environmentName: 'Ubuntu18_DAD_Py3.6_R3.6-20190831',
        revisionNumber: 8
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d6ec350fcf6870006bb3821',
        environmentId: '5d6ec339d67422000673eaad',
        environmentName: 'Georgi Test',
        revisionNumber: 2
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d7989d227e57a0006290291',
        environmentId: '5d6ef911175e2b000624c2e3',
        environmentName: 'ubuntu18-sujay-new-base-20190903',
        revisionNumber: 9
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d6f629cf050bc0006b08d0c',
        environmentId: '5d6f629cf050bc0006b08d0b',
        environmentName: 'Duplicate of test-1',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d6f62deb266da0006b0708e',
        environmentId: '5d6f62b1f050bc0006b08d0d',
        environmentName: 'Vivek-Duplicate of test-1',
        revisionNumber: 2
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d6f89c695a37b00062d7d76',
        environmentId: '5d6f89c695a37b00062d7d74',
        environmentName: 'ok',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d6f8ad095a37b00062d7d7b',
        environmentId: '5d6f8ad095a37b00062d7d79',
        environmentName: 'jk',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d6fe4d495a37b00062d7dba',
        environmentId: '5d6fe4d495a37b00062d7db9',
        environmentName: 'Duplicate of Vivek-Duplicate of test-1',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d6fe4ea4937850006688c3b',
        environmentId: '5d6fe4ea4937850006688c3a',
        environmentName: 'Duplicate of Vivek-Duplicate of test-1',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d6fe51d4937850006688c3d',
        environmentId: '5d6fe51d4937850006688c3c',
        environmentName: 'Duplicate of Vivek-Duplicate of test-1',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d6fe51d95a37b00062d7dbc',
        environmentId: '5d6fe51d95a37b00062d7dbb',
        environmentName: 'Duplicate of Vivek-Duplicate of test-1',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d6fe5e34937850006688c40',
        environmentId: '5d6fe5e34937850006688c3f',
        environmentName: 'Duplicate of Vivek-Duplicate of test-1',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d70b602d04378000695767b',
        environmentId: '5d70b602d04378000695767a',
        environmentName: 'Duplicate of Domino Analytics Distribution Py3.6 R3.4',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d70ce89d638e10006162e5c',
        environmentId: '5d70ce89d638e10006162e5a',
        environmentName: 'Gowtham-TestENV',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d70ced5d043780006957697',
        environmentId: '5d70ced5d043780006957696',
        environmentName: 'Duplicate of Gowtham-TestENV',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d70d011d043780006957699',
        environmentId: '5d70d011d043780006957698',
        environmentName: 'Duplicate of Duplicate of Gowtham-TestENV',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d70d4e6d638e10006162e63',
        environmentId: '5d70d4e6d638e10006162e62',
        environmentName: 'Duplicate of Vivek-Duplicate of test-1',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d70d4fcd04378000695769b',
        environmentId: '5d70d4fcd04378000695769a',
        environmentName: 'Duplicate of Vivek-Duplicate of test-1',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d70d517d04378000695769d',
        environmentId: '5d70d517d04378000695769c',
        environmentName: 'Duplicate of Duplicate of Vivek-Duplicate of test-1',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d70d99cd638e10006162e76',
        environmentId: '5d70d535d638e10006162e64',
        environmentName: 'Duplicate of Duplicate of Vivek-Duplicate of test-1',
        revisionNumber: 2
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d70d643d638e10006162e67',
        environmentId: '5d70d643d638e10006162e66',
        environmentName: 'Duplicate of Gowtham-TestENV',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d70d659d638e10006162e69',
        environmentId: '5d70d659d638e10006162e68',
        environmentName: 'Duplicate of Duplicate of Gowtham-TestENV',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d70d664d04378000695769f',
        environmentId: '5d70d664d04378000695769e',
        environmentName: 'Duplicate of Duplicate of Duplicate of Gowtham-TestENV',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d70d66cd638e10006162e6b',
        environmentId: '5d70d66cd638e10006162e6a',
        environmentName: 'Duplicate of Duplicate of Duplicate of Duplicate of Gowtham-TestENV',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d70d672d0437800069576a1',
        environmentId: '5d70d672d0437800069576a0',
        environmentName: 'Duplicate of Duplicate of Duplicate of Duplicate of Gowtham-TestENV',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d70d680d638e10006162e6d',
        environmentId: '5d70d680d638e10006162e6c',
        environmentName: 'Duplicate of Duplicate of Duplicate of Duplicate of Gowtham-TestENV',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d70d75bd0437800069576a3',
        environmentId: '5d70d75bd0437800069576a2',
        environmentName: 'Duplicate of Duplicate of Duplicate of Duplicate of Duplicate of Gowtham-TestENV',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d70d75bd0437800069576a5',
        environmentId: '5d70d75bd0437800069576a4',
        environmentName: 'Duplicate of Duplicate of Duplicate of Duplicate of Duplicate of Gowtham-TestENV',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d70d76ad0437800069576a7',
        environmentId: '5d70d76ad0437800069576a6',
        environmentName:
          'Duplicate of Duplicate of Duplicate of Duplicate of Duplicate of Duplicate of Gowtham-TestENV',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d70d778d638e10006162e6f',
        environmentId: '5d70d778d638e10006162e6e',
        environmentName:
          'Duplicate of Duplicate of Duplicate of Duplicate of Duplicate of Duplicate of Gowtham-TestENV',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d70d778d0437800069576a9',
        environmentId: '5d70d778d0437800069576a8',
        environmentName:
          'Duplicate of Duplicate of Duplicate of Duplicate of Duplicate of Duplicate of Gowtham-TestENV',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d70d7c0d0437800069576ac',
        environmentId: '5d70d7c0d0437800069576aa',
        environmentName: 'RouteTest',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d70d7cfd0437800069576b0',
        environmentId: '5d70d7cfd0437800069576af',
        environmentName: 'Duplicate of RouteTest',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d70d7e9d0437800069576b2',
        environmentId: '5d70d7e9d0437800069576b1',
        environmentName: 'Duplicate of Duplicate of RouteTest',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d70d7e9d638e10006162e71',
        environmentId: '5d70d7e9d638e10006162e70',
        environmentName: 'Duplicate of Duplicate of RouteTest',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d70d86ad638e10006162e73',
        environmentId: '5d70d86ad638e10006162e72',
        environmentName: 'Duplicate of maksimDeleteMe2',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d70d891d0437800069576b5',
        environmentId: '5d70d891d0437800069576b4',
        environmentName: 'Duplicate of maksimDeleteMe2',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d70d891d638e10006162e75',
        environmentId: '5d70d891d638e10006162e74',
        environmentName: 'Duplicate of maksimDeleteMe2',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d71050cd638e10006162eae',
        environmentId: '5d71050cd638e10006162ead',
        environmentName: 'Duplicate of Domino Analytics Distribution Py3.6 R3.4',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d71baaa325903000674f5d4',
        environmentId: '5d71ba2c45a8c8000663b1ff',
        environmentName: 'Duplicate of cv',
        revisionNumber: 2
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d75ea9769fe160006951cc3',
        environmentId: '5d75ea9769fe160006951cc1',
        environmentName: 'narayananTF',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d79703befa8c400069367c3',
        environmentId: '5d796da3efa8c400069367c0',
        environmentName: 'Ubuntu18_DAD_Py3.6_R3.6_20190809-quay with packer.io',
        revisionNumber: 2
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d7f6569e470db0006f62e0a',
        environmentId: '5d7f596ce470db0006f62dfd',
        environmentName: 'spark-env',
        revisionNumber: 5
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d810e97f6744600062777ad',
        environmentId: '5d810e88f6744600062777a8',
        environmentName: 'Ubuntu18_Domino4_20190916',
        revisionNumber: 2
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d8159e0d8654d00069bb2b5',
        environmentId: '5d8159b92b76ee0006113a5c',
        environmentName: 'Standard DAD + post-run script',
        revisionNumber: 2
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d92a5593e56bd00063f6312',
        environmentId: '5d92a2bb6d3d2800062c2c7e',
        environmentName: 'Test other workspaces properties in 4.1',
        revisionNumber: 4
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d942fe59e8ea00006615e10',
        environmentId: '5d942fe59e8ea00006615e0f',
        environmentName: 'Duplicate of EMR',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d94ca7b9e8ea00006615e48',
        environmentId: '5d94ca7b9e8ea00006615e47',
        environmentName: 'Pluggable Domino Analytics Distribution Py3.6 R3.5',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5d9de9c063e4db0006b43d54',
        environmentId: '5d9de9c063e4db0006b43d52',
        environmentName: 'Test DOM-15874 httpProxy.port',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5dd837e0c7ce6b27c5f060cc',
        environmentId: '5da5fd5a6b112600061df203',
        environmentName: "Noah's Test Env",
        revisionNumber: 6
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5da5ff4b6b112600061df20d',
        environmentId: '5da5ff4b6b112600061df20b',
        environmentName: 'arosca-subdomains',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5da5ffbe6b112600061df211',
        environmentId: '5da5ffbe6b112600061df210',
        environmentName: 'arosca',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5da600fd3af98e000757c0e9',
        environmentId: '5da600fd3af98e000757c0e8',
        environmentName: 'Duplicate of Domino Analytics Distribution Py3.6 R3.4',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5da601223af98e000757c0ec',
        environmentId: '5da601223af98e000757c0ea',
        environmentName: 'Andrew Rosca',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5db73d393dd60d00063b154d',
        environmentId: '5db73d1f9ec0d50007304daa',
        environmentName: 'Andrew Z UAT for Po',
        revisionNumber: 2
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5db97a3d6323bc00067dbdbd',
        environmentId: '5db97a3d6323bc00067dbdbb',
        environmentName: 'd',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5db97a5c37dc54000882c601',
        environmentId: '5db97a5c37dc54000882c5ff',
        environmentName: 'm_test',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5dbff3c895bf950007b0f706',
        environmentId: '5dbff39295bf950007b0f701',
        environmentName: 'gpu-test',
        revisionNumber: 2
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5dc1cad82981d6000652deeb',
        environmentId: '5dc1cacaad38b000071032d6',
        environmentName: 'Bad Environment',
        revisionNumber: 2
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5dc1f5fff8ffed0006181894',
        environmentId: '5dc1f5ca7903280006df0d97',
        environmentName: 'post-run-sleep',
        revisionNumber: 2
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5dc211e8f8ffed000618195a',
        environmentId: '5dc211e8f8ffed0006181959',
        environmentName: 'Duplicate of Domino Analytics Distribution Py3.6 R3.6',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5dc40f4e93b1d50006eb4bca',
        environmentId: '5dc40f4e93b1d50006eb4bc9',
        environmentName: 'Duplicate of Domino Analytics Distribution Py3.6 R3.6',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5dc4e4196ede8200064ad3ac',
        environmentId: '5dc4e401ebf1790006944ccd',
        environmentName: 'DOM-17707 CE',
        revisionNumber: 2
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5dc96b2858a9d200078e7caf',
        environmentId: '5dc96b2858a9d200078e7cad',
        environmentName: 'newTenp',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5dcefe9cad06680007c30173',
        environmentId: '5dcefe58ad06680007c3016e',
        environmentName: 'Churn Model Environment',
        revisionNumber: 2
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5ddefef11cdc0c4ebd2b55a9',
        environmentId: '5ddefef11cdc0c4ebd2b55a8',
        environmentName: 'Test_Duplicate of Domino Analytics Distribution Py3.6 R3.5',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5ddeff7c1cdc0c4ebd2b55b3',
        environmentId: '5ddeff331cdc0c4ebd2b55ab',
        environmentName: 'akshay_ambekar_test',
        revisionNumber: 3
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5df16eb1c619661b8fd493d2',
        environmentId: '5df16e51c619661b8fd493ca',
        environmentName: 'Prerun script test',
        revisionNumber: 3
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5df198c70724ad154b26dafb',
        environmentId: '5df198c70724ad154b26daf9',
        environmentName: 'NIOLE',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5df4246a4c853772895bb2be',
        environmentId: '5df40c184c853772895bb29a',
        environmentName: 'Etan python dev env v2',
        revisionNumber: 3
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5df4165c4c853772895bb2a1',
        environmentId: '5df4165c4c853772895bb29f',
        environmentName: 'sdfsdf',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5df416814c853772895bb2a6',
        environmentId: '5df416814c853772895bb2a4',
        environmentName: 'ghjghj',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5df417f54c853772895bb2b0',
        environmentId: '5df417f54c853772895bb2ae',
        environmentName: 'testing somenehriwoer we',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5df422194c853772895bb2bb',
        environmentId: '5df422194c853772895bb2b9',
        environmentName: 'my new environment - py3.6',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5df946134016374f78fcb730',
        environmentId: '5df944dc4016374f78fcb728',
        environmentName: 'On-Demand Spark',
        revisionNumber: 3
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5e151f28c2bc78673255e36b',
        environmentId: '5e151f28c2bc78673255e369',
        environmentName: 'a1',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5e15213cc2bc78673255e370',
        environmentId: '5e15213cc2bc78673255e36e',
        environmentName: 'a2',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5e1521a9c2bc78673255e375',
        environmentId: '5e1521a9c2bc78673255e373',
        environmentName: 'a3',
        revisionNumber: 1
      },
      {
        clusterTypes: [],
        environmentRevisionId: '5e15946faba640458ea31222',
        environmentId: '5e157a444616126347cfa79c',
        environmentName: 'Georgi Spark Base',
        revisionNumber: 4
      }
    ],
    defaultEnv: {
      _id: '5cc93b2477094f0006811a59',
      name: 'Domino Analytics Distribution Py3.6 R3.6',
      description: 'quay.io/domino/base:Ubuntu16_DAD_Py3.6_R3.4-20180727',
      visibility: 'Global',
      isArchived: false
    },
    defaultEnvRev: {
      _id: '5da8afb8d51c660006379650',
      environmentId: '5cc93b2477094f0006811a59',
      metadata: {
        number: 8,
        authorId: '5cdcb511a3346500060ac99d',
        created: 1571336120436,
        buildId: { value: '5da8afb8d51c660006379652' },
        dockerImageName: { repository: 'domino-5cc93b2477094f0006811a59', tag: '8' }
      },
      definition: {
        dockerImage: 'quay.io/domino/base:Ubuntu18_DAD_Py3.6_R3.6_20190918',
        dockerArguments: [],
        workspacesProperties:
          'jupyter:\n  title: "Jupyter (Python, R, Julia)"\n  iconUrl: "/assets/images/workspace-logos/Jupyter.svg"\n  start: [ "/var/opt/workspaces/jupyter/start" ]\n  httpProxy:\n    port: 8888\n    rewrite: false\n    internalPath: "/{{ownerUsername}}/{{projectName}}/{{sessionPathComponent}}/{{runId}}/{{#if pathToOpen}}tree/{{pathToOpen}}{{/if}}"\n    requireSubdomain: false\n  supportedFileExtensions: [ ".ipynb" ]\njupyterlab:\n  title: "JupyterLab"\n  iconUrl: "/assets/images/workspace-logos/jupyterlab.svg"\n  start: [  /var/opt/workspaces/Jupyterlab/start.sh ]\n  httpProxy:\n    internalPath: "/{{ownerUsername}}/{{projectName}}/{{sessionPathComponent}}/{{runId}}/{{#if pathToOpen}}tree/{{pathToOpen}}{{/if}}"\n    port: 8888\n    rewrite: false\n    requireSubdomain: false\nvscode:\n title: "vscode"\n iconUrl: "/assets/images/workspace-logos/vscode.svg"\n start: [ "/var/opt/workspaces/vscode/start" ]\n httpProxy:\n    port: 8888\n    requireSubdomain: false\nrstudio:\n  title: "RStudio"\n  iconUrl: "/assets/images/workspace-logos/Rstudio.svg"\n  start: [ "/var/opt/workspaces/rstudio/start" ]\n  httpProxy:\n    port: 8888\n    requireSubdomain: false'
      }
    }
  },
  defaultEnvId: '5cc93b2477094f0006811a59',
  missingValueErrorMessages: [],
  imageType: 'Environment' as const,
  csrfFormToken: '5046e501c6d708c1b008ce07521f1be0a0453503-1579037378425-eeaed58ceb7536f40921746f',
  createAction: '/environments'
};
