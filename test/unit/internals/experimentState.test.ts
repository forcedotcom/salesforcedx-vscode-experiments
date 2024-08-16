/**
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 **/

import * as vscode from 'vscode';
import * as Utils from '../../../src/internals/utils';
import { Experiment, ExperimentStatus, ExperimentType } from '../../../src';
import { EXPERIMENT_STATE_KEY, ExperimentStateManager } from '../../../src/internals/experimentState';

const context = {
  globalState: {
    get: jest.fn(),
    update: jest.fn()
  }
};

describe('ExperimentStateManager', () => {
  it('should assign stateful and not transactional experiments', async () => {
    context.globalState.get.mockReturnValue(undefined);
    jest.spyOn(Utils, 'randomAssignment').mockReturnValue(true);

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
    await experimentStateManager.assignExperiments(experiments);

    expect(context.globalState.update).toHaveBeenCalledWith(EXPERIMENT_STATE_KEY, {
      Experiment1: true
    });
  });

  it('should not reassign experiments already assigned', async () => {
    context.globalState.get.mockReturnValue({
      Experiment1: true
    });
    jest.spyOn(Utils, 'randomAssignment');

    const experiments = [
      {
        name: 'Experiment1',
        type: ExperimentType.Stateful,
        distributionPercent: 50
      }
    ];
    const experimentStateManager = new ExperimentStateManager(context as any as vscode.ExtensionContext);
    await experimentStateManager.assignExperiments(experiments);

    expect(context.globalState.update).toHaveBeenCalledWith(EXPERIMENT_STATE_KEY, {
      Experiment1: true
    });
    expect(Utils.randomAssignment).not.toHaveBeenCalled();
  });

  it('should always assign expired experiments to false', async () => {
    context.globalState.get.mockReturnValue({});
    jest.spyOn(Utils, 'randomAssignment').mockReturnValue(true);

    const experiments = [
      {
        name: 'Experiment1',
        type: ExperimentType.Stateful,
        distributionPercent: 50,
        expirationDate: '2021-01-01'
      },
      {
        name: 'Experiment2',
        type: ExperimentType.Stateful,
        distributionPercent: 50,
        expirationDate: '2099-01-01'
      }
    ];
    const experimentStateManager = new ExperimentStateManager(context as any as vscode.ExtensionContext);
    await experimentStateManager.assignExperiments(experiments);

    expect(context.globalState.update).toHaveBeenCalledWith(EXPERIMENT_STATE_KEY, {
      Experiment1: false,
      Experiment2: true
    });
  });

  it('should process overrides when assigning experiments', async () => {
    context.globalState.get.mockReturnValue({});
    jest.spyOn(Utils, 'randomAssignment').mockReturnValue(true);
    jest.spyOn(vscode.workspace, 'getConfiguration').mockReturnValue({
      get: jest.fn().mockReturnValue(false)
    } as any);

    const experiments = [
      {
        name: 'Experiment1',
        type: ExperimentType.Stateful,
        distributionPercent: 50,
        overrideSetting: 'test.experiment1'
      }
    ];
    const experimentStateManager = new ExperimentStateManager(context as any as vscode.ExtensionContext);
    await experimentStateManager.assignExperiments(experiments);
    const result = experimentStateManager.getExperimentState(experiments[0]);

    expect(vscode.workspace.getConfiguration).toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it('should get stateful experiment state from memento', () => {
    const experiment = {
      name: 'Experiment1',
      type: ExperimentType.Stateful,
      distributionPercent: 50
    };
    const experimentStateManager = new ExperimentStateManager(context as any as vscode.ExtensionContext);
    (experimentStateManager as any).stateCache = { Experiment1: true };
    const result = experimentStateManager.getExperimentState(experiment);

    expect(result).toBe(true);
  });

  it('should get random transactional experiment state', () => {
    jest.spyOn(Utils, 'randomAssignment').mockReturnValue(true);

    const experiment = {
      name: 'Experiment1',
      type: ExperimentType.Transactional,
      distributionPercent: 50
    };
    const experimentStateManager = new ExperimentStateManager(context as any as vscode.ExtensionContext);
    const result = experimentStateManager.getExperimentState(experiment);

    expect(Utils.randomAssignment).toHaveBeenCalledWith(experiment);
    expect(result).toBe(true);
  });

  it('should always return false for expired experiments', () => {
    const experiment = {
      name: 'Experiment1',
      type: ExperimentType.Transactional,
      distributionPercent: 50,
      expirationDate: '2021-01-01'
    };
    const experimentStateManager = new ExperimentStateManager(context as any as vscode.ExtensionContext);
    const result = experimentStateManager.getExperimentState(experiment);

    expect(result).toBe(false);
  });

  it('Should default to empty object for state of all experiments.', () => {
    const experimentStateManager = new ExperimentStateManager(context as any as vscode.ExtensionContext);
    const result = experimentStateManager.getExperimentsState();

    expect(result).toEqual({});
  });

  it('Should be able to get the state of all experiments.', () => {
    const expected = {
      Experiment1: true,
      Experiment2: false
    };

    const experimentStateManager = new ExperimentStateManager(context as any as vscode.ExtensionContext);
    (experimentStateManager as any).stateCache = expected;
    const result = experimentStateManager.getExperimentsState();

    expect(result).toEqual(expected);
  });

  it('Should be able to get experiments.', () => {
    const fakeExperiments: Experiment[] = [
      {
        name: 'Experiment1',
        type: ExperimentType.Transactional,
        distributionPercent: 50,
        status: ExperimentStatus.Active,
        state: true
      }
    ];
    const experimentStateManager = new ExperimentStateManager(context as any as vscode.ExtensionContext);
    (experimentStateManager as any).experiments = fakeExperiments;
    const result = experimentStateManager.getExperiments();

    expect(result).toEqual(fakeExperiments);
  });

  it('Should default experiments to empty list.', () => {
    const experimentStateManager = new ExperimentStateManager(context as any as vscode.ExtensionContext);
    const result = experimentStateManager.getExperiments();

    expect(result).toEqual([]);
  });

  it('Should use override setting value if present.', () => {
    jest.spyOn(vscode.workspace, 'getConfiguration').mockReturnValue({
      get: jest.fn().mockReturnValue(true)
    } as any);

    const experiments = [
      {
        name: 'Experiment1',
        type: ExperimentType.Stateful,
        distributionPercent: 50,
        overrideSetting: 'test.experiment1',
        status: ExperimentStatus.Active,
        state: false
      }
    ];
    const experimentStateManager = new ExperimentStateManager(context as any as vscode.ExtensionContext);
    (experimentStateManager as any).experiments = experiments;
    (experimentStateManager as any).stateCache = { Experiment1: false };
    (experimentStateManager as any).processOverrides();
    const result = experimentStateManager.getExperimentState(experiments[0]);

    expect(vscode.workspace.getConfiguration).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('Should not override setting if experiment is expired.', () => {
    jest.spyOn(vscode.workspace, 'getConfiguration').mockReturnValue({
      get: jest.fn().mockReturnValue(true)
    } as any);

    const experiments = [
      {
        name: 'Experiment1',
        type: ExperimentType.Stateful,
        distributionPercent: 50,
        overrideSetting: 'test.experiment1',
        status: ExperimentStatus.Expired,
        state: false
      }
    ];
    const experimentStateManager = new ExperimentStateManager(context as any as vscode.ExtensionContext);
    (experimentStateManager as any).experiments = experiments;
    (experimentStateManager as any).stateCache = { Experiment1: false };
    (experimentStateManager as any).processOverrides();
    const result = experimentStateManager.getExperimentState(experiments[0]);

    expect(vscode.workspace.getConfiguration).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });
});
