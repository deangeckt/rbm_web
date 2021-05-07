import React from 'react';
import { useTreeText } from '../../tree/useTreeText';
import { ISection, section_recording } from '../../Wrapper';
import MechProcItem from './MechProcItem';
import './Summary.css';

export interface ISectionItemProps {
    section: ISection;
}

function SectionItem({ section }: ISectionItemProps) {
    const { sectionKeyToLabel } = useTreeText();
    const recording_value = section_recording.find((sr) => sr.value === section.recording_type)!.label;

    return (
        <div className="SummarySection">
            <div className="SummaryKey">{sectionKeyToLabel(section.id)}:</div>
            <div className="SummarySectionItem">
                <p style={{ margin: 0 }}>
                    <u>Recording:</u> {recording_value}
                </p>

                <div className="SummarySectionHeader">Mechanism:</div>

                {Object.entries(section.mechanism).map(([name, mp]) => {
                    return <MechProcItem key={name} id={name} item={mp} />;
                })}
                <div className="SummarySectionHeader">Process:</div>

                {Object.entries(section.process).map(([section, proc]) => {
                    return (
                        <div key={section}>
                            <div>section({section})</div>
                            {Object.entries(proc).map(([name, mp]) => {
                                return <MechProcItem key={name} id={name} item={mp} />;
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default SectionItem;
