import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Redirect } from 'react-router-dom';
import {
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageContentHeaderSection,
  EuiTitle,
} from '@elastic/eui';

import { User, Team } from 'utils/sharedProps';
import { ROUTE_TEAMS } from 'containers/App/constants';
import {
  makeSelectCurrentUser,
  makeSelectUserTeams,
} from 'containers/App/selectors';
import NoTeamsPrompt from 'containers/NoTeamsPrompt/Loadable';

import messages from './messages';

export function HomePage({ user = {}, teams }) {
  const { formatMessage } = useIntl();

  let pageContent = <NoTeamsPrompt />;

  if (Object.keys(teams).length > 0) {
    // TODO: Make some dashboard-like content
    pageContent = <Redirect to={ROUTE_TEAMS} />;
  }

  return (
    <EuiPageContent>
      <EuiPageContentHeader>
        <EuiPageContentHeaderSection>
          <EuiTitle>
            <h2>
              {formatMessage(messages.welcomeBack)} {user.username}
            </h2>
          </EuiTitle>
        </EuiPageContentHeaderSection>
      </EuiPageContentHeader>
      <EuiPageContentBody>{pageContent}</EuiPageContentBody>
    </EuiPageContent>
  );
}

HomePage.propTypes = {
  user: User,
  teams: PropTypes.objectOf(Team).isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser(),
  teams: makeSelectUserTeams(),
});

const withConnect = connect(mapStateToProps, {});

export default compose(withConnect, memo)(HomePage);
