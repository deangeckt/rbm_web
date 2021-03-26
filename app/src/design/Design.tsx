import React, { useRef, useEffect, useState  } from 'react'

const Design = (props:any) => {
  	const canvasRef = useRef(null);
	const [prevX, setPrevX] = useState(0);
	const [prevY, setPrevY] = useState(0);

	const onMouseDown = (e: any) => {
		var x = e.clientX;
		var y = e.clientY;
		setPrevX(x);
		setPrevY(y);
	}

	const onMouseMove = (e: any) => {

	}

	const onMouseUp = (e: any) => {
		var x = e.clientX;
		var y = e.clientY;
		var ctx = (canvasRef.current as any).getContext("2d");

		ctx.moveTo(prevX, prevY);
		ctx.lineTo(x,y);
		ctx.stroke();
	}


	useEffect(() => {
		console.log('init')
		const canvas = canvasRef.current as any;
		const ctx = canvas.getContext('2d');
		ctx.lineWidth = 2;
		ctx.strokeStyle = 'red';
	}, [])

  return (
	<div className='Design'>
		<canvas ref={canvasRef} className="Canvas" onMouseDown={onMouseDown}
		onMouseMove={onMouseMove} onMouseUp={onMouseUp} {...props} />
		design page

	</div>
  )
}

export default Design