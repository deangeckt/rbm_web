import React, { useContext } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { Button, IconButton } from '@material-ui/core';
import InfoIcon from '@mui/icons-material/Info';
import { useDialogs } from '../dialog/useDialogs';
import { useSectionForm } from '../form/useSectionForm';
import BruteGeneralParamDialog from '../dialog/BruteGeneralParamDialog';
import { AppContext } from '../../AppContext';

function SectionFormGeneralBrute() {
    const { getSectionGenenralAttr } = useSectionForm();
    const attrs_list = Object.entries(getSectionGenenralAttr());
    const { updateInfo, toggleBrute } = useDialogs();
    const { state } = useContext(AppContext);
    const currAttr = state.bruteCurrAttr;

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <BruteGeneralParamDialog attrKey={currAttr} />
            <List>
                {attrs_list.map(([attr, value]) => (
                    <ListItem key={attr}>
                        <div key={attr} style={{ display: 'flex', flexDirection: 'row' }}>
                            <IconButton color="primary" size="small" onClick={() => updateInfo(attr)}>
                                <InfoIcon />
                            </IconButton>
                            <Button
                                className="NoCapsButton"
                                variant="outlined"
                                color="primary"
                                onClick={() => toggleBrute(true, attr)}
                            >
                                {`${attr}: ${value}`}
                            </Button>
                        </div>
                    </ListItem>
                ))}
            </List>
        </div>
    );
}

export default SectionFormGeneralBrute;
