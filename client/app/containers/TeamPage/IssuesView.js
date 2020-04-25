import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';
import {
  EuiInMemoryTable,
  EuiEmptyPrompt,
  EuiButton,
  EuiLoadingContent,
} from '@elastic/eui';

import { Issue } from 'utils/sharedProps';
import messages from './messages';

export function IssuesView({ issues, issuesLoaded, showModal }) {
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
      onClick: () => {},
      'data-test-subj': 'action-edit-issue',
    },
    {
      name: formatMessage(messages.deleteIssueAction),
      description: formatMessage(messages.deleteIssueAction),
      icon: 'trash',
      color: 'danger',
      type: 'icon',
      onClick: () => {},
      isPrimary: true,
      'data-test-subj': 'action-delete-issue',
    },
  ];

  const columns = [
    {
      field: 'shortDescription',
      name: formatMessage(messages.issueShortDescription),
      sortable: true,
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
      width: '10%',
    },
    {
      field: 'assignedTo',
      name: formatMessage(messages.issueAssignedTo),
      render: ({ username }) => username,
      dataType: 'string',
      sortable: true,
    },
    {
      field: 'createdBy',
      name: formatMessage(messages.issueCreatedBy),
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
      field: 'priority',
      direction: 'asc',
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
  issuesLoaded: PropTypes.oneOfType([PropTypes.number, PropTypes.bool])
    .isRequired,
  showModal: PropTypes.func.isRequired,
};

export default memo(IssuesView);
