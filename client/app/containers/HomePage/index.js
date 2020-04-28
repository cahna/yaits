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

import { Team } from 'utils/sharedProps';
import { ROUTE_TEAMS } from 'containers/App/constants';
import {
  makeSelectCurrentUsername,
  makeSelectCurrentUserTeams,
} from 'containers/App/selectors';
import NoTeamsPrompt from 'containers/NoTeamsPrompt/Loadable';

import messages from './messages';

export function HomePage({ username, teams }) {
  const { formatMessage } = useIntl();

  let pageContent = <NoTeamsPrompt />;

  if (teams.length > 0) {
    // TODO: Make some dashboard-like content
    pageContent = <Redirect to={ROUTE_TEAMS} />;
  }

  return (
    <EuiPageContent>
      <EuiPageContentHeader>
        <EuiPageContentHeaderSection>
          <EuiTitle>
            <h2>
              {formatMessage(messages.welcomeBack)} {username}
            </h2>
          </EuiTitle>
        </EuiPageContentHeaderSection>
      </EuiPageContentHeader>
      <EuiPageContentBody>{pageContent}</EuiPageContentBody>
    </EuiPageContent>
  );
}

HomePage.propTypes = {
  username: PropTypes.string,
  teams: PropTypes.arrayOf(Team).isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentUsername: makeSelectCurrentUsername(),
  teams: makeSelectCurrentUserTeams(),
});

const withConnect = connect(mapStateToProps, {});

export default compose(withConnect, memo)(HomePage);
