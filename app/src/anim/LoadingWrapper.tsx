import React from 'react';
import Loading from './Loading';

export interface ILoadingProps {
    text: string;
}

function LoadingWrapper({ text }: ILoadingProps) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Loading />
            <div>{text}</div>
        </div>
    );
}

export default LoadingWrapper;
