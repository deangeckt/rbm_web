import React from 'react';
import { sectionKeyToLabel } from '../../utils/generalUtils';
import { SectionScheme, section_recording } from '../../Wrapper';
import MechProcItem from './MechProcItem';
import './Summary.css';

export interface ISectionItemProps {
    section: SectionScheme;
}

function SectionItem({ section }: ISectionItemProps) {
    const segmentKeys =
        Object.keys(section.process).length > 0 ? Object.keys(section.process) : Object.keys(section.records);

    const getRecordConcatString = (records: number[] | undefined): string => {
        if (!records) return 'None';
        let res = '';
        section_recording.forEach((record, idx) => {
            if (records.indexOf(idx) !== -1) res = res.concat(record + ', ');
        });
        return res === '' ? 'None' : res.slice(0, -2);
    };

    return (
        <div className="SummarySection">
            <div className="SummaryKey">{sectionKeyToLabel(section.id)}:</div>
            <div className="SummarySectionItem">
                <div className="SummarySectionHeader">General:</div>
                <MechProcItem id={'general'} item={{ attrs: section.general }} />

                <div className="SummarySectionHeader">Mechanism:</div>
                {Object.entries(section.mechanism).map(([name, mp]) => (
                    <MechProcItem key={name} id={name} item={mp} />
                ))}

                {segmentKeys.map((sectionKey) => {
                    return (
                        <div key={sectionKey}>
                            <div className="SummaryKey">Section({sectionKey})</div>
                            <p style={{ margin: 0, marginTop: '8px' }}>
                                <u>Recording:</u> {getRecordConcatString(section.records[Number(sectionKey)])}
                            </p>
                            <div className="SummarySectionHeader">Process:</div>
                            {Object.entries(section.process[Number(sectionKey)] ?? {}).map(([name, mps]) => {
                                return mps.map((mp, i) => <MechProcItem key={`${name}_${i}`} id={name} item={mp} />);
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default SectionItem;
