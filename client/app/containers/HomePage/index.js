import React, { memo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import {
  EuiEmptyPrompt,
  EuiButton,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiTitle,
  EuiPageContentHeaderSection,
} from '@elastic/eui';

import history from 'utils/history';
import { User } from 'utils/sharedProps';
import { ROUTE_CREATE_TEAM } from 'containers/App/constants';
import { makeSelectCurrentUser } from 'containers/App/selectors';

import messages from './messages';

export function HomePage({ currentUser }) {
  const { formatMessage } = useIntl();

  if ((currentUser.teams || []).length < 1) {
    return (
      <EuiPageContent>
        <EuiPageContentBody>
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
        </EuiPageContentBody>
      </EuiPageContent>
    );
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
