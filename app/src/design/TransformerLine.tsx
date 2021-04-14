import React from 'react';
import { Line, Transformer } from 'react-konva';
import { section_color } from '../colors';
import { lineRadiusAddition } from '../utils/SwcUtils';

interface TransLineProps {
    shapeProps: any;
    isSelected: boolean;
    onSelect: Function;
}

const TransformerLine = ({ shapeProps, isSelected, onSelect }: TransLineProps) => {
    const shapeRef = React.useRef();
    const trRef = React.useRef<any>();
    const color = section_color[shapeProps.tid];

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
                stroke={color}
                strokeWidth={shapeProps.radius + lineRadiusAddition}
                {...shapeProps}
                draggable={false}
            />
            {isSelected && <Transformer ref={trRef} resizeEnabled={false} rotateEnabled={false} padding={10} />}
        </React.Fragment>
    );
};

export default TransformerLine;
