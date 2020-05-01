import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Redirect } from 'react-router-dom';
import {
  EuiButtonIcon,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageContentHeaderSection,
  EuiTitle,
} from '@elastic/eui';

import { User, Team, Issue } from 'utils/sharedProps';
import { ROUTE_TEAMS } from 'containers/App/constants';
import {
  makeSelectCurrentUser,
  makeSelectTeamIssues,
  makeSelectLoading,
  makeSelectTeam,
  makeSelectTeamIssuesLoaded,
} from 'containers/App/selectors';
import { loadTeamIssues } from 'containers/App/actions';

import messages from './messages';
import IssuesView from './IssuesView';
import IssueFormModal from './IssueFormModal';

export function IssuesPage({
  currentUser,
  team,
  issues,
  issuesLoaded,
  loadIssuesForTeam,
  loading,
}) {
  useEffect(() => {
    if (team && !issuesLoaded && !loading) {
      loadIssuesForTeam(team.slug);
    }
  }, [team, issuesLoaded, loading]);

  const { formatMessage } = useIntl();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const closeModal = () => setIsModalVisible(false);
  const showModal = () => setIsModalVisible(true);
  let modal;

  if (!team) {
    return <Redirect to={ROUTE_TEAMS} />;
  }

  const isOwner = team.owner.uniqueId === currentUser.uniqueId;
  const ownerLabel = isOwner ? `(${formatMessage(messages.owner)})` : undefined;

  if (isModalVisible) {
    modal = (
      <IssueFormModal
        teamSlug={team.slug}
        closeModal={closeModal}
        issueStatuses={team.issueStatuses}
      />
    );
  }

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
          <EuiButtonIcon
            color="primary"
            onClick={showModal}
            iconType="plusInCircle"
            aria-label={formatMessage(messages.newIssue)}
            disabled={loading}
          />
          <EuiButtonIcon
            color="success"
            onClick={() => loadIssuesForTeam(team.slug)}
            iconType="refresh"
            aria-label={formatMessage(messages.reloadData)}
            disabled={loading}
          />
        </EuiPageContentHeaderSection>
      </EuiPageContentHeader>
      <EuiPageContentBody>
        {modal}
        <IssuesView
          issues={Object.values(issues)}
          issuesLoaded={issuesLoaded}
          showModal={showModal}
        />
      </EuiPageContentBody>
    </EuiPageContent>
  );
}

IssuesPage.propTypes = {
  currentUser: User.isRequired,
  team: Team.isRequired,
  issues: PropTypes.arrayOf(Issue).isRequired,
  issuesLoaded: PropTypes.number,
  loadIssuesForTeam: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser(),
  team: makeSelectTeam(),
  issues: makeSelectTeamIssues(),
  issuesLoaded: makeSelectTeamIssuesLoaded(),
  loading: makeSelectLoading(),
});

const mapDispatchToProps = (dispatch) => ({
  loadIssuesForTeam: (teamSlug) => dispatch(loadTeamIssues(teamSlug)),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(IssuesPage);
