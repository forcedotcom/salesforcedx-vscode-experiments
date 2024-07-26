/**
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 **/

import * as vscode from 'vscode';
import { Experiment, ExperimentType, IAssignmentService, randomAssignment } from '..';

export class DefaultAssignmentService implements IAssignmentService {
  private alphaNumChars = 'abcdefghijklmnopqrstuvwxyz0123456789';

  public isAssigned(experiment: Experiment): boolean {
    if (experiment.type === ExperimentType.Stateful) {
      return this.isAssignedStateful(experiment);
    }
    return this.isAssignedTransactional(experiment);
  }

  private isAssignedTransactional(experiment: Experiment): boolean {
    return randomAssignment(experiment);
  }

  private isAssignedStateful(experiment: Experiment): boolean {
    const sessionId = vscode.env.sessionId;

    // remove all non-alphanumeric characters from user id and experiment id
    const cleanSessionId = sessionId.toLowerCase().replace(/[^a-z0-9]/gi, '');
    const cleanExperimentId = experiment.id.toLowerCase().replace(/[^a-z0-9]/gi, '');

    // get the target index
    const initialIndex = this.alphaNumChars.indexOf(cleanSessionId.charAt(cleanSessionId.length - 1));
    const offset = this.alphaNumChars.indexOf(cleanExperimentId.charAt(cleanExperimentId.length - 1));
    const targetIndex = (initialIndex + offset) % this.alphaNumChars.length;

    // get the distribution index
    const distributionIndex = Math.round(this.alphaNumChars.length * (experiment.distributionPercent / 100)) - 1;

    return targetIndex <= distributionIndex;
  }
}
