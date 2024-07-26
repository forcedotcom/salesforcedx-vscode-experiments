/**
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 **/

import { ExperimentType, randomAssignment, setAssignmentService, getAssignmentService } from '../../src';
import { DefaultAssignmentService } from '../../src/internals/defaultAssignmentService';

describe('randomAssignment', () => {
  it('should return true if random number is less than distribution percent', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.25);
    const experiment = {
      id: '1',
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
      id: '1',
      name: 'Experiment1',
      type: ExperimentType.Transactional,
      distributionPercent: 50
    };

    const result = randomAssignment(experiment);

    expect(result).toBe(false);
  });
});

describe('setAssignmentService', () => {
  it('should set the assignment service', () => {
    const assignmentService = {
      isAssigned: jest.fn()
    };

    setAssignmentService(assignmentService);

    expect(getAssignmentService()).toBe(assignmentService);
  });

  it('should return the default assignment service if no service is provided', () => {
    setAssignmentService();

    expect(getAssignmentService()).toBeInstanceOf(DefaultAssignmentService);
  });
});
