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
  EuiPageHeader,
  EuiHeaderLogo,
  EuiFieldSearch,
  EuiHeader,
  EuiSideNav,
  EuiPageHeaderSection,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageContentHeaderSection,
  EuiTitle,
  EuiIcon,
} from '@elastic/eui';

import {
  makeSelectCurrentUser,
  makeSelectLoading,
  makeSelectError,
} from 'containers/App/selectors';
import { logoutUser } from 'containers/App/actions';

import messages from './messages';

export function HomePage({ currentUser, doLogoutUser }) {
  const { formatMessage } = useIntl();

  const renderLogo = (
    <EuiHeaderLogo iconType="compute" href="/" aria-label="Go to home page" />
  );

  const breadcrumbs = [
    {
      text: 'Home',
      href: '/',
    },
  ];

  const renderSearch = <EuiFieldSearch placeholder="Search" compressed />;

  const sections = [
    {
      items: [renderLogo],
      borders: 'right',
      breadcrumbs,
    },
    {
      items: [renderSearch, <div style={{ width: 8 }} />],
      borders: 'none',
    },
  ];

  return (
    <EuiPage>
      <Helmet>
        <title>I Made This</title>
        <meta name="description" content="All the stuff we've made" />
      </Helmet>
      <EuiHeader sections={sections} position="fixed" />
      <EuiSideNav
        style={{ width: 192 }}
        items={[
          {
            name: currentUser.username,
            id: currentUser.username,
            icon: <EuiIcon type="user" />,
            items: [
              {
                name: formatMessage(messages.logoutButtonLabel),
                id: 'Logout',
                onClick: doLogoutUser,
              },
            ],
          },
        ]}
      />
      <EuiPageBody>
        <EuiPageHeader>
          <EuiPageHeaderSection>
            <EuiTitle size="l">
              <FormattedMessage {...messages.header} />
            </EuiTitle>
          </EuiPageHeaderSection>
          <EuiPageHeaderSection>Page abilities</EuiPageHeaderSection>
        </EuiPageHeader>
        <EuiPageContent>
          <EuiPageContentHeader>
            <EuiPageContentHeaderSection>
              <EuiTitle>
                <h2>Hello, {currentUser.username}!</h2>
              </EuiTitle>
            </EuiPageContentHeaderSection>
          </EuiPageContentHeader>
          <EuiPageContentBody>TODO</EuiPageContentBody>
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
  doLogoutUser: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser(),
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
