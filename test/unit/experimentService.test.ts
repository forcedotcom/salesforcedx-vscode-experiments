/**
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 **/

import * as vscode from 'vscode';
import {
  ExperimentStatus,
  ExperimentType,
  getExperimentService,
  IExperimentService,
  REGISTER_FIRST_ERROR
} from '../../src';
import { ExperimentStateManager } from '../../src/internals/experimentState';

jest.mock('../../src/internals/experimentState');
const mockedExperimentState = jest.mocked(ExperimentStateManager);
describe('ExperimentService', () => {
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
  const fakeExperiments = [
    { ...experiments[0], state: true, status: ExperimentStatus.Active },
    { ...experiments[1], state: false, status: ExperimentStatus.Expired }
  ];
  const fakeExperimentState = {
    Experiment1: true,
    Experiment2: false
  };

  let getExperimentsSpy: jest.SpyInstance;
  let getExperimentStateSpy: jest.SpyInstance;
  let getExperimentsStateSpy: jest.SpyInstance;

  let experimentServiceInst: IExperimentService;
  beforeEach(() => {
    experimentServiceInst = getExperimentService();
    experimentServiceInst.registerExperiments({} as vscode.ExtensionContext, experiments);

    getExperimentsSpy = mockedExperimentState.prototype.getExperiments.mockReturnValue(fakeExperiments);
    getExperimentStateSpy = mockedExperimentState.prototype.getExperimentState;
    getExperimentsStateSpy = mockedExperimentState.prototype.getExperimentsState.mockReturnValue(fakeExperimentState);
  });

  it('should register and return experiments', () => {
    const result = experimentServiceInst.getExperiments();

    expect(result).toEqual(fakeExperiments);
    expect(getExperimentsSpy).toHaveBeenCalledTimes(1);
  });

  it('Should throw if attempt to get experiments with registering.', () => {
    (experimentServiceInst as any).stateManager = undefined;
    expect(() => {
      experimentServiceInst.getExperiments();
    }).toThrow(REGISTER_FIRST_ERROR);

    expect(getExperimentsSpy).not.toHaveBeenCalled();
  });

  it('Should be able to get a single experiment state.', () => {
    const expected = true;
    getExperimentStateSpy.mockReturnValueOnce(expected);
    const result = experimentServiceInst.getExperimentState(experiments[0]);

    expect(result).toEqual(expected);
  });

  it('Should throw if unregistered for getExperimentState.', () => {
    (experimentServiceInst as any).stateManager = undefined;
    expect(() => {
      experimentServiceInst.getExperimentState(experiments[0]);
    }).toThrow(REGISTER_FIRST_ERROR);

    expect(getExperimentStateSpy).not.toHaveBeenCalled();
  });

  it('Should be able to get state for all experiments.', () => {
    const allState = experimentServiceInst.getExperimentsState();

    expect(allState).toEqual(fakeExperimentState);
    expect(getExperimentsStateSpy).toHaveBeenCalledTimes(1);
  });

  it('Should throw if experiments have not been registered.', () => {
    (experimentServiceInst as any).stateManager = undefined;
    expect(() => {
      experimentServiceInst.getExperimentsState();
    }).toThrow(REGISTER_FIRST_ERROR);

    expect(getExperimentsStateSpy).not.toHaveBeenCalled();
  });
});
