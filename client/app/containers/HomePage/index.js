import React, { memo } from 'react';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Redirect } from 'react-router-dom';
import {
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiTitle,
  EuiPageContentHeaderSection,
} from '@elastic/eui';

import { User } from 'utils/sharedProps';
import { ROUTE_TEAMS } from 'containers/App/constants';
import { makeSelectCurrentUser } from 'containers/App/selectors';
import NoTeamsPrompt from 'components/NoTeamsPrompt/Loadable';

import messages from './messages';

export function HomePage({ currentUser }) {
  const { formatMessage } = useIntl();

  let pageContent = <NoTeamsPrompt />;

  if (currentUser.teams.length > 0) {
    // TODO: Make some dashboard-like content
    pageContent = <Redirect to={ROUTE_TEAMS} />;
  }

  return (
    <EuiPageContent>
      <EuiPageContentHeader>
        <EuiPageContentHeaderSection>
          <EuiTitle>
            <h2>
              {formatMessage(messages.welcomeBack)} {currentUser.username}
            </h2>
          </EuiTitle>
        </EuiPageContentHeaderSection>
      </EuiPageContentHeader>
      <EuiPageContentBody>{pageContent}</EuiPageContentBody>
    </EuiPageContent>
  );
}

HomePage.propTypes = {
  currentUser: User.isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser(),
});

const withConnect = connect(mapStateToProps, {});

export default compose(withConnect, memo)(HomePage);
