/**
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 **/

import * as vscode from 'vscode';
import * as Assignmnent from '../../../src/assignment';
import { ExperimentType } from '../../../src';
import { EXPERIMENT_STATE_KEY, ExperimentStateManager } from '../../../src/internals/experimentState';

jest.mock('../../../src/assignment');

const context = {
  globalState: {
    get: jest.fn(),
    update: jest.fn()
  }
};

describe('ExperimentStateManager', () => {
  it('should assign stateful and not transactional experiments', async () => {
    context.globalState.get.mockReturnValue({});
    jest.spyOn(Assignmnent, 'randomAssignment').mockReturnValue(true);

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
    const experimentStateManager = new ExperimentStateManager(context as any as vscode.ExtensionContext);
    await experimentStateManager.assignExperiements(experiments);

    expect(context.globalState.update).toHaveBeenCalledWith(EXPERIMENT_STATE_KEY, {
      Experiment1: true
    });
  });

  it('should not reassign experiments already assigned', async () => {
    context.globalState.get.mockReturnValue({
      Experiment1: true
    });
    jest.spyOn(Assignmnent, 'randomAssignment');

    const experiments = [
      {
        name: 'Experiment1',
        type: ExperimentType.Stateful,
        distributionPercent: 50
      }
    ];
    const experimentStateManager = new ExperimentStateManager(context as any as vscode.ExtensionContext);
    await experimentStateManager.assignExperiements(experiments);

    expect(context.globalState.update).toHaveBeenCalledWith(EXPERIMENT_STATE_KEY, {
      Experiment1: true
    });
    expect(Assignmnent.randomAssignment).not.toHaveBeenCalled();
  });

  it('should get stateful experiment state from memento', () => {
    context.globalState.get.mockReturnValue({
      Experiment1: true
    });

    const experiment = {
      name: 'Experiment1',
      type: ExperimentType.Stateful,
      distributionPercent: 50
    };
    const experimentStateManager = new ExperimentStateManager(context as any as vscode.ExtensionContext);
    const result = experimentStateManager.getExperimentState(experiment);
    expect(result).toBe(true);
  });

  it('should get random transactional experiment state', () => {
    context.globalState.get.mockReturnValue({});
    jest.spyOn(Assignmnent, 'randomAssignment').mockReturnValue(true);

    const experiment = {
      name: 'Experiment1',
      type: ExperimentType.Transactional,
      distributionPercent: 50
    };
    const experimentStateManager = new ExperimentStateManager(context as any as vscode.ExtensionContext);
    const result = experimentStateManager.getExperimentState(experiment);

    expect(Assignmnent.randomAssignment).toHaveBeenCalledWith(experiment);
    expect(result).toBe(true);
  });
});
