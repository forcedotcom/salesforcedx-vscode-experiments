/**
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 **/

import * as vscode from 'vscode';
import { ExperimentType } from '../../../src';
import * as Assignment from '../../../src/assignmentService';
import { DefaultAssignmentService } from '../../../src/internals/defaultAssignmentService';

jest.mocked('../../../src/assignmentService');
jest.mocked(vscode);

describe('DefaultAssignmentService', () => {
  describe('isAssigned', () => {
    const assignmentService = new DefaultAssignmentService();

    it('should call isAssignedTransactional if experiment type is Transactional', () => {
      const transactionalSpy = jest.spyOn(assignmentService as any, 'isAssignedTransactional').mockReturnValue(true);
      const experiment = {
        id: '1',
        name: 'Experiment1',
        type: ExperimentType.Transactional,
        distributionPercent: 50
      };

      assignmentService.isAssigned(experiment);

      expect(transactionalSpy).toHaveBeenCalledWith(experiment);
    });

    it('should call isAssignedStateful if experiment type is Stateful', () => {
      const statefulSpy = jest.spyOn(assignmentService as any, 'isAssignedStateful').mockReturnValue(true);
      const experiment = {
        id: '1',
        name: 'Experiment1',
        type: ExperimentType.Stateful,
        distributionPercent: 50
      };

      assignmentService.isAssigned(experiment);

      expect(statefulSpy).toHaveBeenCalledWith(experiment);
    });
  });

  describe('isAssignedTransactional', () => {
    const assignmentService = new DefaultAssignmentService();

    it('should call randomAssignment and return the result', () => {
      const randomAssignmentSpy = jest.spyOn(Assignment, 'randomAssignment').mockReturnValue(true);
      const experiment = {
        id: '1',
        name: 'Experiment1',
        type: ExperimentType.Transactional,
        distributionPercent: 50
      };

      const result = (assignmentService as any).isAssignedTransactional(experiment);

      expect(randomAssignmentSpy).toHaveBeenCalledWith(experiment);
      expect(result).toBe(true);
    });
  });

  describe('isAssignedStateful', () => {
    const assignmentService = new DefaultAssignmentService();

    it('should return true if targetIndex is less than or equal to distributionIndex', () => {
      const experiment = {
        id: 'K',
        name: 'Experiment1',
        type: ExperimentType.Stateful,
        distributionPercent: 50
      };

      const result = (assignmentService as any).isAssignedStateful(experiment);

      expect(result).toBe(true);
    });

    it('should return false if targetIndex is greater than distributionIndex', () => {
      const experiment = {
        id: 'A',
        name: 'Experiment1',
        type: ExperimentType.Stateful,
        distributionPercent: 50
      };

      const result = (assignmentService as any).isAssignedStateful(experiment);

      expect(result).toBe(false);
    });
  });
});
