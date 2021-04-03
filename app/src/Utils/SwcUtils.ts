import { root_id } from "../design/Design";
import { IAppState, ILine } from "../Wrapper";

export const lenPointRatio = 5;
export const neuronRadiusRatio = 2.5;
export const lineRadiusAddition = 3;
export const swcAttr = 7;

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

export function exportFile(lines: ILine[], neuronRadius: number, rootX: number, rootY: number): BlobPart[] {
    let res = '# SWC tree generated using RBM software\n';
    res = res.concat(`1 1 0.0 0.0 0.0 ${neuronRadius} -1\n`);
    lines.forEach(line => {
        const x = pointToLength(line.points[2] - rootX).toFixed(2);
        const y = pointToLength(rootY - line.points[3]).toFixed(2);
        const lineStr = `${line.id} ${line.tid} ${x} ${y} 0.0 ${line.radius} ${line.pid}\n`;
        res = res.concat(lineStr);
    });
    return [res];
}

function textLineToILine(ilines: ILine[], line: string, rootX: number, rootY: number): ILine | {id: number, radius: number} {
    var fields = line.split(' ');
    if (fields.length !== swcAttr)
        throw new Error('SWC file bad format');

    const id =  Number(fields[0]);
    const tid = Number(fields[1]);
    const pid = Number(fields[6]);
    const radius = Number(fields[5]);

    if (id === root_id) {
        return {id: root_id, radius: radius}
    }

    let points: number[] = [];
    const x1 = lengthToPoint(Number(fields[2])) + rootX;
    const y1 = rootY - lengthToPoint(Number(fields[3]));
    let x0: number;
    let y0: number;

    if (pid === root_id) {
        x0 = rootX;
        y0 = rootY;
    } else {
        const father = ilines.find((l) => l.id === pid);
        if (!father)
            throw new Error('SWC file bad format');

        x0 = father.points[2];
        y0 = father.points[3]
    }

    points = [x0, y0, x1, y1];
    const length = Number(Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2)).toFixed(2));
    const alpha = -Math.atan((y1-y0)/(x1-x0));

    return {id: id, tid: tid, points: points, radius: radius, pid: pid,
            length: length, alpha: alpha }
}

export function importFile(text: string, rootX: number, rootY: number): Partial<IAppState> {
    const ilines: ILine[] = [];
    let neuronRad: number = -1;

    var lines = text.split('\n');
    for(var i = 0; i < lines.length; i++){
        var line = lines[i];
        if (line.startsWith('#'))
            continue;
        if (line === '')
            continue;
        var iline = textLineToILine(ilines, line, rootX, rootY);
        if (iline.id === root_id) {
            neuronRad = iline.radius;
            continue;
        }
        ilines.push(iline as ILine);
    }
    if (neuronRad === -1) {
        throw new Error('SWC file bad format - missing neuron line');
    }
    return {lines: ilines, neuronRadius: neuronRad};
}
