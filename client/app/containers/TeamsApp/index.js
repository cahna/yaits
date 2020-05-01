import React, { memo } from 'react';
import { Switch, Route } from 'react-router-dom';

import {
  ROUTE_TEAMS,
  ROUTE_TEAM_MEBERS,
  ROUTE_TEAM,
  ROUTE_ISSUES,
} from 'containers/App/constants';
import TeamsPage from 'containers/TeamsPage/Loadable';
import TeamPage from 'containers/TeamPage/Loadable';
import IssuesApp from 'containers/IssuesApp/Loadable';
import TeamMembersPage from 'containers/TeamMembersPage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';

export const TeamsApp = () => (
  <Switch>
    <Route exact path={ROUTE_TEAMS} component={TeamsPage} />
    <Route exact path={ROUTE_TEAM_MEBERS} component={TeamMembersPage} />
    <Route exact path={ROUTE_TEAM} component={TeamPage} />
    <Route path={ROUTE_ISSUES} component={IssuesApp} />
    <Route component={NotFoundPage} />
  </Switch>
);

export default memo(TeamsApp);
