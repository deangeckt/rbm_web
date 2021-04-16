import React from 'react';
import './Anims.css';

function ReadLoading() {
    return (
        <>
            <div className="lds-roller">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </>
    );
}

export default ReadLoading;
