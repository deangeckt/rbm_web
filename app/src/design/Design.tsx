import React, { useRef, useEffect, useState  } from 'react'
import './Design.css';
export interface IPoint {
	x: number;
	y: number;
}


const pointsInit: IPoint[] = [];


const Design = () => {
  	const canvasRef = useRef(null);
	const [isDrawing, setIsDrawing] = useState(false);
	const [isMoving, setIsMoving] = useState(false);
	const [points, setPoints] = useState(pointsInit);
	const [size, setSize] = useState(0);

	const addPoint = (x: number, y: number) => {
		const currPoints = [...points];
		currPoints.push({x:x, y:y});
		setPoints(currPoints);
		setSize(size + 1);
	}

	const swapLastPoint = (x: number, y: number) => {
		const currPoints = [...points];
		currPoints[size] = {x:x, y:y};
		setPoints(currPoints);
	}

	const removeLastPoint = () => {
		const currPoints = [...points];
		currPoints.splice(size, 1);
		setPoints(currPoints);
	}

	const draw = () => {
		const canvas = canvasRef.current as any;
		var ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for (let i = 0; i < points.length; i++) {
			if (i % 2 === 0) {
				ctx.beginPath();
				// ctx.lineCap = 'round'
				ctx.moveTo(points[i].x, points[i].y);
			} else {
				ctx.lineTo(points[i].x, points[i].y);
				ctx.stroke()
			}
		};
	}

	const getCoords = (e: any) => {
		const canvas = canvasRef.current as any;
		const canvasPosition = canvas.getBoundingClientRect()
		const x =  e.clientX - canvasPosition.left;
		const y =  e.clientY - canvasPosition.top;
		return [x, y];
	}

	const onMouseDown = (e: any) => {
		const [x, y] = getCoords(e);
		addPoint(x,y);
		setIsDrawing(true);
	}

	const onMouseMove = (e: any) => {
		if (!isDrawing)
			return;

		setIsMoving(true);
		const [x, y] = getCoords(e);
		swapLastPoint(x,y);
		draw();
	}

	const onMouseUp = (_e: any) => {
		setIsDrawing(false);
		if (isMoving) {
			setIsMoving(false);
		} else {
			removeLastPoint();
		}
		console.log(points);
	}


	useEffect(() => {
		console.log('init')
		const canvas = canvasRef.current as any;
		const ctx = canvas.getContext('2d');

		canvas.height = window.innerHeight - 100
		canvas.width = window.innerWidth - 100

		ctx.lineWidth = 2;
		ctx.strokeStyle = 'red';

	}, [])

  return (
		<div className='Design'>
			<div className="Container">
				<canvas ref={canvasRef} className="Canvas" onMouseDown={onMouseDown}
				onMouseMove={onMouseMove} onMouseUp={onMouseUp} />
			</div>
		</div>
  );
}

export default Design


