/**
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 **/

import { ExperimentStatus, ExperimentType } from '../../../src';
import { getExperimentStatus, isExpired, randomAssignment } from '../../../src/internals/utils';

describe('utils', () => {
  describe('randomAssignment', () => {
    it('should return true if random number is less than distribution percent', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.25);
      const experiment = {
        name: 'Experiment1',
        type: ExperimentType.Transactional,
        distributionPercent: 50
      };

      const result = randomAssignment(experiment);

      expect(result).toBe(true);
    });

    it('should return false if random number is greater than distribution percent', () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.75);
      const experiment = {
        name: 'Experiment1',
        type: ExperimentType.Transactional,
        distributionPercent: 50
      };

      const result = randomAssignment(experiment);

      expect(result).toBe(false);
    });
  });

  describe('isExpired', () => {
    it('should return false if expiration date is not provided', () => {
      const result = isExpired();

      expect(result).toBe(false);
    });

    it('should return true if expiration date is in the past', () => {
      const result = isExpired('2021-01-01');

      expect(result).toBe(true);
    });

    it('should return false if expiration date is in the future', () => {
      const result = isExpired('2099-01-01');

      expect(result).toBe(false);
    });
  });

  describe('getExperimentStatus', () => {
    it('should return active if experiment is not expired', () => {
      const experiment = {
        name: 'Experiment1',
        type: ExperimentType.Transactional,
        distributionPercent: 50,
        expirationDate: '2099-01-01'
      };

      const result = getExperimentStatus(experiment);

      expect(result).toBe(ExperimentStatus.Active);
    });

    it('should return expired if experiment is expired', () => {
      const experiment = {
        name: 'Experiment1',
        type: ExperimentType.Transactional,
        distributionPercent: 50,
        expirationDate: '2021-01-01'
      };

      const result = getExperimentStatus(experiment);

      expect(result).toBe(ExperimentStatus.Expired);
    });
  });
});
