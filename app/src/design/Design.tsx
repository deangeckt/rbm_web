import React from 'react';
import { Stage, Layer, Circle } from 'react-konva';
import TransformerLine from './TransformerLine';

interface IRenderLine {
	id: string;
	points: number[];
}

interface ISwcLine {
	id: string;
	tid: string; // enum for user
	x: number;
	y: number;
	z: number;
	r: number;
	pid: string;
}


const init_render_lines: IRenderLine[] = [
	{
		points: [window.innerWidth / 2,
				 window.innerHeight / 2 + 50,
				 window.innerWidth / 2,
				 window.innerHeight / 2 - 50],
		id: '1',
	},
]

const Design = () => {
	const [renderLines, setRenderLines] = React.useState(init_render_lines);
	const [selectedId, setSelectedId] = React.useState('');

	const checkDeselect = (e: any) => {
		// deselect when clicked on empty area
		const clickedOnEmpty = e.target === e.target.getStage();
		if (clickedOnEmpty) {
			setSelectedId('');
			console.log(renderLines);
		}
	};

	return (
	<>
	<div>
		side panel
	</div>
	<Stage width={window.innerWidth} height={window.innerHeight}
		   onMouseDown={checkDeselect} onTouchStart={checkDeselect}>
		<Layer>
			<Circle
				radius={10}
				fill={'red'}
				opacity={0.5}
				x={window.innerWidth / 2}
				y={window.innerHeight / 2 + 50+10}
				draggable={false}
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