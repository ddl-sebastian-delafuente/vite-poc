import {
  getTotalExperiments,
  getTotalParameters,
} from '../mixpanel';

describe('mixpanel utilities', () => {
  const unparameterizedForm =
    JSON.parse('{"parameterKeys":[],"experimentName":"experiment name","command":"main.py"}');

  const formWith1Param =
    JSON.parse('{"parameterKeys":[],"experimentName":"experiment name","command":"main.py 12"}');

  const with1ParameterizedArg =
    JSON.parse(`
    {"parameterKeys":["parameter1"],
    "experimentName":"Test Test",
    "command":"main.py \${parameter1}",
    "parameter1":"1,2,3"}
    `);
  const with2ParameterizedArg =
    JSON.parse(`
    {"parameterKeys":["parameter1", "parameter2"],
    "experimentName":"Test Test",
    "command":"main.py \${parameter1} \${parameter2}",
    "parameter1":"1,2,3",
    "parameter2":"1,2,3"}
    `);
  const with3ParameterizedArg =
    JSON.parse(`
    {"parameterKeys":["parameter1", "parameter2", "parameter3"],
    "experimentName":"Test Test",
    "command":"main.py \${parameter1} \${parameter2} \${parameter3}",
    "parameter1":"1,2,3",
    "parameter2":"1,2,3",
    "parameter3":"1,2"}
    `);

  describe('getTotalExperiments', () => {
    it('should get total experiments for unparameterized form submission', () => {
      const result = getTotalExperiments(unparameterizedForm);
      expect(result).toBe(1);
    });

    it('should get total experiments for single parameter form submission', () => {
      const result = getTotalExperiments(formWith1Param);
      expect(result).toBe(1);
    });

    it('should get total experiments for single parameterized arg form submission', () => {
      const result = getTotalExperiments(with1ParameterizedArg);
      expect(result).toBe(3);
    });

    it('should get total experiments for two parameterized args in form submission', () => {
      const result = getTotalExperiments(with2ParameterizedArg);
      expect(result).toBe(9);
    });

    it('should get total experiments for three parameterized args in form submission', () => {
      const result = getTotalExperiments(with3ParameterizedArg);
      expect(result).toBe(18);
    });
  });

  describe('getTotalParameters', () => {
    it('should get 0 parameters for experiment with no parameters', () => {
      const result = getTotalParameters(unparameterizedForm);
      expect(result).toBe(0);
    });

    it('should get 1 parameters for experiment with one parameter', () => {
      const result = getTotalParameters(with1ParameterizedArg);
      expect(result).toBe(1);
    });
  });
});
