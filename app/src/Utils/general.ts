import { prepareJsonParams } from '../api/api';
import { IAppState, ILine, SectionScheme, singleAttrObj, root_id, IPlotPayload } from '../Wrapper';
import { exportFile } from './swcUtils';

// TODO: remove redundant element created
const downloadAux = (blobContent: BlobPart[], type: string, fileName: string) => {
    const element = document.createElement('a');
    const file = new Blob(blobContent, { type: type });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
};

export const downloadSwcFile = (state: IAppState, linesArray: ILine[]) => {
    const content = exportFile(linesArray, state.designLines[root_id].radius, state.stage.rootX, state.stage.rootY);
    downloadAux(content, 'text/plain;charset=utf-8', 'swcTree.swc');
};

export const downloadJsonParams = (
    globalMech: singleAttrObj,
    sections: Record<string, SectionScheme>,
    description: string,
) => {
    const params = prepareJsonParams(globalMech, sections);
    params.unshift({ id: 'description', value: description });
    const jsonparams = JSON.stringify(params);
    downloadAux([jsonparams], 'type:"text/json"', 'params.json');
};

export const downloadPlots = (plots: IPlotPayload[]) => {
    const jsonparams = JSON.stringify(plots);
    downloadAux([jsonparams], 'type:"text/json"', 'plots.json');
};
