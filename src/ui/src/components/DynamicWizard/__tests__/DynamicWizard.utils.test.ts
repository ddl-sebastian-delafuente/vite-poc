import { transformWorkflowData } from '../DynamicWizard.utils';

describe('transformWorkflowData', () => {
  it('Should transform data', () => {
    const result = transformWorkflowData({
      bool1: true,
      bool2: false,
      boolAry: [true, false],
      emptyAry: [],
      num1: 1,
      num2: 2.2,
      numAry: [1, 2, 3],
      str: 'test',
      strAry: ['test1', 'test2', 'test3'],
    });

    expect(result).toEqual({
      bool1: 'true',
      bool2: 'false',
      boolAry: 'true,false',
      emptyAry: '',
      num1: '1',
      num2: '2.2',
      numAry: '1,2,3',
      str: 'test',
      strAry: 'test1,test2,test3',
    });
  });
});
