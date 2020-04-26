import React, { memo } from 'react';
import { Switch, Route } from 'react-router-dom';

import { ROUTE_TEAMS } from 'containers/App/constants';
import TeamsPage from 'containers/TeamsPage/Loadable';
import TeamPage from 'containers/TeamPage/Loadable';
import TeamIssuesPage from 'containers/TeamIssuesPage/Loadable';
import TeamMembersPage from 'containers/TeamMembersPage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';

export const TeamsApp = () => (
  <Switch>
    <Route exact path={ROUTE_TEAMS} component={TeamsPage} />
    <Route exact path={`${ROUTE_TEAMS}/:slug`} component={TeamPage} />
    <Route
      exact
      path={`${ROUTE_TEAMS}/:slug/issues`}
      component={TeamIssuesPage}
    />
    <Route
      exact
      path={`${ROUTE_TEAMS}/:slug/members`}
      component={TeamMembersPage}
    />
    <Route component={NotFoundPage} />
  </Switch>
);

export default memo(TeamsApp);
