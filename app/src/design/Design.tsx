import React from 'react';
import ControlPanel from './ControlPanel';
import { lengthToPoint, pointToLength } from '../Utils/SwcUtils';
import TopPanel from './TopPanel';
import DesignCanvas, { initialStage } from './DesignCanvas';
import './Design.css';

export interface ILine {
	id: number;
	tid: number;
	points: number[]; // [x1,y1, x2,y2]
	radius: number
	pid: number;
	length: number;
	alpha: number;
}

const default_radius = 0.1; // in micro
const default_tid = 0;
const default_length = 10; //in micro
export const default_neuron_rad = 5; // in micro
export const default_alpha = Math.PI * 0.1;

export const root_id = 1;
const none_selected = -1;

// TODO: add typing somehow - use ISwcFileRead interface
const Design = (props: any) => {
	const init_lines = props.history.location.state.lines ?? [];
	const init_neuron_rad = props.history.location.state.neuronRadius ?? default_neuron_rad;
	const [renderLines, setRenderLines] = React.useState(init_lines as ILine[]);
	const [neuronRad, setNeuronRad] = React.useState(init_neuron_rad as number);
	const [selectedId, setSelectedId] = React.useState(root_id);

	const checkDeselect = (e: any) => {
		const clickedOnEmpty = e.target === e.target.getStage();
		if (clickedOnEmpty) {
			setSelectedId(none_selected);
		}
	};

	const getChildren = (lid: number) => {
		const lines = [...renderLines];
		return lines.filter((line) => line.pid === lid);
	}

	const addNewPoints = (prevX: number, prevY: number, childs: ILine[]) => {
		const alphas = childs.map((c) => c.alpha);
		const max_alpha = alphas.length > 0 ? Math.max.apply(Math, alphas) : 0;
		const newAngle = max_alpha + default_alpha;
		const [newX, newY] = lengthAlphaToXy(lengthToPoint(default_length), newAngle, prevX, prevY);
		const newPoints = [prevX, prevY, newX, newY];
		return {newPoints, newAngle};
	}

	const addNew = () => {
		const lines = [...renderLines];
		const selectedLine = lines.find((line) => line.id === selectedId);
		let newId: number;
		let newPid: number;
		let newPoints: number[] = [];
		let newAlpha: number;

		if (!selectedLine) { //new line at root
			const rootChilds = getChildren(root_id);
			const r = addNewPoints(initialStage.rootX, initialStage.rootY, rootChilds);
			newPoints = r.newPoints;
			newAlpha = r.newAngle;
			newPid = root_id;
			newId = rootChilds.length === 0 ? root_id + 1 :lines[lines.length - 1].id + 1;
		} else {
			const prevX = selectedLine.points[2];
			const prevY = selectedLine.points[3];
			const r = addNewPoints(prevX, prevY, getChildren(selectedLine.id));
			newPoints = r.newPoints;
			newAlpha = r.newAngle;
			newId = lines[lines.length - 1].id + 1;
			newPid = selectedLine.id;
		}
		lines.push({id: newId, points: newPoints, pid: newPid, radius: default_radius, tid: default_tid, length: lengthToPoint(default_length), alpha: newAlpha});
		setRenderLines(lines);
		setSelectedId(newId);
	}

	const getSelectedRadius = () => {
		const lines = [...renderLines];
		const selectedLine = lines.find((line) => line.id === selectedId);
		return selectedLine ? selectedLine.radius : default_radius;
	}

	const getSelectedType = () => {
		const lines = [...renderLines];
		const selectedLine = lines.find((line) => line.id === selectedId);
		return selectedLine ? selectedLine.tid : default_tid;
	}

	const updateSimpleField = (field: "tid" | "radius", value: number) => {
		if (field === 'radius' && value <= 0)
			return;
		const lines = [...renderLines];
		const selectedLine = lines.find((line) => line.id === selectedId);
		(selectedLine as any)[field] = value;
		setRenderLines(lines);
	}

	const lengthAlphaToXy = (d: number, alpha: number, prevX: number, prevY: number) => {
		return [prevX + d * Math.cos(alpha), (prevY - d * Math.sin(alpha))];
	}

	const updateLinePoint = (line: ILine) =>{
		const prevX = line.points[0];
		const prevY = line.points[1];
		const [newX, newY] = lengthAlphaToXy(line.length, line.alpha, prevX, prevY);
		line.points[2] = newX;
		line.points[3] = newY;
	}

	const getSelectedAlpha = () => {
		const lines = [...renderLines];
		const selectedLine = lines.find((line) => line.id === selectedId);
		const alpha = selectedLine ? selectedLine.alpha : default_alpha;
		return (alpha / Math.PI);
	}

	const getSelectedLength = () => {
		const lines = [...renderLines];
		const selectedLine = lines.find((line) => line.id === selectedId);
		return selectedLine ? pointToLength(selectedLine.length) : default_length;
	}

	const updateChildsRecur = (father: ILine): void => {
		const childs = getChildren(father.id);
		childs.forEach(child => {
			child.points[0] = father.points[2];
			child.points[1] = father.points[3];
			updateLinePoint(child);
			updateChildsRecur(child);
		});
	}

	const deleteChildsRecur = (lines: ILine[], fatherIdx: number): void => {
		const childs = lines.filter((line) => line.pid === lines[fatherIdx].id); //use map to return idx?
		childs.forEach(child => {
			const childIdx = lines.findIndex((line) => line.id === child.id);
			deleteChildsRecur(lines, childIdx);
		});
		lines.splice(fatherIdx, 1)
	}

	const updateAlpha = (value: number) => {
		const lines = [...renderLines];
		const selectedLine = lines.find((line) => line.id === selectedId);
		if (!selectedLine)
			return;

		selectedLine.alpha = value * Math.PI;
		updateLinePoint(selectedLine);
		updateChildsRecur(selectedLine);
		setRenderLines(lines);
	}

	const updateLength = (value: number) => {
		if (value <= 0)
			return;
		const lines = [...renderLines];
		const selectedLine = lines.find((line) => line.id === selectedId);
		if (!selectedLine)
			return;

		selectedLine.length = lengthToPoint(value);
		updateLinePoint(selectedLine);
		updateChildsRecur(selectedLine);
		setRenderLines(lines);
	}

	const Delete = () => {
		const lines = [...renderLines];
		const index = lines.findIndex((line) => line.id === selectedId);
		if (index === -1)
			return;

		deleteChildsRecur(lines, index);
		setRenderLines(lines);
	}

	return (
	<div className="Design">
		<div className="TopPanel">
			<TopPanel lines={renderLines} neuronRad={neuronRad}/>
		</div>
		<div className="MainPanel">
			<div className="Canvas" id={"Canvas"}>
				<DesignCanvas lines={renderLines} neuronRad={neuronRad}
							  checkDeselect={checkDeselect} selectedId={selectedId}
							  setSelectedId={setSelectedId}/>
			</div>
			<div className="ControlPanel">
				<ControlPanel addNew={addNew} Delete={Delete} getSelectedLength={getSelectedLength}
								getSelectedAlpha={getSelectedAlpha} getSelectedRadius={getSelectedRadius}
								getSelectedType={getSelectedType} updateSimpleField={updateSimpleField}
								updateAlpha={updateAlpha} updateLength={updateLength}
								NeuronRad={neuronRad} updateNeuronRad={(v: number) => v > 0 && setNeuronRad(v)}
								neuronSelected={selectedId === root_id}
								lineSelected={selectedId !== none_selected && selectedId !== root_id}
				/>
			</div>
		</div>
	</div>
  );
};
export default Design;