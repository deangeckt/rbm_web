export class Engine {

	static linespace(start: number, stop: number, cardinality: number) {
		var arr = [];
		var step = (stop - start) / (cardinality - 1);
		for (var i = 0; i < cardinality; i++) {
			arr.push(start + (step * i));
		}
		return arr;
	}
}

