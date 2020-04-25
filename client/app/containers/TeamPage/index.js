import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { find } from 'lodash/collection';
import { get } from 'lodash/object';
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
  EuiButtonIcon,
} from '@elastic/eui';

import { User } from 'utils/sharedProps';
import { ROUTE_HOME } from 'containers/App/constants';
import {
  makeSelectCurrentUser,
  makeSelectTeamIssues,
  makeSelectLoading,
} from 'containers/App/selectors';
import { requestIssuesForTeam } from 'containers/App/actions';

import messages from './messages';
import IssuesView from './IssuesView';
import IssueFormModal from './IssueFormModal';

export function TeamPage({
  match: {
    params: { slug },
  },
  currentUser,
  allTeamIssues,
  loadIssuesForTeam,
  loading,
}) {
  const team = find(currentUser.teams, (t) => t.slug === slug);
  const { loaded: issuesLoaded, data: issues } = get(allTeamIssues, slug, {
    loaded: false,
    data: [],
  });

  useEffect(() => {
    if (team && !issuesLoaded && !loading) {
      loadIssuesForTeam(team.slug);
    }
  }, [slug, issuesLoaded, loading]);

  const { formatMessage } = useIntl();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const closeModal = () => setIsModalVisible(false);
  const showModal = () => setIsModalVisible(true);
  let modal;

  if (!team) {
    return <Redirect to={ROUTE_HOME} />;
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
          issues={issues}
          issuesLoaded={issuesLoaded}
          showModal={showModal}
        />
      </EuiPageContentBody>
    </EuiPageContent>
  );
}

TeamPage.propTypes = {
  currentUser: User.isRequired,
  allTeamIssues: PropTypes.object.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      slug: PropTypes.string,
    }),
  }).isRequired,
  loadIssuesForTeam: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser(),
  allTeamIssues: makeSelectTeamIssues(),
  loading: makeSelectLoading(),
});

const mapDispatchToProps = (dispatch) => ({
  loadIssuesForTeam: (teamSlug) => dispatch(requestIssuesForTeam(teamSlug)),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(TeamPage);
