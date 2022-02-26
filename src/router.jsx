import React from 'react';
import {Route, Switch, BrowserRouter} from 'react-router-dom';
import Dashboard from './views/dashboard';

const Router = props => {

    return (
        <BrowserRouter>
            <Switch>
                <Route path='/' component={Dashboard} />
            </Switch>
        </BrowserRouter>
    )
};

export default Router;