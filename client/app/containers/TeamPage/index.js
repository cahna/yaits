import React, { memo } from 'react';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Redirect } from 'react-router-dom';
import {
  EuiCard,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageContentHeaderSection,
  EuiSpacer,
  EuiTitle,
} from '@elastic/eui';

import history from 'utils/history';
import { User, Team } from 'utils/sharedProps';
import { ROUTE_TEAMS } from 'containers/App/constants';
import {
  makeSelectCurrentUser,
  makeSelectTeam,
} from 'containers/App/selectors';

import messages from './messages';

export function TeamPage({ currentUser, team }) {
  const { formatMessage } = useIntl();

  if (!team) {
    return <Redirect to={ROUTE_TEAMS} />;
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
              onClick={() => history.push(`${ROUTE_TEAMS}/${team.slug}/issues`)}
            />
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiCard
              icon={<EuiIcon size="xxl" type="usersRolesApp" />}
              title={formatMessage(messages.manageMembersTitle)}
              description={formatMessage(messages.manageMembersDescription)}
              onClick={() =>
                history.push(`${ROUTE_TEAMS}/${team.slug}/members`)
              }
            />
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiCard
              icon={<EuiIcon size="xxl" type="managementApp" />}
              title={formatMessage(messages.manageTeamTitle)}
              description={formatMessage(messages.manageTeamDescription)}
              onClick={() =>
                history.push(`${ROUTE_TEAMS}/${team.slug}/settings`)
              }
              isDisabled
            />
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiSpacer />
      </EuiPageContentBody>
    </EuiPageContent>
  );
}

TeamPage.propTypes = {
  currentUser: User.isRequired,
  team: Team,
};

const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser(),
  team: makeSelectTeam(),
});

const withConnect = connect(mapStateToProps, {});

export default compose(withConnect, memo)(TeamPage);
