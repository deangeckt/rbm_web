import React from 'react';
import { Stage, Layer, Line, Text } from 'react-konva';
import { brute_force_main, border_color } from '../../util/colors';
import { simpleLine } from './FreeHandPlot';

interface gridText {
    text: string;
    x: number;
    y: number;
}

const canvasSize = 500;
const canvasWrap = 50;
const gridSize = 15;
const textFontSize = 13;

export interface IFreeHandCanvasProps {
    lines: simpleLine[];
    setLines: Function;
    time: number;
    miny: number;
    maxy: number;
}

export const x_pixel_to_grid = (pixel: number, time: number): number => {
    const canvasWrapAdd = canvasWrap / 2;
    const fixedPixel = pixel - canvasWrapAdd;
    return (fixedPixel * time) / canvasSize;
};

export const y_pixel_to_grid = (pixel: number, maxy: number, miny: number): number => {
    const canvasWrapAdd = canvasWrap / 2;
    const fixedPixel = pixel - canvasWrapAdd;
    const yLen = maxy + Math.abs(miny);
    const scaled = (fixedPixel * yLen) / canvasSize;
    return maxy - scaled;
};

const FreeHandCanvas = ({ lines, setLines, time, maxy, miny }: IFreeHandCanvasProps) => {
    const isDrawing = React.useRef(false);

    const createGridLines = (): simpleLine[] => {
        const res: simpleLine[] = [];
        const step = canvasSize / gridSize;
        const canvasWrapAdd = canvasWrap / 2;
        for (let i = 0; i <= gridSize; i += 1) {
            const add = i * step + canvasWrapAdd;
            // vertical lines
            res.push({ points: [add, canvasWrapAdd, add, canvasSize + canvasWrapAdd] });
            // horiz lines
            res.push({ points: [canvasWrapAdd, add, canvasSize + canvasWrapAdd, add] });
        }
        return res;
    };

    const createGridText = (): gridText[] => {
        const res: gridText[] = [];
        const step = canvasSize / gridSize;
        const canvasWrapAdd = canvasWrap / 2;
        const decimalFixedHoriz = time > 100 ? 0 : 1;
        for (let i = 0; i <= gridSize; i += 1) {
            const add = i * step + canvasWrapAdd;
            // horiz text
            res.push({
                text: x_pixel_to_grid(add, time).toFixed(decimalFixedHoriz),
                x: add,
                y: canvasSize + canvasWrap - textFontSize,
            });
            // vertical text
            res.push({
                text: y_pixel_to_grid(add, maxy, miny).toFixed(0),
                x: canvasWrapAdd - textFontSize - 8,
                y: add - 5,
            });
        }
        return res;
    };

    const isPointInGrid = (point: { x: number; y: number }): boolean => {
        const canvasWrapHalf = canvasWrap / 2;
        if (point.x < canvasWrapHalf) return false;
        if (point.x > canvasSize + canvasWrapHalf) return false;
        if (point.y < canvasWrapHalf) return false;
        if (point.y > canvasSize + canvasWrapHalf) return false;
        return true;
    };

    const handleMouseDown = (e: any) => {
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        setLines([...lines, { points: [pos.x, pos.y] }]);
    };

    const handleMouseMove = (e: any) => {
        if (!isDrawing.current) return;

        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        if (!isPointInGrid(point)) return;

        const lastLine = lines[lines.length - 1];
        if (!lastLine) return;
        lastLine.points = lastLine.points.concat([point.x, point.y]);

        lines.splice(lines.length - 1, 1, lastLine);
        setLines(lines.concat());
    };

    const stopDraw = () => {
        isDrawing.current = false;
    };

    return (
        <div>
            <Stage
                width={canvasSize + canvasWrap}
                height={canvasSize + canvasWrap}
                onMouseDown={handleMouseDown}
                onMousemove={handleMouseMove}
                onMouseup={stopDraw}
                onTouchEnd={stopDraw}
            >
                <Layer>
                    {createGridLines().map((line, i) => (
                        <Line
                            key={`grid:${i}`}
                            points={line.points}
                            stroke={border_color}
                            strokeWidth={2}
                            tension={0.5}
                            lineCap="round"
                        />
                    ))}
                    {createGridText().map((gt, i) => (
                        <Text
                            key={`gridText:${i}`}
                            x={gt.x}
                            y={gt.y}
                            text={gt.text}
                            fontSize={textFontSize}
                            fontFamily={'Calibri'}
                            fill={'black'}
                        />
                    ))}
                    {lines.map((line, i) => (
                        <Line
                            key={i}
                            points={line.points}
                            stroke={brute_force_main}
                            strokeWidth={3}
                            tension={0.5}
                            lineCap="round"
                            perfectDrawEnabled={true}
                            globalCompositeOperation={'source-over'}
                        />
                    ))}
                </Layer>
            </Stage>
        </div>
    );
};
export default FreeHandCanvas;
