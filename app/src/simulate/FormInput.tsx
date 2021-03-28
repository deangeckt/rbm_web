import { IFormInput } from './Simulate';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';

export interface IFormsInputProps {
	input: IFormInput;
	idx: number;
	updateInput: (idx: number, val: number) => void;
}

function FormInput(props: IFormsInputProps) {
	return (
        <>
			<Tooltip title={props.input.tooltip}>
				<TextField label={props.input.name} variant="filled" type="number" defaultValue={props.input.value}
					onChange={(e) => props.updateInput(props.idx, Number(e.target.value))} />
            </Tooltip>
		</>
  );
}

export default FormInput;
