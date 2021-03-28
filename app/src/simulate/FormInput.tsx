import { IFormInput } from './Simulate';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';

function FormInput(props: IFormInput) {
	return (
        <>
			<Tooltip title={props.tooltip}>
				<TextField label={props.name} variant="filled" type="number" defaultValue={props.value}
					onChange={(e) => props.update(Number(e.target.value))} />
            </Tooltip>
		</>
  );
}

export default FormInput;
