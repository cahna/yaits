import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { useIntl } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import {
  EuiButtonIcon,
  EuiInMemoryTable,
  EuiLink,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageContentHeaderSection,
  EuiTitle,
} from '@elastic/eui';

import history from 'utils/history';
import { Team } from 'utils/sharedProps';
import { ROUTE_CREATE_TEAM, ROUTE_TEAMS } from 'containers/App/constants';
import { makeSelectCurrentUserTeams } from 'containers/App/selectors';
import NoTeamsPrompt from 'containers/NoTeamsPrompt/Loadable';

import messages from './messages';

export const TeamsPage = ({ teams }) => {
  const { formatMessage } = useIntl();

  const numTeams = teams.length;
  let pageContent = <NoTeamsPrompt />;

  if (numTeams > 0) {
    const columns = [
      {
        name: formatMessage(messages.teamNameHeader),
        render: (
          { slug, name }, // eslint-disable-line react/prop-types
        ) => (
          <EuiLink onClick={() => history.push(`${ROUTE_TEAMS}/${slug}`)}>
            {name}
          </EuiLink>
        ),
        sortable: ({ name }) => name,
        truncateText: true,
        dataType: 'string',
        width: '50%',
      },
      {
        name: formatMessage(messages.ownerHeader),
        render: ({ owner: { username } }) => username,
        sortable: ({ owner: { username } }) => username,
        dataType: 'string',
        truncateText: true,
      },
      {
        name: formatMessage(messages.memberCountHeader),
        render: ({ members }) => members.length,
        sortable: ({ members }) => members.length,
        dataType: 'number',
      },
    ];

    pageContent = (
      <EuiInMemoryTable items={teams} columns={columns} pagination />
    );
  }

  return (
    <EuiPageContent>
      <EuiPageContentHeader>
        <EuiPageContentHeaderSection>
          <EuiTitle>
            <h2>You are a member of {numTeams} teams</h2>
          </EuiTitle>
        </EuiPageContentHeaderSection>
        <EuiPageContentHeaderSection>
          <EuiButtonIcon
            color="primary"
            onClick={() => history.push(ROUTE_CREATE_TEAM)}
            iconType="plusInCircle"
            aria-label={formatMessage(messages.createNewTeamLabel)}
          />
        </EuiPageContentHeaderSection>
      </EuiPageContentHeader>
      <EuiPageContentBody>{pageContent}</EuiPageContentBody>
    </EuiPageContent>
  );
};

TeamsPage.propTypes = {
  teams: PropTypes.arrayOf(Team).isRequired,
};

const mapStateToProps = createStructuredSelector({
  teams: makeSelectCurrentUserTeams(),
});

const withConnect = connect(mapStateToProps, {});

export default compose(withConnect, memo)(TeamsPage);
