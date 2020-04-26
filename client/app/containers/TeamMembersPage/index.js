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
  EuiInMemoryTable,
  EuiSpacer,
} from '@elastic/eui';

import { User } from 'utils/sharedProps';
import { ROUTE_TEAMS } from 'containers/App/constants';
import { makeSelectCurrentUser } from 'containers/App/selectors';

import messages from './messages';

export function TeamMembersPage({
  match: {
    params: { slug },
  },
  currentUser,
}) {
  const { formatMessage } = useIntl();
  const team = find(currentUser.teams, (t) => t.slug === slug);

  if (!team) {
    return <Redirect to={ROUTE_TEAMS} />;
  }

  const isOwner = team.owner.uniqueId === currentUser.uniqueId;
  const ownerLabel = isOwner ? `(${formatMessage(messages.owner)})` : undefined;

  const columns = [
    {
      field: 'username',
      name: formatMessage(messages.usernameHeader),
      sortable: true,
      dataType: 'string',
    },
    {
      field: 'uniqueId',
      name: formatMessage(messages.uniqueIdHeader),
      sortable: false,
      dataType: 'string',
    },
  ];

  const sorting = {
    sort: {
      field: 'username',
      direction: 'asc',
    },
  };

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
      <EuiPageContentBody>
        <EuiTitle size="s">
          <h3>{formatMessage(messages.teamMembersTitle)}</h3>
        </EuiTitle>
        <EuiSpacer />
        <EuiInMemoryTable
          items={team.members}
          columns={columns}
          pagination
          sorting={sorting}
        />
      </EuiPageContentBody>
    </EuiPageContent>
  );
}

TeamMembersPage.propTypes = {
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

export default compose(withConnect, memo)(TeamMembersPage);
