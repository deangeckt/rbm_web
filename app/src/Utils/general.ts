import { prepareJsonParams } from '../api/api';
import { IAppState, ILine, SectionScheme, singleAttrObj, root_id } from '../Wrapper';
import { exportFile } from './swcUtils';

// TODO: remove redundant element created

export const downloadSwcFile = (state: IAppState, linesArray: ILine[]) => {
    const element = document.createElement('a');
    const file = new Blob(
        exportFile(linesArray, state.designLines[root_id].radius, state.stage.rootX, state.stage.rootY),
        {
            type: 'text/plain;charset=utf-8',
        },
    );
    element.href = URL.createObjectURL(file);
    element.download = 'swcTree.swc';
    document.body.appendChild(element);
    element.click();
};

export const downloadJsonParams = (globalMech: singleAttrObj, sections: Record<string, SectionScheme>) => {
    const params = prepareJsonParams(globalMech, sections);
    const jsonparams = JSON.stringify(params);
    const element = document.createElement('a');
    const file = new Blob([jsonparams], {
        type: 'type:"text/json"',
    });
    element.href = URL.createObjectURL(file);
    element.download = 'params.json';
    document.body.appendChild(element);
    element.click();
};
