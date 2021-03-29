
import './Forms.css';
import FormInput from './FormInput';
import { IFormInput } from './Simulate';

export interface IFormsProps {
	inputs: IFormInput[];
	updateInput: (idx: number, val: number) => void;
}

function Forms(props: IFormsProps) {
	return (
		<>
			<div className="Forms">
				{props.inputs.map((input, i) => (
					<FormInput key={i} input={input} updateInput={props.updateInput} idx={i}/>
				))}
			</div>
		</>
  );
}

export default Forms;
