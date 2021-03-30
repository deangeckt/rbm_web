import React from 'react';
import { Stage, Layer, Circle } from 'react-konva';
import TransformerLine from './TransformerLine';
import { Button, TextField } from '@material-ui/core';

interface IRenderLine {
	id: number;
	tid: number; // enum for user
	points: number[]; // [x1,y1, x2,y2]
	radius: number
	pid: number;
}

const default_radius = 0.1;
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

	const distanceAlphaToXy = (d: number, alpha: number, prevX: number, prevY: number) => {
		return [prevX + d * Math.cos(alpha), (prevY - d * Math.sin(alpha))];
	}

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

		const newAngle = (childrenCound + 1) * Math.PI * 0.1;
		const [newX, newY] = distanceAlphaToXy(100, newAngle, prevX, prevY);
		newPoints.push(newX);
		newPoints.push(newY);
		return newPoints;
	}

	const addNew = () => {
		const lines = [...renderLines];
		const selectedLine = lines.find((line) => line.id === selectedId);
		let newId: number;
		let newPid: number;
		let newPoints: number[] = [];

		if (!selectedLine) {
			const rootChilds = getRootChildren().length;
			newPid = root_id;
			newPoints = addNewPoints(rootX, rootY, rootChilds);
			newId = rootChilds === 0 ? root_id + 1 :lines[lines.length - 1].id + 1;
		} else {
			const prevX = selectedLine.points[2];
			const prevY = selectedLine.points[3];
			newPoints = addNewPoints(prevX, prevY, getLineChildren(selectedLine).length);
			newId = lines[lines.length - 1].id + 1;
			newPid = selectedLine.id;
		}
		lines.push({id: newId, points: newPoints, tid: -1, pid: newPid, radius: default_radius});
		setRenderLines(lines);
		setSelectedId(newId);
	}

	const getSelectedRadius = () => {
		const lines = [...renderLines];
		const selectedLine = lines.find((line) => line.id === selectedId);
		return selectedLine ? selectedLine.radius : default_radius;
	}

	const updateSimpleField = (field: "tid" | "radius", value: number) => {
		const lines = [...renderLines];
		const selectedLine = lines.find((line) => line.id === selectedId);

		if (!selectedLine)
			return;

		(selectedLine as any)[field] = value;
		setRenderLines(lines);
	}

	// TODO panel to control radius ~ strokeWidth, tid -> enum, and distance and alpha to control ending of point
	// TODO radius validation > 0 - maybe show err
	return (
	<>
	<div>
		<Button className="Button" variant="outlined" color="primary" disabled={selectedId === -1} onClick={() => addNew()}>
			Add
		</Button>
		<TextField label={'Radius [µM]'} variant="filled" type="number" value={getSelectedRadius()}
					onChange={(e) => updateSimpleField('radius', Number(e.target.value))} />

	</div>
	<Stage width={window.innerWidth} height={window.innerHeight}
		   onMouseDown={checkDeselect} onTouchStart={checkDeselect}>
		<Layer>
			<Circle
				radius={20}
				fill={'red'}
				opacity={selectedId === root_id ? 0.8 : 0.3}
				x={rootX}
				y={rootY + 20}
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