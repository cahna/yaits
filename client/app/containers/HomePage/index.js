import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { FormattedMessage, useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Switch, Route } from 'react-router-dom';
import {
  EuiPage,
  EuiPageBody,
  EuiEmptyPrompt,
  EuiButton,
  EuiPageContent,
  EuiPageContentBody,
} from '@elastic/eui';

import history from 'utils/history';
import { User, Team } from 'utils/sharedProps';
import { ROUTE_CREATE_TEAM, ROUTE_HOME } from 'containers/App/constants';
import {
  makeSelectCurrentUser,
  makeSelectActiveTeam,
  makeSelectLoading,
  makeSelectError,
  makeSelectAccessToken,
} from 'containers/App/selectors';
import { getActiveUser } from 'containers/App/actions';
import SideNav from 'containers/SideNav';
import NotFoundPage from 'containers/NotFoundPage/Loadable';

import messages from './messages';

export function HomePage({
  accessToken,
  currentUser,
  activeTeam,
  loadActiveUser,
}) {
  const { formatMessage } = useIntl();
  useEffect(() => {
    if (accessToken && (!currentUser || !currentUser.username)) {
      loadActiveUser();
    }
  });

  const pageContent = activeTeam.slug ? (
    'TODO'
  ) : (
    <EuiEmptyPrompt
      iconType="indexManagementApp"
      title={<h2>{formatMessage(messages.noTeamsTitle)}</h2>}
      body={
        <>
          <p>
            <FormattedMessage {...messages.noTeamsInfo} />
          </p>
          <p>
            <FormattedMessage {...messages.pleaseSetupATeam} />
          </p>
        </>
      }
      actions={
        <EuiButton
          color="primary"
          fill
          onClick={() => history.push(ROUTE_CREATE_TEAM)}
        >
          <FormattedMessage {...messages.createTeamButton} />
        </EuiButton>
      }
    />
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
      <EuiPageBody>
        <EuiPageContent>
          <EuiPageContentBody>
            <Switch>
              <Route exact path={ROUTE_HOME} render={() => pageContent} />
              <Route exact path={ROUTE_CREATE_TEAM} render={() => 'TODO'} />
              <Route component={NotFoundPage} />
            </Switch>
          </EuiPageContentBody>
        </EuiPageContent>
      </EuiPageBody>
    </EuiPage>
  );
}

HomePage.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  accessToken: PropTypes.string,
  currentUser: User.isRequired,
  activeTeam: Team.isRequired,
  loadActiveUser: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  accessToken: makeSelectAccessToken(),
  currentUser: makeSelectCurrentUser(),
  activeTeam: makeSelectActiveTeam(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

export function mapDispatchToProps(dispatch) {
  return {
    loadActiveUser: () => dispatch(getActiveUser()),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(HomePage);
