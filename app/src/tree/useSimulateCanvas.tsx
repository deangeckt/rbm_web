import { useContext } from 'react';
import { AppContext } from '../AppContext';
import {
    ISection,
    default_section_value,
    ILine,
    root_key,
    root_id,
    section_types,
    none_selected_key,
} from '../Wrapper';

export function useSimulateCanvas() {
    const { state, setState } = useContext(AppContext);

    const updateChildsBelow = (x_delta: number, y_delta: number): void => {
        const ents = Object.values(state.sections);
        for (let i = 0; i < ents.length; i++) {
            const section = ents[i];
            if (section.key === root_key) continue;
            for (let i = 0; i < section.points.length; i++) {
                if (i % 2 === 0) section.points[i] += x_delta;
                else section.points[i] += y_delta;
            }
        }
    };

    const addNewSection = (key: string, pid: string, swc_id: number): ISection => {
        return {
            key: key,
            pidKey: pid,
            section: default_section_value,
            recording_type: 0,
            mechanism: {},
            process: {},
            mechanismCurrKey: '',
            processCurrKey: '',
            children: [],
            swc_id: swc_id,
            points: [],
        };
    };

    let cid = -1;
    const setCids = (
        lines: Record<string, ILine>,
        sections: Record<string, ISection>,
        id: number,
        tid: number,
        pidKey: string,
    ) => {
        const childs = lines[id].lineChilds;
        for (let i = 0; i < childs.length; i++) {
            const line = lines[childs[i]];
            if (line.tid !== tid) continue;

            cid += 1;
            line.cid = cid;
            const lineChilds = lines[line.id].lineChilds;

            const key = `${cid}_${tid}`;
            if (!sections[key]) {
                sections[key] = addNewSection(key, pidKey, line.id);
                sections[pidKey].children.push(key);
            }

            if (lineChilds.length === 0) {
                continue;
            }

            if (lineChilds.length === 1) {
                cid -= 1;
            }
            setCids(lines, sections, line.id, tid, key);
        }
    };

    const setSimulationTreeSections = () => {
        const designLines = { ...state.designLines };
        const sections = { ...state.sections };
        sections[root_key] = addNewSection(root_key, '', root_id);
        sections[root_key].points = [...designLines[root_id].points];

        const ents = Object.values(designLines);
        section_types.forEach((sec_type) => {
            const sec_lines = ents.filter((l) => l.tid === sec_type.value);
            if (sec_lines.length > 0) {
                const startPid = sec_lines[0].pid !== -1 ? sec_lines[0].pid : root_id;
                cid = sec_type.value === 1 ? 0 : -1; // on type soma since we have root, start cids from 0
                setCids(designLines, sections, startPid, sec_type.value, root_key);
            }
        });

        for (const [key, sec] of Object.entries(sections)) {
            if (key === root_key) continue;

            const line = designLines[sec.swc_id];
            if (line.lineChilds.length !== 1) {
                sec.points = [...line.points];
            } else {
                const pidPoints = sections[sec.pidKey].points;
                sec.points = pidPoints.slice(Math.max(pidPoints.length - 2, 1));

                const branchCids = Object.values(designLines).filter((l) => l.cid === line.cid && l.tid === line.tid);
                branchCids.sort((a, b) => (a.id > b.id && 1) || -1);
                for (const branchLine of branchCids) {
                    const p = branchLine.points;
                    sec.points = sec.points.concat(p.slice(Math.max(p.length - 2, 1)));
                }
            }
        }
        return { sections };
    };

    const setSelectedId = (id: string) => {
        setState({ ...state, selectedId: id });
    };

    const checkDeselect = (e: any) => {
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            setSelectedId(none_selected_key);
        }
    };

    const getLinesArrayNoRoot = () => {
        const ents = Object.values(state.sections);
        const sec = ents.filter((section) => {
            return section.key !== root_key;
        });
        return sec.map((s) => {
            return {
                points: s.points,
                id: s.key,
                radius: 1,
                tid: 1,
            };
        });
    };

    return { setSimulationTreeSections, updateChildsBelow, setSelectedId, checkDeselect, getLinesArrayNoRoot };
}
