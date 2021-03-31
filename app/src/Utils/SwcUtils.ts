import { ILine, rootX, rootY } from "../design/Design";

export const lenPointRatio = 5;
export const neuronRadiusRatio = 2.5;
export const lineRadiusAddition = 3;

export function lengthToPoint(length: number) {
    return length * lenPointRatio;
}

export function pointToLength(point: number) {
    return point / lenPointRatio;
}

export function neuronRadToSize(r: number) {
    return r * neuronRadiusRatio;
}

export function sizeToNeuronRad(s: number) {
    return s / neuronRadiusRatio;
}

export function exportFile(lines: ILine[], neuronRadius = 1.0): BlobPart[] {
    let res = '# SWC tree generated using RBM software\n';
    res = res.concat(`1 1 0.0 0.0 0.0 ${neuronRadius.toFixed(2)} -1\n`);
    lines.forEach(line => {
        const x = pointToLength(line.points[2] - rootX).toFixed(2);
        const y = pointToLength(rootY - line.points[3]).toFixed(2);
        const lineStr = `${line.id} ${line.tid} ${x} ${y} 0.0 ${line.radius} ${line.pid}\n`;
        res = res.concat(lineStr);
    });
    return [res];
}
