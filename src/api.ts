/**
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 **/

import { ExtensionContext } from 'vscode';

export enum ExperimentType {
  Transactional = 'transactional',
  Stateful = 'stateful'
}

export enum ExperimentStatus {
  Active = 'active',
  Expired = 'expired'
}

/**
 * Definition of an experiment.
 * @param name - The unique name of the experiment.
 * @param type - The type of the experiment.
 * @param distributionPercent - The percentage of users that should be included in the experiment.
 * @param overrideSetting - The fully-qualified VSCode setting whose value overriddes the randomly assigned experiment value.
 * @param expirationDate - The date at which the experiment should be considered expired.
 */
export interface ExperimentDefinition {
  name: string;
  type: ExperimentType;
  distributionPercent: number;
  overrideSetting?: string;
  expirationDate?: string;
}

export interface Experiment extends ExperimentDefinition {
  status: ExperimentStatus;
  state: boolean;
}

export interface IExperimentService {
  registerExperiments(context: ExtensionContext, experiments: ExperimentDefinition[]): Promise<void>;
  getExperiments(): Experiment[];
  getExperimentsState(): ExperimentState;
  getExperimentState(experiment: ExperimentDefinition): boolean;
}

export type ExperimentState = {
  [key: string]: boolean;
};
