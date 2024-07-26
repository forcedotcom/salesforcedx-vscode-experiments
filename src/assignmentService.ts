/**
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 **/

import { Experiment, IAssignmentService } from './api';
import { DefaultAssignmentService } from './internals/defaultAssignmentService';

// utility function for randomly assigning a user to an experiment
export function randomAssignment(experiment: Experiment): boolean {
  const rand = Math.random() * 100;
  return rand < experiment.distributionPercent;
}

let assignmentService: IAssignmentService | undefined;

export function getAssignmentService(): IAssignmentService {
  if (!assignmentService) {
    return new DefaultAssignmentService();
  }
  return assignmentService;
}

export function setAssignmentService(service?: IAssignmentService): void {
  assignmentService = service;
}
