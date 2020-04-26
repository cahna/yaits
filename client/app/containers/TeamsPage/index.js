import React, { memo } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { useIntl } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import {
  EuiPageContent,
  EuiPageContentHeader,
  EuiTitle,
  EuiPageContentHeaderSection,
  EuiPageContentBody,
  EuiButtonIcon,
  EuiInMemoryTable,
  EuiLink,
} from '@elastic/eui';

import history from 'utils/history';
import { User } from 'utils/sharedProps';
import { ROUTE_CREATE_TEAM, ROUTE_TEAMS } from 'containers/App/constants';
import { makeSelectCurrentUser } from 'containers/App/selectors';
import NoTeamsPrompt from 'components/NoTeamsPrompt/Loadable';

import messages from './messages';

export const TeamsPage = ({ currentUser }) => {
  const { formatMessage } = useIntl();

  const numTeams = currentUser.teams.length;
  let pageContent = <NoTeamsPrompt />;

  if (numTeams > 1) {
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
      <EuiInMemoryTable
        items={currentUser.teams}
        columns={columns}
        pagination
      />
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
  currentUser: User.isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser(),
});

const withConnect = connect(mapStateToProps, {});

export default compose(withConnect, memo)(TeamsPage);
