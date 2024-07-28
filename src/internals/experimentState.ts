/**
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 **/

import * as vscode from 'vscode';
import { Experiment, ExperimentType } from '../api';
import { randomAssignment } from '../assignment';

export type ExperimentState = {
  [key: string]: boolean;
};

export const EXPERIMENT_STATE_KEY = 'vscode.ab.experiments';

export class ExperimentStateManager {
  private context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  async assignExperiements(experiments: Experiment[]): Promise<void> {
    const state: ExperimentState = this.context.globalState.get<ExperimentState>(EXPERIMENT_STATE_KEY) || {};

    // assign all unassigned stateful experiments
    experiments
      .filter((experiment) => experiment.type === ExperimentType.Stateful)
      .forEach((experiment) => {
        if (state[experiment.name] === undefined) {
          state[experiment.name] = randomAssignment(experiment);
        }
      });

    await this.context.globalState.update(EXPERIMENT_STATE_KEY, state);
  }

  getExperimentState(experiment: Experiment): boolean {
    // check if the experiment has been assigned
    const state: ExperimentState = this.context.globalState.get<ExperimentState>(EXPERIMENT_STATE_KEY) || {};
    if (state[experiment.name] !== undefined) {
      return state[experiment.name];
    }

    return randomAssignment(experiment);
  }
}
