import React from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { FreeLine } from './FreeHandPlot';

export interface IFreeHandCanvasProps {
    lines: FreeLine[];
    setLines: Function;
}

const FreeHandCanvas = ({ lines, setLines }: IFreeHandCanvasProps) => {
    // const [lines, setLines] = React.useState(init_lines);
    const isDrawing = React.useRef(false);

    const handleMouseDown = (e: any) => {
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        setLines([...lines, { points: [pos.x, pos.y] }]);
    };

    const handleMouseMove = (e: any) => {
        // no drawing - skipping
        if (!isDrawing.current) {
            return;
        }
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        const lastLine = lines[lines.length - 1];
        if (!lastLine) return;
        // add point
        lastLine.points = lastLine.points.concat([point.x, point.y]);

        // replace last
        lines.splice(lines.length - 1, 1, lastLine);
        setLines(lines.concat());
    };

    const stopDraw = () => {
        isDrawing.current = false;
    };

    return (
        <div>
            <Stage
                width={500}
                height={500}
                onMouseDown={handleMouseDown}
                onMousemove={handleMouseMove}
                onMouseup={stopDraw}
                onTouchEnd={stopDraw}
            >
                <Layer>
                    {lines.map((line, i) => (
                        <Line
                            key={i}
                            points={line.points}
                            stroke="#677be9"
                            strokeWidth={3}
                            tension={1}
                            lineCap="round"
                            globalCompositeOperation={'source-over'}
                        />
                    ))}
                </Layer>
            </Stage>
        </div>
    );
};
export default FreeHandCanvas;
