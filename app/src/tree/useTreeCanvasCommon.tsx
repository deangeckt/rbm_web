import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

export function useTreeCanvasCommon() {
    const { state, setState } = useContext(AppContext);

    const handleWheel = (e: any) => {
        e.evt.preventDefault();
        const scaleBy = 1.15;
        const stage = e.target.getStage();
        const oldScale = stage.scaleX();
        const mousePointTo = {
            x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
            y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
        };

        const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
        const newStageCoord = {
            x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
            y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
        };
        setState({ ...state, stageScale: newScale, stageCoord: newStageCoord });
    };

    return { handleWheel };
}
