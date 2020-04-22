import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { FormattedMessage, useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import {
  EuiPage,
  EuiPageBody,
  EuiEmptyPrompt,
  EuiButton,
  EuiSideNav,
  EuiPageContent,
  EuiPageContentBody,
  // EuiPageContentHeader,
  // EuiPageContentHeaderSection,
  EuiIcon,
} from '@elastic/eui';

import {
  makeSelectCurrentUser,
  makeSelectActiveTeam,
  makeSelectLoading,
  makeSelectError,
} from 'containers/App/selectors';
import { logoutUser } from 'containers/App/actions';

import messages from './messages';

export function HomePage({ currentUser, doLogoutUser, activeTeam }) {
  const { formatMessage } = useIntl();

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
        <EuiButton color="primary" fill>
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
      <EuiSideNav
        style={{ width: 192 }}
        items={[
          {
            name: formatMessage(messages.teamsNavHeader),
            id: messages.teamsNavHeader.id,
            icon: <EuiIcon type="users" />,
            items: [
              {
                name: formatMessage(messages.createTeamButton),
                id: messages.createTeamButton.id,
                icon: <EuiIcon type="plusInCircle" />,
                onClick: doLogoutUser,
              },
            ],
          },
          {
            name: currentUser.username,
            id: currentUser.uniqueId,
            icon: <EuiIcon type="user" />,
            items: [
              {
                name: formatMessage(messages.logoutButtonLabel),
                id: messages.logoutButtonLabel.id,
                onClick: doLogoutUser,
              },
            ],
          },
        ]}
      />
      <EuiPageBody>
        <EuiPageContent>
          <EuiPageContentBody>{pageContent}</EuiPageContentBody>
        </EuiPageContent>
      </EuiPageBody>
    </EuiPage>
  );
}

HomePage.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  currentUser: PropTypes.shape({
    username: PropTypes.string,
    uniqueId: PropTypes.string,
  }).isRequired,
  activeTeam: PropTypes.shape({
    name: PropTypes.string,
    slug: PropTypes.string,
  }).isRequired,
  doLogoutUser: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser(),
  activeTeam: makeSelectActiveTeam(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

export function mapDispatchToProps(dispatch) {
  return {
    doLogoutUser: () => dispatch(logoutUser()),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(HomePage);
