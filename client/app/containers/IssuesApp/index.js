import React, { memo } from 'react';
import { Switch, Route } from 'react-router-dom';

import { ROUTE_ISSUE, ROUTE_ISSUES } from 'containers/App/constants';
import IssuePage from 'containers/IssuePage/Loadable';
import IssuesPage from 'containers/IssuesPage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';

export const IssuesApp = () => (
  <Switch>
    <Route exact path={ROUTE_ISSUES} component={IssuesPage} />
    <Route exact path={ROUTE_ISSUE} component={IssuePage} />
    <Route component={NotFoundPage} />
  </Switch>
);

export default memo(IssuesApp);
