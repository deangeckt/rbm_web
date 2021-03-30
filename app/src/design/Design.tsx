import React from 'react';
import { Stage, Layer, Circle } from 'react-konva';
import TransformerLine from './TransformerLine';
import { Button, InputAdornment, MenuItem, TextField } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

interface IRenderLine {
	id: number;
	tid: number; // enum for user
	points: number[]; // [x1,y1, x2,y2]
	radius: number
	pid: number;
	length: number;
	alpha: number;
}

const types = [
	{
	  value: 0,
	  label: 'undefined',
	},
	{
	  value: '2',
	  label: 'axon',
	},
	{
	  value: '3',
	  label: 'basal dendrite',
	},
	{
	  value: '4',
	  label: 'apical dendrite',
	},
];

const default_radius = 0.1;
const default_tid = 0;
const default_length = 100;
const default_alpha = Math.PI * 0.1;
const none_selected = -1;
const root_id = 1;
const [rootX, rootY] = [window.innerWidth / 2, window.innerHeight / 2 + 50];
const init_render_lines: IRenderLine[] = [];

const Design = () => {
	const [renderLines, setRenderLines] = React.useState(init_render_lines);
	const [selectedId, setSelectedId] = React.useState(root_id);

	const checkDeselect = (e: any) => {
		const clickedOnEmpty = e.target === e.target.getStage();
		if (clickedOnEmpty) {
			setSelectedId(none_selected);
			console.log(renderLines);
		}
	};

	const getLineChildren = (selectedLine: IRenderLine) => {
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
		const [newX, newY] = lengthAlphaToXy(default_length, newAngle, prevX, prevY);
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
		lines.push({id: newId, points: newPoints, pid: newPid, radius: default_radius, tid: default_tid, length: default_length, alpha: newAlpha});
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
		const lines = [...renderLines];
		const selectedLine = lines.find((line) => line.id === selectedId);
		(selectedLine as any)[field] = value;
		setRenderLines(lines);
	}

	const lengthAlphaToXy = (d: number, alpha: number, prevX: number, prevY: number) => {
		return [prevX + d * Math.cos(alpha), (prevY - d * Math.sin(alpha))];
	}

	const updateLinePoint = (line: IRenderLine) =>{
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
		return selectedLine ? selectedLine.length : default_length;
	}

	const updateChildsRecur = (father: IRenderLine): void => {
		const childs = getLineChildren(father);
		childs.forEach(child => {
			child.points[0] = father.points[2];
			child.points[1] = father.points[3];
			updateLinePoint(child);
			updateChildsRecur(child);
		});
	}

	const deleteChildsRecur = (lines: IRenderLine[], fatherIdx: number): void => {
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
		const lines = [...renderLines];
		const selectedLine = lines.find((line) => line.id === selectedId);
		if (!selectedLine)
			return;

		selectedLine.length = value;
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

	// TODO add all text fields to control panel component
	// TODO radius validation > 0 - maybe show err
	// TODO - new line - make sure alpha is spare
	// TODO at export / finish -> fix spaces in ID's due to deletes - recur fix
	return (
	<>
	<div>
		<Button variant="outlined" color="primary" startIcon={<AddIcon />}
				disabled={selectedId === none_selected} onClick={() => addNew()}>
			Add Line
		</Button>
		<TextField label={'Length [µM]'} variant="filled" type="number" value={getSelectedLength()}
					disabled={selectedId === none_selected || selectedId === root_id}
					onChange={(e) => updateLength(Number(e.target.value))} />
		<TextField label={'α [Rad]'} variant="filled" type="number" value={getSelectedAlpha()}
					disabled={selectedId === none_selected || selectedId === root_id}
					onChange={(e) => updateAlpha(Number(e.target.value))}
					InputProps={{	inputProps: { min: 0, max: 2 * Math.PI, step: default_alpha * 0.1,  },
									endAdornment: <InputAdornment position="end">PI</InputAdornment>, }} />
		<TextField label={'Radius [µM]'} variant="filled" type="number" value={getSelectedRadius()}
					disabled={selectedId === none_selected || selectedId === root_id}
					onChange={(e) => updateSimpleField('radius', Number(e.target.value))} />
		<TextField select label="Type" variant="filled"  value={getSelectedType()}
					onChange={(e) => updateSimpleField('tid', Number(e.target.value))}
					disabled={selectedId === none_selected || selectedId === root_id} >
        	{types.map((option) => (
				<MenuItem key={option.value} value={option.value}>
					{option.label}
				</MenuItem>
        	))}
        </TextField>
		<Button variant="outlined" color="primary" startIcon={<DeleteIcon />}
				disabled={selectedId === none_selected || selectedId === root_id} onClick={() => Delete()}>
			Delete Line
		</Button>
	</div>
	<Stage width={window.innerWidth} height={window.innerHeight}
		   onMouseDown={checkDeselect} onTouchStart={checkDeselect}>
		<Layer>
			<Circle
				radius={10}
				fill={'black'}
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
	</>
  );
};
export default Design;