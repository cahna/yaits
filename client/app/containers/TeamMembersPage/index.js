import React, { memo, useState } from 'react';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Redirect } from 'react-router-dom';
import {
  EuiButtonIcon,
  EuiInMemoryTable,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageContentHeaderSection,
  EuiPopover,
  EuiSpacer,
  EuiTitle,
} from '@elastic/eui';

import { User, Team } from 'utils/sharedProps';
import { ROUTE_TEAMS } from 'containers/App/constants';
import TextFieldInlineForm from 'components/TextFieldInlineForm/Loadable';
import {
  makeSelectCurrentUser,
  makeSelectTeam,
} from 'containers/App/selectors';

import messages from './messages';

export function TeamMembersPage({ currentUser, team }) {
  const { formatMessage } = useIntl();
  const [isPopoverOpen, setPopoverOpen] = useState(false);

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

  const closePopover = () => setPopoverOpen(false);
  const togglePopover = () => setPopoverOpen(!isPopoverOpen);

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
        <EuiPageContentHeaderSection>
          <EuiPopover
            button={
              <EuiButtonIcon
                color="primary"
                onClick={togglePopover}
                iconType="plusInCircle"
                aria-label={formatMessage(messages.inviteUserToTeamLabel)}
              />
            }
            isOpen={isPopoverOpen}
            closePopover={closePopover}
          >
            <TextFieldInlineForm
              onSubmit={closePopover}
              fieldLabel="User ID"
              buttonText="Save"
            />
          </EuiPopover>
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
  team: Team,
};

const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser(),
  team: makeSelectTeam(),
});

const withConnect = connect(mapStateToProps, {});

export default compose(withConnect, memo)(TeamMembersPage);
