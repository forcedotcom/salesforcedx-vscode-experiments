/**
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 **/

import * as vscode from 'vscode';
import { Experiment, ExperimentType } from '../api';
import { randomAssignment } from './assignment';

export type ExperimentState = {
  [key: string]: boolean;
};

export const EXPERIMENT_STATE_KEY = 'vscode.salesforcedx.ab.experiments';

export class ExperimentStateManager {
  private context: vscode.ExtensionContext;
  private stateCache: ExperimentState;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.stateCache = {};
  }

  async assignExperiments(experiments: Experiment[]): Promise<void> {
    this.stateCache = this.context.globalState.get<ExperimentState>(EXPERIMENT_STATE_KEY) || {};

    // assign all unassigned stateful experiments
    experiments
      .filter((experiment) => experiment.type === ExperimentType.Stateful)
      .forEach((experiment) => {
        if (this.stateCache[experiment.name] === undefined) {
          this.stateCache[experiment.name] = randomAssignment(experiment);
        }
        if (this.isExpired(experiment.expirationDate)) {
          this.stateCache[experiment.name] = false;
        }
      });

    await this.context.globalState.update(EXPERIMENT_STATE_KEY, this.stateCache);
  }

  getExperimentState(experiment: Experiment): boolean {
    if (this.isExpired(experiment.expirationDate)) {
      return false;
    }
    // check if the experiment has been assigned
    if (this.stateCache[experiment.name] !== undefined) {
      return this.stateCache[experiment.name];
    }
    return randomAssignment(experiment);
  }

  private isExpired(expirationDate?: string): boolean {
    if (!expirationDate) {
      return false;
    }
    const date = new Date(expirationDate);
    return date < new Date();
  }
}
