/**
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 **/

import * as vscode from 'vscode';
import { Experiment, ExperimentDefinition, ExperimentState, ExperimentStatus, ExperimentType } from '../api';
import { isExpired, randomAssignment } from './utils';

export const EXPERIMENT_STATE_KEY = 'vscode.salesforcedx.ab.experiments';

export class ExperimentStateManager {
  private context: vscode.ExtensionContext;
  private stateCache: ExperimentState;
  private experiments: Experiment[] = [];

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.stateCache = {};
  }

  async assignExperiments(experiments: ExperimentDefinition[]): Promise<void> {
    this.stateCache = this.context.globalState.get<ExperimentState>(EXPERIMENT_STATE_KEY) || {};

    // assign all unassigned stateful experiments
    const populatedExperiments: Experiment[] = experiments
      .filter((experiment) => experiment.type === ExperimentType.Stateful)
      .map((experiment) => {
        let status = ExperimentStatus.Active;
        let state = this.stateCache[experiment.name];
        if (this.stateCache[experiment.name] === undefined) {
          state = randomAssignment(experiment);
        }
        if (isExpired(experiment.expirationDate)) {
          status = ExperimentStatus.Expired;
          state = false;
        }
        this.stateCache[experiment.name] = state;
        return { ...experiment, status, state };
      });

    await this.context.globalState.update(EXPERIMENT_STATE_KEY, this.stateCache);
    this.experiments = populatedExperiments;
  }

  getExperimentState(experiment: ExperimentDefinition): boolean {
    // Necessary for transactional experiments
    if (isExpired(experiment.expirationDate)) {
      return false;
    }
    // check if the experiment has been assigned, should always be true for Stateful experiments
    if (this.stateCache[experiment.name] !== undefined) {
      return this.stateCache[experiment.name];
    }
    // assign transactional experiments
    return randomAssignment(experiment);
  }

  getExperimentsState(): typeof this.stateCache {
    return this.stateCache;
  }

  getExperiments(): typeof this.experiments {
    return this.experiments;
  }
}
