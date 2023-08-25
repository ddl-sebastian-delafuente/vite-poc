import * as R from 'ramda';
import {
  FieldData,
  FieldValue,
  FieldValueNormalized,
  Option, 
  transformFieldValue 
} from '../DynamicField';
import { 
  WorkflowData, 
  WorkflowStepMetadata,
} from './DynamicWizard.types';
import { 
  MetaRequestObject,
  RequestDataObject, 
} from './proxiedDynamicWizardApiCalls.types';
import { getWorkflowStepDescriptionMaker } from './workflowDescriptionMappers';

export const diffWorkflowDataDeps = (workflowDataA: WorkflowData = {}, workflowDataB: WorkflowData = {}, deps: string[] = []) => {
  const transformedA = transformWorkflowData(workflowDataA);
  const transformedB = transformWorkflowData(workflowDataB);
  const keyUnion = R.union(Object.keys(transformedA), Object.keys(transformedB));

  const filteredKeys = deps.length > 0 ? keyUnion.filter((keyName) => deps.indexOf(keyName) !== -1) : deps;

  return filteredKeys.reduce((memo, keyName) => {
    if (typeof transformedA[keyName] === 'undefined' || typeof transformedB[keyName] === 'undefined') {
      memo.push(keyName);
      return memo;
    }

    if (!R.equals(transformedA[keyName], transformedB[keyName])) {
      memo.push(keyName);
    }

    return memo;
  }, [] as string[]);
}

export const getWorkflowStepDescription = (stepMetadata: WorkflowStepMetadata, workflowData: WorkflowData, meta: MetaRequestObject) => {
  const { descriptionValues } = stepMetadata;

  if ( !Array.isArray(descriptionValues) || descriptionValues.length === 0 ) {
    return '';
  }

  const outputAry = descriptionValues.reduce((memo, key) => {
    const value = workflowData[key];

    const makeWorkflowDescription = getWorkflowStepDescriptionMaker(key);

    if (makeWorkflowDescription) {
      memo.push(makeWorkflowDescription(workflowData, meta))
      return memo;
    }

    if (value && isOption(value)) {
      memo.push((value as Option).label);
      return memo;
    }

    if ( value ) {
      memo.push(value as string);
    }

    return memo;
  }, [] as string[]);

  return outputAry.filter(Boolean).join(', ');
}

export const isOption = (value: FieldValue | WorkflowData) => {
  return !Array.isArray(value) && typeof value === 'object' && typeof value.label === 'string';
};

export const isAryObj = (value: FieldValueNormalized): boolean => {
  if (!Array.isArray(value) || value.length === 0) {
    return false;
  }

  const elem = value[0];
  const elemType = typeof elem;

  return elemType !== 'function' && elemType === 'object' && elemType !== null;
}

export const serializeArrayOfObjects = (value: FieldValueNormalized, prefix: string) => {
  if (Array.isArray(value) && value.length > 0) {
    const serialized = (value as []).reduce((memo, obj) => {
      return Object.keys(obj).reduce((innerMemo, objKeyName) => {
        const keyName = `${prefix}_${objKeyName}Ary`;
        if (!innerMemo[keyName]) {
          innerMemo[keyName] = [];
        }

        innerMemo[keyName].push(obj[objKeyName]);
        return innerMemo;
      }, memo);
    }, {});

    // join the arrays
    return Object.keys(serialized).reduce((memo, keyName) => {
      memo[keyName] = serialized[keyName].join(',');
      return memo;
    }, {});
  }

  return {};
}

export const serializeValue = (value: FieldValueNormalized): string | undefined => {
  if (Array.isArray(value)) {
    const ary = value.map(serializeValue);
    return ary.join(',');
  }

  switch (typeof value) {
    case 'boolean':
      return value === true ? 'true' : 'false';
    case 'number':
      return value.toString();
    default:
      return value;
  }
}

export const resetWorkflowData = ({
  elementList,
  resetDependencies = [],
  workflowData
}: {
  elementList: string[],
  resetDependencies?: string[],
  workflowData: WorkflowData
}): WorkflowData => {
  const keysToClear = elementList.filter((keyName) => {
    return resetDependencies.indexOf(keyName) === -1;
  });

  return Object.keys(workflowData).reduce((memo, keyName) => {
    if (keysToClear.indexOf(keyName) === -1) {
      memo[keyName] = workflowData[keyName];
    }

    return memo;
  }, {})
}

export const transformWorkflowData = (workflowData: WorkflowData): RequestDataObject => {
  return Object.keys(workflowData || {}).reduce((memo, key) => {
    const value = workflowData[key];

    const transformedFieldValue = transformFieldValue(value as FieldData);

    try {
      // Need to handle arrays differently due to limitations on the backend
      // if they array is a array of objects need to serialize to a set of parallel
      // arrays
      if (isAryObj(transformedFieldValue)) {
        const values = serializeArrayOfObjects(transformedFieldValue, key);
        return {
          ...memo,
          ...values,
        };
      }

      memo[key] = serializeValue(transformedFieldValue);
      // eslint-disable-next-line no-empty
    } catch (e) {}
    return memo;
  }, {});
};
