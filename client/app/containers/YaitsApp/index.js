/**
 * YaitsApp - Root app for authenticated users
 */
import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Switch, Route } from 'react-router-dom';
import { EuiPage, EuiPageBody, EuiLoadingContent } from '@elastic/eui';

import { User } from 'utils/sharedProps';
import {
  ROUTE_CREATE_TEAM,
  ROUTE_HOME,
  ROUTE_TEAMS,
} from 'containers/App/constants';
import {
  makeSelectCurrentUser,
  makeSelectLoading,
  makeSelectAccessToken,
} from 'containers/App/selectors';
import { loadActiveUser } from 'containers/App/actions';
import SideNav from 'containers/SideNav/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import HomePage from 'containers/HomePage/Loadable';
import CreateTeamPage from 'containers/CreateTeamPage/Loadable';
import TeamsApp from 'containers/TeamsApp/Loadable';

import messages from './messages';

export function YaitsApp({
  loading,
  accessToken,
  currentUser,
  reloadActiveUser,
}) {
  const { formatMessage } = useIntl();
  useEffect(() => {
    if (accessToken && (!currentUser || !currentUser.username)) {
      reloadActiveUser();
    }
  }, []);

  const pageContent = loading ? (
    <EuiLoadingContent lines={3} />
  ) : (
    <Switch>
      <Route exact path={ROUTE_HOME} component={HomePage} />
      <Route exact path={ROUTE_CREATE_TEAM} component={CreateTeamPage} />
      <Route path={ROUTE_TEAMS} component={TeamsApp} />
      <Route component={NotFoundPage} />
    </Switch>
  );

  return (
    <EuiPage>
      <Helmet>
        <title>{formatMessage(messages.pageTitle)}</title>
        <meta
          name="description"
          content={formatMessage(messages.pageDescription)}
        />
      </Helmet>
      <SideNav />
      <EuiPageBody>{pageContent}</EuiPageBody>
    </EuiPage>
  );
}

YaitsApp.propTypes = {
  loading: PropTypes.bool,
  accessToken: PropTypes.string,
  currentUser: User.isRequired,
  reloadActiveUser: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  accessToken: makeSelectAccessToken(),
  currentUser: makeSelectCurrentUser(),
  loading: makeSelectLoading(),
});

const mapDispatchToProps = (dispatch) => ({
  reloadActiveUser: () => dispatch(loadActiveUser()),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(YaitsApp);
