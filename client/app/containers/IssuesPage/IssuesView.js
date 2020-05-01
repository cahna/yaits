import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { useIntl, FormattedMessage } from 'react-intl';
import {
  EuiInMemoryTable,
  EuiEmptyPrompt,
  EuiButton,
  EuiLoadingContent,
  EuiLink,
} from '@elastic/eui';

import history from 'utils/history';
import { Issue } from 'utils/sharedProps';
import { ROUTE_TEAMS } from 'containers/App/constants';
import { submitDeleteIssue } from 'containers/App/actions';

import messages from './messages';

export function IssuesView({
  issues,
  issuesLoaded,
  showModal,
  handleDeleteIssue,
}) {
  const { formatMessage, formatDate } = useIntl();

  if (!issuesLoaded) {
    return <EuiLoadingContent lines={10} />;
  }

  if (issuesLoaded && issues.length < 1) {
    return (
      <>
        <EuiEmptyPrompt
          iconType="indexManagementApp"
          title={<h2>{formatMessage(messages.noIssuesTitle)}</h2>}
          body={
            <p>
              <FormattedMessage {...messages.noIssuesInfo} />
            </p>
          }
          actions={
            <EuiButton color="primary" fill onClick={showModal}>
              <FormattedMessage {...messages.newIssue} />
            </EuiButton>
          }
        />
      </>
    );
  }

  const actions = [
    {
      name: formatMessage(messages.editIssueAction),
      description: formatMessage(messages.editIssueActionDesc),
      isPrimary: true,
      icon: 'pencil',
      type: 'icon',
      onClick: ({ uniqueId, team: { slug } }) =>
        history.push(`${ROUTE_TEAMS}/${slug}/issues/${uniqueId}`),
      'data-test-subj': 'action-edit-issue',
    },
    {
      name: formatMessage(messages.deleteIssueAction),
      description: formatMessage(messages.deleteIssueAction),
      icon: 'trash',
      color: 'danger',
      type: 'icon',
      onClick: handleDeleteIssue,
      isPrimary: true,
      'data-test-subj': 'action-delete-issue',
    },
  ];

  const columns = [
    {
      name: formatMessage(messages.issueShortDescription),
      render: (
        { team: { slug }, shortDescription, uniqueId }, // eslint-disable-line react/prop-types
      ) => {
        const href = `${ROUTE_TEAMS}/${slug}/issues/${uniqueId}`;
        return (
          <EuiLink
            href={href}
            onClick={(e) => {
              e.preventDefault();
              history.push(href);
            }}
          >
            {shortDescription}
          </EuiLink>
        );
      },
      sortable: ({ shortDescription }) => shortDescription,
      truncateText: true,
      dataType: 'string',
      width: '25%',
    },
    {
      field: 'status',
      name: formatMessage(messages.issueStatus),
      render: ({ name }) => name,
      sortable: ({ status: { ordering } }) => ordering,
      dataType: 'string',
      width: '10%',
    },
    {
      field: 'priority',
      name: formatMessage(messages.issuePriority),
      sortable: true,
      dataType: 'number',
      align: 'left',
    },
    {
      field: 'assignedTo',
      name: formatMessage(messages.issueAssignedTo),
      render: ({ username }) => username,
      dataType: 'string',
      sortable: true,
    },
    {
      field: 'dateUpdated',
      name: formatMessage(messages.issueDateUpdated),
      render: (date) => formatDate(new Date(date)),
      sortable: (date) => new Date(date),
      dataType: 'number',
      truncateText: true,
    },
    {
      name: formatMessage(messages.actionsHeader),
      actions,
    },
  ];

  const sorting = {
    sort: {
      field: 'dateUpdated',
      direction: 'desc',
    },
  };

  return (
    <>
      <EuiInMemoryTable
        items={issues}
        columns={columns}
        pagination
        sorting={sorting}
      />
    </>
  );
}

IssuesView.propTypes = {
  issues: PropTypes.arrayOf(Issue).isRequired,
  issuesLoaded: PropTypes.number,
  showModal: PropTypes.func.isRequired,
  handleDeleteIssue: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  handleDeleteIssue: ({ uniqueId: issueUniqueId, teamSlug }) =>
    dispatch(submitDeleteIssue({ issueUniqueId, teamSlug })),
});

const withConnect = connect(null, mapDispatchToProps);

export default compose(withConnect, memo)(IssuesView);
