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
  EuiFlexItem,
  EuiCard,
  EuiIcon,
  EuiSpacer,
  EuiFlexGroup,
} from '@elastic/eui';

import history from 'utils/history';
import { User } from 'utils/sharedProps';
import { ROUTE_TEAMS } from 'containers/App/constants';
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
          <h3>{formatMessage(messages.actionsTitle)}</h3>
        </EuiTitle>
        <EuiFlexGroup gutterSize="l">
          <EuiFlexItem>
            <EuiCard
              icon={<EuiIcon size="xxl" type="reportingApp" />}
              title={formatMessage(messages.viewTeamIssuesTitle)}
              description={formatMessage(messages.viewTeamIssuesDescription)}
              onClick={() => history.push(`${ROUTE_TEAMS}/${slug}/issues`)}
            />
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiCard
              icon={<EuiIcon size="xxl" type="usersRolesApp" />}
              title={formatMessage(messages.manageMembersTitle)}
              description={formatMessage(messages.manageMembersDescription)}
              onClick={() => history.push(`${ROUTE_TEAMS}/${slug}/members`)}
              isDisabled
            />
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiSpacer />
        <EuiTitle size="s">
          <h3>Team members:</h3>
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
