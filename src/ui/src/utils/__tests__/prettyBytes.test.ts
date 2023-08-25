/**
 * @jest-environment node
 */
import { StorageUnitBytes } from '../../proxied-api/types';
import { normalizeBytes } from '../prettyBytes';

describe('normalizeBytes', () => {
  const cases = [
    {
      desc: 'Bytes',
      factor: 1,
      cases: [
      { expected: { value: '1', unit: StorageUnitBytes.B }, testValue: 1 },
      { expected: { value: '10', unit: StorageUnitBytes.B }, testValue: 10 },
      { expected: { value: '100', unit: StorageUnitBytes.B }, testValue: 100 },
      ]
    },
    {
      desc: 'Kilobytes',
      factor: Math.pow(10,3),
      cases: [
        { expected: { value: '1', unit: StorageUnitBytes.KB }, testValue: 1 },
        { expected: { value: '10', unit: StorageUnitBytes.KB }, testValue: 10 },
        { expected: { value: '100', unit: StorageUnitBytes.KB }, testValue: 100 },
      ]
    },
    {
      desc: 'Megabytes',
      factor: Math.pow(10,6),
      cases: [
        { expected: { value: '1', unit: StorageUnitBytes.MB }, testValue: 1 },
        { expected: { value: '10', unit: StorageUnitBytes.MB }, testValue: 10 },
        { expected: { value: '100', unit: StorageUnitBytes.MB }, testValue: 100 },
      ]
    },
    {
      desc: 'Gigabytes',
      factor: Math.pow(10,9),
      cases: [
        { expected: { value: '1', unit: StorageUnitBytes.GB }, testValue: 1 },
        { expected: { value: '10', unit: StorageUnitBytes.GB }, testValue: 10 },
        { expected: { value: '100', unit: StorageUnitBytes.GB }, testValue: 100 },
      ]
    },
    {
      desc: 'Terabytes',
      factor: Math.pow(10,12),
      cases: [
        { expected: { value: '1', unit: StorageUnitBytes.TB }, testValue: 1 },
        { expected: { value: '10', unit: StorageUnitBytes.TB }, testValue: 10 },
        { expected: { value: '100', unit: StorageUnitBytes.TB }, testValue: 100 },
      ]
    },
    {
      desc: 'Petabytes',
      factor: Math.pow(10,15),
      cases: [
        { expected: { value: '1', unit: StorageUnitBytes.PB }, testValue: 1 },
        { expected: { value: '10', unit: StorageUnitBytes.PB }, testValue: 10 },
        { expected: { value: '100', unit: StorageUnitBytes.PB }, testValue: 100 },
      ]
    },
    {
      desc: 'Exabytes',
      factor: Math.pow(10,18),
      cases: [
        { expected: { value: '1', unit: StorageUnitBytes.EB }, testValue: 1 },
        { expected: { value: '10', unit: StorageUnitBytes.EB }, testValue: 10 },
        { expected: { value: '100', unit: StorageUnitBytes.EB }, testValue: 100 },
      ]
    },
    {
      desc: 'Zetabytes',
      factor: Math.pow(10,21),
      cases: [
        { expected: { value: '1', unit: StorageUnitBytes.ZB }, testValue: 1 },
        { expected: { value: '10', unit: StorageUnitBytes.ZB }, testValue: 10 },
        { expected: { value: '100', unit: StorageUnitBytes.ZB }, testValue: 100 },
      ]
    },
    {
      desc: 'Yotabytes',
      factor: Math.pow(10,24),
      cases: [
        { expected: { value: '1', unit: StorageUnitBytes.YB }, testValue: 1 },
        { expected: { value: '10', unit: StorageUnitBytes.YB }, testValue: 10 },
        { expected: { value: '100', unit: StorageUnitBytes.YB }, testValue: 100 },
      ]
    },
  ]

  describe('Positive values', () => {
    cases.forEach((group) => {
      describe(group.desc, () => {
        it('Should normalize properly', () => {
          group.cases.forEach(({ testValue, expected }) => {
            const result = normalizeBytes(testValue * group.factor);
            expect(result).toEqual(expected);
          });
        })
      });
    });
  });
  
  describe('Negative values', () => {
    cases.forEach((group) => {
      describe(group.desc, () => {
        it('Should normalize properly', () => {
          group.cases.forEach(({ testValue, expected }) => {
            const result = normalizeBytes(testValue * group.factor * -1);
            expect(result).toEqual({
              ...expected,
              value: `-${expected.value}`
            });
          });
        })
      });
    });
  });
});
