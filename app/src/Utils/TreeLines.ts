import { ILine } from '../Wrapper';

export class TreeLines {
    root: number;
    map: Map<number, ILine[]>;
    cid: number;

    constructor(root_id: number) {
        this.root = root_id;
        this.map = new Map();
        this.map.set(root_id, []);
        this.cid = -1;
    }

    // O(1)
    insert(line: ILine) {
        const pid = line.pid;
        const childs = this.map.get(pid);
        childs?.push(line);
        this.map.set(line.id, []);
    }

    setCid() {
        this.setCidAux(this.root);
    }

    //O(n);
    private setCidAux(id: number) {
        const childs = this.map.get(id);
        for (let i = 0; i < childs!.length; i++) {
            this.cid += 1;
            const line = childs![i];
            line.cid = this.cid;

            const lineChilds = this.map.get(line.id);
            if (!lineChilds || lineChilds.length === 0) continue;
            lineChilds.length === 1 && (this.cid -= 1);
            this.setCidAux(line.id);
        }
    }
}
