/**
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 **/

import {ExtensionContext} from 'vscode';

export enum ExperimentType {
  Transactional = 'transactional',
  Stateful = 'stateful'
}

export enum ExperimentStatus {
  Active = 'active',
  Disabled = 'disabled',
  Expired = 'expired'
}

export interface ExperimentDefinition {
  name: string;
  type: ExperimentType;
  distributionPercent: number;
  expirationDate?: string;
}

export interface Experiment extends ExperimentDefinition {
  status: ExperimentStatus;
}

export interface IExperimentService {
  registerExperiments(context: ExtensionContext, experiments: ExperimentDefinition[]): Promise<void>;
  getExperiments(): Experiment[];
  getExperimentsState(): ExperimentState
  getExperimentState(experiment: ExperimentDefinition): boolean;
}

export type ExperimentState = {
  [key: string]: boolean;
};