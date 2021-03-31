import React from 'react';
import { Stage, Layer, Circle } from 'react-konva';
import TransformerLine from './TransformerLine';
import ControlPanel from './ControlPanel';
import { Button } from '@material-ui/core';
import './Design.css';
import { colors } from '../colors';
import { exportFile, lengthToPoint, pointToLength, neuronRadToSize } from '../Utils/SwcUtils';

export interface ILine {
	id: number;
	tid: number; // enum for user
	points: number[]; // [x1,y1, x2,y2]
	radius: number
	pid: number;
	length: number;
	alpha: number;
}

const canvas_part_size = 0.7;
const canvas_width = window.innerWidth * canvas_part_size;
const canvas_hegiht = window.innerHeight;
export const [rootX, rootY] = [canvas_width / 2, canvas_hegiht / 2 + 50];

const default_radius = 0.1; // in micro
const default_tid = 0;
const default_length = 10; //in micro
const default_neuron_rad = 5; // in micro
export const default_alpha = Math.PI * 0.1;

const none_selected = -1;
const root_id = 1;
const init_render_lines: ILine[] = [];

const Design = () => {
	const [renderLines, setRenderLines] = React.useState(init_render_lines);
	const [selectedId, setSelectedId] = React.useState(root_id);
	const [neuronRad, setNeuronRad] = React.useState(default_neuron_rad);

	const checkDeselect = (e: any) => {
		const clickedOnEmpty = e.target === e.target.getStage();
		if (clickedOnEmpty) {
			setSelectedId(none_selected);
			console.log(renderLines);
		}
	};

	const getLineChildren = (selectedLine: ILine) => {
		const lines = [...renderLines];
		return lines.filter((line) => line.pid === selectedLine.id);
	}

	const getRootChildren = () => {
		const lines = [...renderLines];
		return lines.filter((line) => line.pid === root_id);
	}

	const addNewPoints = (prevX: number, prevY: number, childrenCound: number) => {
		let newPoints: number[] = [];
		newPoints.push(prevX);
		newPoints.push(prevY);

		const newAngle = (childrenCound + 1) * default_alpha;
		const [newX, newY] = lengthAlphaToXy(lengthToPoint(default_length), newAngle, prevX, prevY);
		newPoints.push(newX);
		newPoints.push(newY);
		return {newPoints, newAngle};
	}

	const addNew = () => {
		const lines = [...renderLines];
		const selectedLine = lines.find((line) => line.id === selectedId);
		let newId: number;
		let newPid: number;
		let newPoints: number[] = [];
		let newAlpha: number;

		if (!selectedLine) {
			const rootChilds = getRootChildren().length;
			const r = addNewPoints(rootX, rootY, rootChilds);
			newPoints = r.newPoints;
			newAlpha = r.newAngle;
			newPid = root_id;
			newId = rootChilds === 0 ? root_id + 1 :lines[lines.length - 1].id + 1;
		} else {
			const prevX = selectedLine.points[2];
			const prevY = selectedLine.points[3];
			const r = addNewPoints(prevX, prevY, getLineChildren(selectedLine).length);
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
		const childs = getLineChildren(father);
		childs.forEach(child => {
			child.points[0] = father.points[2];
			child.points[1] = father.points[3];
			updateLinePoint(child);
			updateChildsRecur(child);
		});
	}

	const deleteChildsRecur = (lines: ILine[], fatherIdx: number): void => {
		const childs = lines.filter((line) => line.pid === lines[fatherIdx].id); //use map to return idx?
		console.log('childs', childs);
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

	const downloadFile = () => {
		// TODO remove redundant element created
		const element = document.createElement("a");
		const file = new Blob(exportFile(renderLines, neuronRad) ,{type: 'text/plain;charset=utf-8'});
		element.href = URL.createObjectURL(file);
		element.download = "swcTree.swc";
		document.body.appendChild(element);
		element.click();
	}

	// TODO - new line - make sure alpha is spare
	// TODO at export / finish -> fix spaces in ID's due to deletes - recur fix
	return (
	<div className="Design">
		<div className="TopPanel">
			<Button className="NoCapsButton" color="primary" variant="contained" onClick={() => downloadFile()}
					style={{marginLeft: '24px'}}>
				Export
			</Button>
			<big style={{color: 'black', display: 'block', fontSize: '26px'}}>
				RBM - Create your Neuron
			</big>
			<Button className="NoCapsButton" color="primary" variant="contained" onClick={() => null}
					style={{marginRight: '24px'}}>
				Start Simulate
			</Button>
		</div>
		<div className="MainPanel">
			<div className="Canvas">
				<Stage width={canvas_width} height={canvas_hegiht} draggable
					onMouseDown={checkDeselect} onTouchStart={checkDeselect}>
					<Layer>
						<Circle
							radius={neuronRadToSize(neuronRad)}
							fill={colors.primary}
							opacity={selectedId === root_id ? 0.8 : 0.3}
							x={rootX}
							y={rootY}
							draggable={false}
							onClick={() => setSelectedId(root_id)}
						/>
						{renderLines.map((l) => (
							<TransformerLine
								key={l.id}
								shapeProps={l}
								isSelected={l.id === selectedId}
								onSelect={() => {
									setSelectedId(l.id);
								}}
							/>
						))}
					</Layer>
				</Stage>
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