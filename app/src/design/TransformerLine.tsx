import React from "react";
import { Line, Transformer } from "react-konva";

interface TransLineProps {
	shapeProps: any;
	isSelected: boolean;
	onSelect: Function;
}

const TransformerLine = ({ shapeProps: shareProps, isSelected, onSelect }: TransLineProps) => {
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
				strokeWidth={shareProps.radius + 3}
				{...shareProps}
				draggable={false}
			/>
			{isSelected && (
        		<Transformer ref={trRef} resizeEnabled={false} rotateEnabled={false} padding={10}/>
      		)}
    </React.Fragment>
  );
};

export default TransformerLine;