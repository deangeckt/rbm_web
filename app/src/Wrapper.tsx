import React, { useState } from 'react'
import { AppContext } from './Contexts/AppContext'

export interface AppState {
    data: {},
    fname: string,
    lname: string
}

const Wrapper = (props: any) => {

	const [state, setState] = useState<AppState>({
        fname: 'Dean',
        lname: 'Geckt',
        data: {}
    })
    
    return (
        <>     
            <AppContext.Provider value={{state, setState}}>
                {props.children}
            </AppContext.Provider>
        </>
    )
}

export default Wrapper
