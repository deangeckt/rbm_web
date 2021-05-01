import React from 'react';
import { Line, Transformer } from 'react-konva';
import { section_color } from '../utils/colors';
import { lineRadiusAddition } from '../utils/swcUtils';
import { RenderILine } from '../Wrapper';

interface TransLineProps {
    isSelected: boolean;
    line: RenderILine;
    click: Function;
}

const TransformerLine = ({ isSelected, line, click }: TransLineProps) => {
    const shapeRef = React.useRef();
    const trRef = React.useRef<any>();
    const color = section_color[line.tid];

    React.useEffect(() => {
        if (isSelected) {
            trRef.current!.nodes([shapeRef.current]);
            trRef.current!.getLayer().batchDraw();
        }
    }, [isSelected]);

    return (
        <React.Fragment>
            <Line
                key={line.id}
                id={line.id}
                perfectDrawEnabled={false}
                onClick={() => click()}
                ref={shapeRef as any}
                stroke={color}
                strokeWidth={line.radius + lineRadiusAddition}
                points={[...line.points]}
                draggable={false}
            />
            {isSelected && <Transformer ref={trRef} resizeEnabled={false} rotateEnabled={false} padding={10} />}
        </React.Fragment>
    );
};

export default TransformerLine;
