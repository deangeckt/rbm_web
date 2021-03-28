import { Button } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import './Forms.css';
import { ISimulationState } from './Simulate';
import { Dispatch, SetStateAction } from 'react';
import TextField from '@material-ui/core/TextField';

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
				<TextField id="p1" label="Param1" variant="filled" type="number" defaultValue={props.simulationState.p1}
					onChange={(e) => props.setSimulationState({...props.simulationState, p1: Number(e.target.value)})} />
				<TextField id="p2" label="Param2" variant="filled" type="number" defaultValue={props.simulationState.p2}
					onChange={(e) => props.setSimulationState({...props.simulationState, p2: Number(e.target.value)})} />
			</div>
		</div>
  );
}

export default Forms;
