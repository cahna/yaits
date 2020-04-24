import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { find } from 'lodash/collection';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Redirect } from 'react-router-dom';
import {
  EuiPageContent,
  EuiPageContentHeader,
  EuiTitle,
  EuiPageContentHeaderSection,
  EuiPageContentBody,
} from '@elastic/eui';

import { User } from 'utils/sharedProps';
import { ROUTE_HOME } from 'containers/App/constants';
import { makeSelectCurrentUser } from 'containers/App/selectors';

import messages from './messages';

export function TeamPage({
  match: {
    params: { slug },
  },
  currentUser,
}) {
  const { formatMessage } = useIntl();
  const team = find(currentUser.teams, (t) => t.slug === slug);

  if (!team) {
    return <Redirect to={ROUTE_HOME} />;
  }

  const isOwner = team.owner.uniqueId === currentUser.uniqueId;
  const ownerLabel = isOwner ? `(${formatMessage(messages.owner)})` : undefined;

  return (
    <EuiPageContent>
      <EuiPageContentHeader>
        <EuiPageContentHeaderSection>
          <EuiTitle>
            <h2>
              {team.name} {ownerLabel}
            </h2>
          </EuiTitle>
        </EuiPageContentHeaderSection>
      </EuiPageContentHeader>
      <EuiPageContentBody>TODO</EuiPageContentBody>
    </EuiPageContent>
  );
}

TeamPage.propTypes = {
  currentUser: User.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      slug: PropTypes.string,
    }),
  }).isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser(),
});

const withConnect = connect(mapStateToProps, {});

export default compose(withConnect, memo)(TeamPage);
