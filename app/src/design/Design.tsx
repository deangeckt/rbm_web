import React, { useRef, useEffect, useState  } from 'react'
import './Design.css';


const Design = (props:any) => {
  	const canvasRef = useRef(null);
	const [prevX, setPrevX] = useState(0);
	const [prevY, setPrevY] = useState(0);

	const onMouseDown = (e: any) => {
		var x = e.clientX;
		var y = e.clientY;
		console.log(e)
		setPrevX(x);
		setPrevY(y);
	}

	const onMouseMove = (e: any) => {

	}

	const onMouseUp = (e: any) => {
		var x = e.clientX;
		var y = e.clientY;
		console.log(x,y)

		var ctx = (canvasRef.current as any).getContext("2d");

		ctx.moveTo(prevX, prevY);
		ctx.lineTo(x,y);
		ctx.stroke();
	}


	useEffect(() => {
		console.log('init')
		const canvas = canvasRef.current as any;
		const ctx = canvas.getContext('2d');
		var size = 200;
		// Set actual size in memory (scaled to account for extra pixel density).
		var scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
		canvas.width = size * scale;
		canvas.height = size * scale;

		ctx.lineWidth = 2;
		ctx.strokeStyle = 'red';

		console.log(canvas.offsetLeft);
		console.log(canvas.offsetTop);



		ctx.moveTo(10, 10);
		ctx.lineTo(15,10);
		ctx.stroke();
	}, [])

  return (
		<div className='Design'>
			<div className="Container">
				<canvas ref={canvasRef} className="Canvas" onMouseDown={onMouseDown}
				onMouseMove={onMouseMove} onMouseUp={onMouseUp} {...props} />
			</div>
		</div>
  );
}

export default Design