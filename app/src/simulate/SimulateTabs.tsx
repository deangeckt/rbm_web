import React, { useContext } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { AppBar, Tab, Tabs } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DynamicForm from './dynForms/DynamicForm';
import { AppContext } from '../AppContext';
import './Simulate.css';

export const global_tab = 0;
export const section_tab = 1;

export interface ISimulateTabsProps {
    tab: number;
    setTab: Function;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={2}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

// No 100% width
const useStyles = makeStyles(() => ({
    root: {
        '& .MuiBox-root': {
            margin: '0',
            padding: '0px',
            width: '100%',
        },
        '& .MuiTabs-root': {
            width: '100%',
        },
    },
}));

function SimulateTabs({ tab, setTab }: ISimulateTabsProps) {
    const classes = useStyles();
    const { state } = useContext(AppContext);

    return (
        <div className="Tabs">
            <div className={classes.root}>
                <AppBar position="static">
                    <Tabs
                        value={tab}
                        onChange={(_event: React.ChangeEvent<{}>, newValue: number) => {
                            setTab(newValue);
                        }}
                        centered
                        variant="fullWidth"
                    >
                        <Tab label="Global" />
                        <Tab label="Section" />
                    </Tabs>
                </AppBar>
                <TabPanel value={tab} index={global_tab}>
                    <DynamicForm mp={state.globalMechanism} impKey={'globalMechanism'} />
                </TabPanel>
                <TabPanel value={tab} index={section_tab}>
                    <div>Section</div>
                </TabPanel>
            </div>
        </div>
    );
}

export default SimulateTabs;
