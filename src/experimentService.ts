/**
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 **/

import * as vscode from 'vscode';
import { ExperimentDefinition, Experiment, IExperimentService, ExperimentState } from './api';
import { ExperimentStateManager } from './internals/experimentState';

export const REGISTER_FIRST_ERROR = 'You must first register experiments';
class ExperimentService implements IExperimentService {
  // private experiments: ExperimentDefinition[] = [];

  private static instance: ExperimentService;

  public static getInstance(): ExperimentService {
    if (!ExperimentService.instance) {
      ExperimentService.instance = new ExperimentService();
    }

    return ExperimentService.instance;
  }

  stateManager: ExperimentStateManager | undefined;

  private constructor() {}

  async registerExperiments(context: vscode.ExtensionContext, experiments: ExperimentDefinition[]): Promise<void> {
    this.stateManager = new ExperimentStateManager(context);
    await this.stateManager.assignExperiments(experiments);
  }

  // Used to get the populated experiments after registration.
  getExperiments(): Experiment[] {
    if (!this.stateManager) {
      throw new Error(REGISTER_FIRST_ERROR);
    }
    return this.stateManager.getExperiments();
  }

  // Used to get the state of all experiments (just booleans by name).
  // Will be useful for updating telemetry calls.
  getExperimentsState(): ExperimentState {
    if (!this.stateManager) {
      throw new Error(REGISTER_FIRST_ERROR);
    }
    return this.stateManager.getExperimentsState();
  }

  // Get the current state of a single experiment.
  getExperimentState(experiment: ExperimentDefinition): boolean {
    if (!this.stateManager) {
      throw new Error(REGISTER_FIRST_ERROR);
    }
    const result = this.stateManager.getExperimentState(experiment);
    return result;
  }
}

export function getExperimentService(): IExperimentService {
  return ExperimentService.getInstance();
}
