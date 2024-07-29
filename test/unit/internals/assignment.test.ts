/**
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 **/

import { ExperimentType } from '../../../src';
import { randomAssignment } from '../../../src/internals/assignment';

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
