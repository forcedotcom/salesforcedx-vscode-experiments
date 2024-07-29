/**
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 **/

import { Experiment, ExperimentStatus } from '../api';

export function isExpired(expirationDate?: string): boolean {
  if (!expirationDate) {
    return false;
  }
  const date = new Date(expirationDate);
  return date < new Date();
}

export function getExperimentStatus(experiment: Experiment): ExperimentStatus {
  return isExpired(experiment.expirationDate) ? ExperimentStatus.Expired : ExperimentStatus.Active;
}

export function randomAssignment(experiment: Experiment): boolean {
  const rand = Math.random() * 100;
  return rand < experiment.distributionPercent;
}
