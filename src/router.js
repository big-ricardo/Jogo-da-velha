import React from 'react'
import {BrowserRouter, Route} from 'react-router-dom'

import App from './pages/App'

export default function Routes(){
    return(
        <BrowserRouter>
            <Route path="/" exact component={App}/>
        </BrowserRouter>
    )
}