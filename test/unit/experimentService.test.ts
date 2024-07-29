/**
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 **/

import * as vscode from 'vscode';
import { ExperimentType, getExperimentService } from '../../src';

describe('ExperimentService', () => {
  it('should register and return experiments', () => {
    const experiments = [
      {
        name: 'Experiment1',
        type: ExperimentType.Stateful,
        distributionPercent: 50
      },
      {
        name: 'Experiment2',
        type: ExperimentType.Transactional,
        distributionPercent: 50
      }
    ];
    const experimentService = getExperimentService();
    experimentService.registerExperiments({} as vscode.ExtensionContext, experiments);
    expect(experimentService.getExperiments()).toEqual(experiments);
  });
});
