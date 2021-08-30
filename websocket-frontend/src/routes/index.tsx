import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import Websocket from '~/pages/Websocket';
import Route from './Route';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={Websocket} />
    <Route path="/404" component={() => <h1>Página não encontrada</h1>} />
    <Redirect to="/404" />
  </Switch>
);

export default Routes;
