import React from 'react';
import { useTreeText } from '../../tree/useTreeText';
import { ISection } from '../../Wrapper';
import MechProcItem from './MechProcItem';
import './Summary.css';

export interface ISectionItemProps {
    section: ISection;
}

function SectionItem({ section }: ISectionItemProps) {
    const { sectionKeyToLabel } = useTreeText();

    return (
        <div className="SummarySection">
            <div className="SummaryKey">{sectionKeyToLabel(section.id)}:</div>
            <div className="SummarySectionItem">
                <div className="SummarySectionHeader">Mechanism:</div>

                {Object.entries(section.mechanism).map(([name, mp]) => {
                    return <MechProcItem key={name} id={name} item={mp} />;
                })}
                <div className="SummarySectionHeader">Process:</div>

                {section.process.map((proc) => {
                    {
                        <div>Process: {proc.section}</div>;
                        Object.entries(proc).map(([name, mp]) => {
                            return <MechProcItem key={name} id={name} item={mp} />;
                        });
                    }
                })}
            </div>
        </div>
    );
}

export default SectionItem;
