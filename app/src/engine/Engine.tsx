function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

export class Engine {
	public data: number[][] = [];
	public param1: number = 1.5;

	static linespace(start: number, stop: number, cardinality: number) {
		var arr = [];
		var step = (stop - start) / (cardinality - 1);
		for (var i = 0; i < cardinality; i++) {
			arr.push(start + (step * i));
		}
		return arr;
	}

	async run() {
		let x = Engine.linespace(0,5,10);
		var y = [];
		for (let i = 0; i < x.length; i++) {
			y[i] = this.param1 * Math.sin(x[i]);
			this.data[i] = [x[i], y[i]];
			await delay(100);
		}
		return this.data;
	}
}

