# salesforcedx-vscode-experiments

Library for enabling A/B experiments in VSCode Extensions.

## Basic usage

### Define the experiments for your VSCode extension

```
import { ExperimentType } from '@salesforce/salesforcedx-vscode-experiments';
export const experimentDefinitions = [
    {
        name: 'multiTurnChat',
        type: ExperimentType.Stateful,
        distributionPercent: 50
    },
    {
        name: 'aiContextEngine',
        type: ExperimentType.Stateful,
        distributionPercent: 10
    }
];
```
### Experiment Properties
 - name: The unique name for the experiment
 - type: Stateful | Transactional (currently only stateful is supported)
 - distributionPercent: The percentage breakdown that you would like for the experiment.
 - expirationDate: String date for when the experiment should expire.

### Registration
In your VSCode extension you need to register your experiments.  

```  
    const experimentService = getExperimentService();
    await experimentService.registerExperiments(context, experiments);
```

### Usage
After registration you are able to get the current status for one or all experiments and can use that 
to enable code flows based on experiment status. 

```
    const assignedExperiments = experimentService.getExperiments();
    const experimentsState = experimentService.getExperimentsState();
    const isOn = experimentService.getExperimentState(experiments[0]);
```
