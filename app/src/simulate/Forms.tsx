import { Button } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import './Forms.css';
import { ISimulationState } from './Simulate';
import { Dispatch, SetStateAction } from 'react';
import FormInput from './FormInput';


export interface IFormsProps {
	setSimulationState: Dispatch<SetStateAction<ISimulationState>>;
	simulationState: ISimulationState;
}

function Forms(props: IFormsProps) {

	const toggleSimluation = (val: boolean) => {
		props.setSimulationState({ ...props.simulationState, running: val });
	}

	return (
		<div className="Forms">
			<div className="TopPanel">
				<Button variant="outlined" color="primary" onClick={() => toggleSimluation(true)} startIcon={<PlayArrowIcon />}>Start</Button>
				<Button variant="outlined" color="primary" onClick={() => toggleSimluation(false)} startIcon={<StopIcon />}>Stop</Button>
			</div>
			<div className="BottomPanel">
				<FormInput {...props.simulationState.inputs[0]}/>
				<FormInput {...props.simulationState.inputs[1]}/>
			</div>
		</div>
  );
}

export default Forms;
