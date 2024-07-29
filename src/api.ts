/**
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 **/

import * as vscode from 'vscode';

export enum ExperimentType {
  Transactional = 'transactional',
  Stateful = 'stateful'
}

export enum ExperimentStatus {
  Active = 'active',
  Expired = 'expired'
}

export interface Experiment {
  name: string;
  type: ExperimentType;
  distributionPercent: number;
  expirationDate?: string;
}

export interface ExperimentWithStatus extends Experiment {
  status: ExperimentStatus;
}

export interface IExperimentService {
  registerExperiments(context: vscode.ExtensionContext, experiments: Experiment[]): void;
  getExperiments(): ExperimentWithStatus[];
}
