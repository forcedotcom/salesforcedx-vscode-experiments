/**
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 **/

import * as vscode from 'vscode';
import { Experiment, ExperimentWithStatus, IExperimentService } from './api';
import { getExperimentStatus } from './internals/utils';

class ExperimentService implements IExperimentService {
  private experiments: Experiment[] = [];

  private static instance: ExperimentService;

  public static getInstance(): ExperimentService {
    if (!ExperimentService.instance) {
      ExperimentService.instance = new ExperimentService();
    }

    return ExperimentService.instance;
  }

  private constructor() {}

  registerExperiments(context: vscode.ExtensionContext, experiments: Experiment[]): void {
    this.experiments = experiments;
  }

  getExperiments(): ExperimentWithStatus[] {
    return this.experiments.map((experiment) => {
      return {
        ...experiment,
        status: getExperimentStatus(experiment)
      };
    });
  }
}

export function getExperimentService(): IExperimentService {
  return ExperimentService.getInstance();
}
