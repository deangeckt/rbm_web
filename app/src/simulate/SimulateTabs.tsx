import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { AppBar, Tab, Tabs } from '@material-ui/core';
import Forms from './Forms';
import Stim from './Stim';
import './Simulate.css';

export interface ISimulateTabsProps {
    updateDialogInfo: (id: string) => void;
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
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function SimulateTabs({ updateDialogInfo, tab, setTab }: ISimulateTabsProps) {
    return (
        <div className="Tabs">
            <AppBar position="static">
                <Tabs
                    value={tab}
                    onChange={(_event: React.ChangeEvent<{}>, newValue: number) => {
                        setTab(newValue);
                    }}
                >
                    <Tab label="General" />
                    <Tab label="Stimulus" />
                    <Tab label="Recordings" />
                </Tabs>
            </AppBar>
            <TabPanel value={tab} index={0}>
                <Forms updateDialogInfo={updateDialogInfo} />
            </TabPanel>
            <TabPanel value={tab} index={1}>
                <Stim />
            </TabPanel>
            <TabPanel value={tab} index={2}>
                Recordings
            </TabPanel>
        </div>
    );
}

export default SimulateTabs;
