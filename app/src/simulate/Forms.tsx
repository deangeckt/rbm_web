import { Button } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import './Forms.css';
import { Dispatch, SetStateAction } from 'react';
import FormInput from './FormInput';
import { IFormInput } from './Simulate';


export interface IFormsProps {
	setRunning: Dispatch<SetStateAction<boolean>>;
	inputs: IFormInput[];
	updateInput: (idx: number, val: number) => void;
}

function Forms(props: IFormsProps) {
	return (
		<div className="Forms">
			<div className="TopPanel">
				<Button variant="outlined" color="primary" onClick={() => props.setRunning(true)} startIcon={<PlayArrowIcon />}>Start</Button>
				<Button variant="outlined" color="primary" onClick={() => props.setRunning(false)} startIcon={<StopIcon />}>Stop</Button>
			</div>
			<div className="BottomPanel">
				{props.inputs.map((input, i) => (
					<FormInput key={i} input={input} updateInput={props.updateInput} idx={i}/>
        		))}
			</div>
		</div>
  );
}

export default Forms;
