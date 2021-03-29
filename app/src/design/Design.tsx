import React from 'react';
import { Stage, Layer, Line, Transformer } from 'react-konva';

interface ILine {
	id: string;
	points: number[];
	rotation: number;
}

interface TransLineProps {
	shapeProps: any;
	isSelected: boolean;
	onSelect: Function;
}

const INITIAL_STATE: ILine[] = [
	{
		points: [10,50, 10,100],
		id: '0',
		rotation: 0
	},
	{
		points: [100,50, 100,100],
		id: '1',
		rotation: 0
	},
]

const TransLine = ({ shapeProps: shareProps, isSelected, onSelect }: TransLineProps) => {
	const shapeRef = React.useRef();
	const trRef = React.useRef<any>();

	React.useEffect(() => {
		if (isSelected) {
			trRef.current!.nodes([shapeRef.current]);
			trRef.current!.getLayer().batchDraw();
		}
	}, [isSelected]);

	return (
		<React.Fragment>
			<Line
				onClick={onSelect}
				onTap={onSelect}
				ref={shapeRef}
				stroke={'red'}
				strokeWidth={5}
				{...shareProps}
				draggable
			/>
			{isSelected && (
        		<Transformer ref={trRef} />
      		)}
    </React.Fragment>
  );
};


const Design = () => {
	const [lines, setLines] = React.useState(INITIAL_STATE);
	const [selectedId, setSelectedId] = React.useState('');

	const checkDeselect = (e: any) => {
		// deselect when clicked on empty area
		const clickedOnEmpty = e.target === e.target.getStage();
		if (clickedOnEmpty) {
			setSelectedId('');
			console.log(lines);
		}
	};

	return (
	<Stage width={window.innerWidth} height={window.innerHeight}
		   onMouseDown={checkDeselect} onTouchStart={checkDeselect}>
		<Layer>
			<TransLine
				key={'0'}
				shapeProps={INITIAL_STATE}
				isSelected={'0' === selectedId}
				onSelect={() => {
					setSelectedId('0');
				}}
			/>

			{lines.map((l) => (
				<TransLine
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
  );
};
export default Design;